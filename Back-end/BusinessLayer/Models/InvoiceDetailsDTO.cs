namespace BusinessLayer.Models;

using InvoiceDTOs.Create;

public class InvoiceDetailsDTO
{
    public string InvoiceNumber { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime BookingStartDate { get; set; }

    public DateTime BookingEndDate { get; set; }

    public string ClientName { get; set; }

    public string ClientPin { get; set; }

    public string SpaceName { get; set; }

    public decimal Amount { get; set; }

    public List<InvoiceConsumableDTO> InvoiceConsumables { get; set; }
}
