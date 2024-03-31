namespace BusinessLayer.Models;

using System;

public class ConsumableDTO
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string? State { get; set; }

    public decimal? Price { get; set; }

    public string BaseUnit { get; set; }
}
