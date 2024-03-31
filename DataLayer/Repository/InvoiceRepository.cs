namespace DataLayer.Repository;

using Entities;
using Interface;
using Microsoft.EntityFrameworkCore;

public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(SMContext context) : base(context)
    {
    }

    public ICollection<Invoice> GetAll()
    {
        var invoices = DbSet
            .Include(i => i.Booking).ThenInclude(iB => iB.Client)
            .Include(i => i.Booking).ThenInclude(iB => iB.Space)
            .OrderByDescending(invoice => invoice.InvoiceNumber);

        return invoices.ToList();
    }

    public Invoice? GetSingleWithRelated(Guid id)
    {
        var invoice = DbSet
            .Include(i => i.Booking)
            .ThenInclude(ib => ib.Client)
            .Include(i => i.Booking)
            .ThenInclude(ib => ib.Space)
            .Include(i => i.InvoiceConsumables)
            .FirstOrDefault(i => i.Id == id);

        return invoice;
    }
}
