namespace BusinessLayer.Models;

public class BookingDTO
{
    public Guid Id { get; set; }

    public Guid? SpaceId { get; set; }

    public Guid? ClientId { get; set; }

    public decimal? Price { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
