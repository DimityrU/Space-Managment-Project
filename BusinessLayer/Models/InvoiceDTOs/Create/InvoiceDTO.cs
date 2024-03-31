namespace BusinessLayer.Models.InvoiceDTOs.Create;

public class InvoiceDTO
{
    public Guid? Id { get; set; }

    public string? InvoiceNumber { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid BookingId { get; set; }

    public decimal Amount { get; set; }

    public bool? Paid { get; set; }

    public List<InvoiceConsumableDTO>? InvoiceConsumables { get; set; }
}