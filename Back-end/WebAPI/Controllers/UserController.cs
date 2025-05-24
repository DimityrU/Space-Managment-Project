namespace WebAPI.Controllers;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("create")]
    public async Task<ActionResult<BaseResponse>> CreateNewUser([FromBody] CreateUserDTO user)
    {
        var response = await _userService.CreateUser(user);
        if (response.HasError())
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpGet("admin/{username}")]
    public ActionResult<BaseResponse> CreateNewUser(string username)
    {
        var isAdmin = _userService.IsAdmin(username);
        var response = new BaseResponse();
        if (!isAdmin)
        {
            response.AddError("Нямате права да достъпвате тази страница.");
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpGet("all")]
    public ActionResult<CollectionResponse<UserDto>> GetAllUsernames()
    {
        var response = _userService.GetAllUsernames();
        return Ok(response);
    }

    [HttpDelete("{username}")]
    public async Task<ActionResult<BaseResponse>> DeleteUser(string username, [FromBody] string adminUsername)
    {
        if (_userService.IsAdmin(adminUsername) && username != adminUsername)
        {
            var response = await _userService.DeleteUser(username);
            if (response.HasError())
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        return BadRequest("Нямате права за тази операция.");
    }
}
