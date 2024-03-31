namespace BusinessLayer.Contracts;

using Models;

public class BookingInfoResponse : BaseResponse
{
    public SpaceBookingsDTO? BookingSpace { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public ICollection<ClientBookingDTO>? ClientBooking { get; set; }
}