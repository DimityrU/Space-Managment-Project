namespace BusinessLayer.Services.Interfaces;

using Contracts;
using Models;

public interface IBookingService
{
    BookingInfoResponse GetBookingInfo(BookingRequest request);

    Task<BaseResponse> AddBooking(BookingDTO booking);

    CollectionResponse<BookingDetailsDTO> GetAllBookings();

    Task<BaseResponse> DeleteBooking(Guid id);
}