namespace BusinessLayer.Contracts;

public class ErrorResponse
{
    public bool HasError { get; set; }

    public string? ErrorMessage { get; set; }
}