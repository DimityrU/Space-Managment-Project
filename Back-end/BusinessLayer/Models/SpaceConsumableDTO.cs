namespace BusinessLayer.Models;

using System;

public class SpaceConsumableDTO
{
    public Guid Id { get; set; }

    public Guid ConsumablesId { get; set; }

    public Guid? SpaceId { get; set; }

    public int? Count { get; set; }

    public string? State { get; set; }

    public ConsumableDTO? Consumables { get; set; }
}
