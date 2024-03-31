namespace BusinessLayer.Contracts;

public class BaseResponse
{
    public BaseResponse()
    {
        Error = new ErrorResponse();
    }

    public ErrorResponse Error { get; }

    public void AddError(string error)
    {
        Error.HasError = true;
        Error.ErrorMessage = error;
    }

    public bool HasError()
    {
        return Error.HasError;
    }
}
