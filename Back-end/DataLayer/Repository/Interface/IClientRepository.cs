namespace DataLayer.Repository.Interface;

using Entities;

public interface IClientRepository : IRepository<Client>
{
    public IEnumerable<Client> GetCurrentClients();
}