namespace BusinessLayer.Contracts;

public class BookingRequest
{
    public Guid SpaceId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}