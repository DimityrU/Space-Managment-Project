namespace BusinessLayer.Services.Interfaces;

using Contracts;
using Models;

public interface IUserService
{
    SingleResponse<UserDto> LogInValidation(LogInRequest username);

    Task<BaseResponse> CreateUser(CreateUserDTO newUser);

    bool IsAdmin(string username);

    CollectionResponse<string> GetAllUsernames();

    Task<BaseResponse> DeleteUser(string username);
}
