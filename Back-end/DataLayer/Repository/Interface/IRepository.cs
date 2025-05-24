namespace DataLayer.Repository.Interface;

using System.Linq.Expressions;

public interface IRepository<TEntity> : IDisposable
        where TEntity : class
{
    IQueryable<TEntity> All();

    IQueryable<T> All<T>(Expression<Func<TEntity, T>> predicate);

    TEntity? GetSingle(Guid? id);

    IQueryable<TEntity> AllAsNoTracking();

    Task<bool> AddAsync(TEntity entity);

    void Update(TEntity entity);

    Task<int> SaveChangesAsync();

    bool Any(Expression<Func<TEntity, bool>> predicate);

    TEntity GetBy(Expression<Func<TEntity, bool>> predicate);
}
