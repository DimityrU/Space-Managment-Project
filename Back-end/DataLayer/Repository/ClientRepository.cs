namespace DataLayer.Repository;

using Entities;
using Interface;

public class ClientRepository : Repository<Client>, IClientRepository
{
    public ClientRepository(SMContext context)
        : base(context)
    {
    }

    public IEnumerable<Client> GetCurrentClients()
    {
        return DbSet.Where(c => !c.IsDeleted).OrderBy(c => c.Name).ToList();
    }
}