namespace WebAPI.Models.Requests;

public class ConsumableRequest
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string? State { get; set; }

    public decimal? Price { get; set; }

    public string BaseUnit { get; set; }
}
