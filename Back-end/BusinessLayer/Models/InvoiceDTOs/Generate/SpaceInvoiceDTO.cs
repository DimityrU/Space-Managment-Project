namespace BusinessLayer.Models.InvoiceDTOs.Generate;

using System.Collections.Generic;

public class SpaceInvoiceDTO
{
    public string Name { get; set; }

    public ICollection<SpaceConsumablesInvoiceDTO> SpaceConsumables { get; set; }
}
