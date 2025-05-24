namespace WebAPI.Controllers;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/booking")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ISpaceService _spaceService;

    public BookingController(IBookingService bookingService, ISpaceService spaceService)
    {
        _bookingService = bookingService;
        _spaceService = spaceService;
    }

    [HttpGet("all")]
    public ActionResult<CollectionResponse<SpaceBookingsDTO>> GetBookings()
    {
        var response = _spaceService.GetAllSpacesWithBookings();

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpGet("bookingInfo")]
    public ActionResult<BookingInfoResponse> GetBookingInformation([FromQuery] BookingRequest request)
    {
        var response = _bookingService.GetBookingInfo(request);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpPost("bookingInfo/book")]
    public async Task<ActionResult<BaseResponse>> Book([FromBody] BookingDTO booking)
    {
        var response = await _bookingService.AddBooking(booking);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpGet("all-bookings")]
    public ActionResult<CollectionResponse<BookingDetailsDTO>> GetAllBookings()
    {
        var response = _bookingService.GetAllBookings();

        if (response.HasError())
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPatch("delete/{id}")]
    public async Task<ActionResult<BaseResponse>> DeleteBooking([FromBody] Guid id)
    {
        var response = await _bookingService.DeleteBooking(id);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }
}
