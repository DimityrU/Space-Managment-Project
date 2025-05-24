namespace DataLayer.Repository;

using System.Linq;

using Entities;
using Interface;
using Microsoft.EntityFrameworkCore;

public class DeletableRepository<TEntity> : Repository<TEntity>, IDeletableRepository<TEntity>
    where TEntity : class
{
    public DeletableRepository(SMContext context)
        : base(context)
    {

    }

    public void DeleteEntriesWithForeignKeys<TEntityType, TKey>(string foreignKeyColumnName, TKey entityId)
        where TEntityType : class
    {
        var relatedEntries = Context.Set<TEntityType>().Where(e => Equals(EF.Property<TKey>(e, foreignKeyColumnName), entityId));
        Context.Set<TEntityType>().RemoveRange(relatedEntries);
    }

    public virtual void Delete(TEntity entity)
    {
        DbSet.Remove(entity);
    }
}
