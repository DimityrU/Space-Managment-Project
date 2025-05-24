namespace BusinessLayer.Models.InvoiceDTOs;

using System;

public class InvoiceDisplayDTO
{
    public Guid Id { get; set; }

    public string InvoiceNumber { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal? Amount { get; set; }

    public bool Paid { get; set; }

    public string SpaceName { get; set; }

    public string ClientName { get; set; }
}
