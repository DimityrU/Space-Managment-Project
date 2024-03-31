namespace DataLayer.Repository.Interface;

public interface IDeletableRepository<TEntity> : IRepository<TEntity>
            where TEntity : class
{
    void Delete(TEntity entity);

    void DeleteEntriesWithForeignKeys<TEntityType, TKey>(string foreignKeyColumnName, TKey consumableId)
        where TEntityType : class;
}
