namespace DataLayer.Repository;

using Entities;
using Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : class
{
    public Repository(SMContext context)
    {
        Context = context ?? throw new ArgumentNullException(nameof(context));
        DbSet = Context.Set<TEntity>();
    }

    protected DbSet<TEntity> DbSet { get; set; }

    protected SMContext Context { get; set; }

    public virtual IQueryable<TEntity> All() => DbSet;

    public virtual IQueryable<T> All<T>(Expression<Func<TEntity, T>> predicate) => DbSet.Select(predicate);

    public virtual TEntity? GetSingle(Guid? id) => DbSet.Find(id);

    public virtual IQueryable<TEntity> AllAsNoTracking() => DbSet.AsNoTracking();

    public virtual async Task<bool> AddAsync(TEntity entity)
    {
        await DbSet.AddAsync(entity).AsTask();
        return true;
    }

    public virtual void Update(TEntity entity)
    {
        var entry = Context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            DbSet.Attach(entity);
        }

        entry.State = EntityState.Modified;
    }

    public async Task<int> SaveChangesAsync() => await Context.SaveChangesAsync();

    public bool Any(Expression<Func<TEntity, bool>> predicate)
    {
        return Context.Set<TEntity>().Any(predicate);
    }

    public TEntity? GetBy(Expression<Func<TEntity, bool>> predicate)
    {
        return Context.Set<TEntity>().FirstOrDefault(predicate);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            Context.Dispose();
        }
    }
}
