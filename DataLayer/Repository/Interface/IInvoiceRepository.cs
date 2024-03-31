namespace DataLayer.Repository.Interface;

using Entities;

public interface IInvoiceRepository : IRepository<Invoice>
{
    public ICollection<Invoice> GetAll();

    Invoice GetSingleWithRelated(Guid id);
}
