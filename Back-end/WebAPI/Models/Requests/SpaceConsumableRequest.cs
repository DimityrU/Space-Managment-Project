namespace WebAPI.Models.Requests;

public class SpaceConsumableRequest
{
    public Guid Id { get; set; }

    public Guid ConsumablesId { get; set; }

    public Guid? SpaceId { get; set; }

    public int? Count { get; set; }

    public string? State { get; set; }

    public ConsumableRequest? Consumables { get; set; }
}
