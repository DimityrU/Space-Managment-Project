namespace BusinessLayer.Models.InvoiceDTOs.Generate;

public class InvoiceInfoDTO
{
    public Guid Id { get; set; }

    public SpaceInvoiceDTO Space { get; set; }

    public ClientInvoiceDTO Client { get; set; }

    public decimal? Price { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
}
