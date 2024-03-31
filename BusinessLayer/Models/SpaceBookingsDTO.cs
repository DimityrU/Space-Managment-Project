namespace BusinessLayer.Models;

public class SpaceBookingsDTO
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public double Size { get; set; }

    public double Volume { get; set; }

    public virtual ICollection<BookingDates>? Bookings { get; set; }
}
