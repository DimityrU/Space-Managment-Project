namespace WebAPI.Controllers;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/space")]
[ApiController]
public class SpaceController : ControllerBase
{
    private readonly ISpaceService _service;

    public SpaceController(ISpaceService service)
    {
        _service = service;
    }

    [HttpGet("all")]
    public ActionResult<CollectionResponse<SpaceDTO>> GetAllSpaces()
    {
        var response = _service.GetSpacesList();

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<BaseResponse>> CreateSpace([FromBody] SpaceDTO spaceDTO)
    {
        var response = new BaseResponse();

        response = await _service.CreateSpace(spaceDTO);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);

    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SingleResponse<SpaceDTO>>> GetSpace(Guid id)
    {
        var response = _service.GetCompleteSpace(id);

        if (!response.HasError())
        {
            return Ok(response);
        }

        return NotFound(response.Error);
    }

    [HttpPut("edit")]
    public async Task<ActionResult<BaseResponse>> EditSpace([FromBody] SpaceDTO updatedSpaceDto)
    {
        BaseResponse response;

        try
        {
            response = await _service.EditSpace(updatedSpaceDto);

            if (response.HasError())
            {
                return UnprocessableEntity(response.Error);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}
