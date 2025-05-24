namespace BusinessLayer.Models;

public class SpaceDTO
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public double Size { get; set; }

    public double Volume { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<BookingDetailsDTO>? Bookings { get; set; } = new List<BookingDetailsDTO>();

    public virtual ICollection<SpaceConsumableDTO>? SpaceConsumables { get; set; } = new List<SpaceConsumableDTO>();
}