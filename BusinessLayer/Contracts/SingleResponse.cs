namespace BusinessLayer.Contracts;

public class SingleResponse<TEntity> : BaseResponse
    where TEntity : class
{
    public TEntity DTO { get; set; }
}
