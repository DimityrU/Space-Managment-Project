namespace WebAPI.Controllers
{
    using BusinessLayer.Contracts;
    using BusinessLayer.Services.Interfaces;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/login")]
    [ApiController]
    public class LogInController : ControllerBase
    {
        private readonly IUserService _userService;

        public LogInController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public IActionResult Login(LogInRequest request)
        {
            var response = _userService.LogInValidation(request);

            if (response.HasError())
            {
                return Unauthorized(response.Error);
            }

            return Ok(response.DTO);
        }
    }
}