namespace BusinessLayer.Models;

using System;

public class BookingDetailsDTO
{
    public Guid Id { get; set; }

    public Guid? SpaceId { get; set; }

    public Guid? ClientId { get; set; }

    public string? ClientName { get; set; }

    public string? SpaceName { get; set; }

    public decimal? Price { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
