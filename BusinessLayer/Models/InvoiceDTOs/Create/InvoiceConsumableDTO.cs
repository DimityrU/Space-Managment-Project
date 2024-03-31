namespace BusinessLayer.Models.InvoiceDTOs.Create;

public class InvoiceConsumableDTO
{
    public Guid? Id { get; set; }

    public Guid InvoiceId { get; set; }

    public string Name { get; set; }

    public decimal Price { get; set; }

    public int Count { get; set; }
}