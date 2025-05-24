namespace BusinessLayer.Services;

using AutoMapper;
using BCrypt.Net;
using Contracts;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Interfaces;
using Models;
using System.Diagnostics;
using BCrypt = BCrypt.Net.BCrypt;

public class UserService : IUserService
{
    private IDeletableRepository<User> _userRepository;
    private IMapper _mapper;

    public UserService(IDeletableRepository<User> userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<BaseResponse> CreateUser(CreateUserDTO userInfo)
    {
        var response = new BaseResponse();
        var newUserPassword = BCrypt.HashPassword(userInfo.Password);

        var newUser = new User();
        newUser.Password = newUserPassword;
        newUser.Username = userInfo.Username;
        newUser.Role = 0;

        var isAdmin = IsAdmin(userInfo.LoggedUser);
        if (!isAdmin)
        {
            response.AddError("Нямате права за тази операция.");
        }
        else
        {
            await _userRepository.AddAsync(newUser);
            var changesCount = await _userRepository.SaveChangesAsync();

            if (changesCount == 0)
            {
                response.AddError("Имаше грешка със създаването на нов фасилити мениджър.");
            }

        }

        return response;
    }

    public bool IsAdmin(string username)
    {
        var loggedUser = _userRepository.GetBy(u => u.Username == username);
        var isAdmin = loggedUser != null && loggedUser.Role == 1;
        return isAdmin;
    }

    public SingleResponse<UserDto> LogInValidation(LogInRequest request)
    {
        var response = new SingleResponse<UserDto>();
        var userEntity = _userRepository.GetBy(u => u.Username == request.Username);
        try
        {
            var validPassword = userEntity != null && BCrypt.Verify(request.Password, userEntity.Password);
            if (validPassword)
            {
                var userDto = _mapper.Map<UserDto>(userEntity);

                response.DTO = userDto;
            }
            else
            {
                response.AddError("Грешно име или пaрола.");
            }
        }
        catch (SaltParseException ex)
        {
            response.AddError("Грешно име или пaрола.");
        }

        return response;
    }

    public CollectionResponse<string> GetAllUsernames()
    {
        var response = new CollectionResponse<string>();
        List<string> allUsers = _userRepository.All(u => u.Username).ToList();
        Debug.Assert(allUsers.Count != 0);
        response.Data=allUsers;
        return response;
    }

    public async Task<BaseResponse> DeleteUser(string username)
    {
        var response = new BaseResponse();
        var deletedUser = _userRepository.GetBy(u => u.Username == username);
        try
        {
            _userRepository.Delete(deletedUser);
            await _userRepository.SaveChangesAsync();
        }
        catch (Exception e)
        {
            response.AddError("Неуспешно изтриване на мениджър.");
        }
        return response;
    }
}
