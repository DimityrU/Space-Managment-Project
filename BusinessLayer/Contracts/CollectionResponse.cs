namespace BusinessLayer.Contracts;

using System.Collections.Generic;

public class CollectionResponse<TEntity> : BaseResponse
    where TEntity : class
{
    public ICollection<TEntity> Data { get; set; } = new List<TEntity>();
}
