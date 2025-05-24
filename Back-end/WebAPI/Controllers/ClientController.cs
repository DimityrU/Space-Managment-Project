namespace WebAPI.Controllers;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/client")]
[ApiController]
public class ClientController : ControllerBase
{
    private readonly IClientService _service;

    public ClientController(IClientService service)
    {
        _service = service;
    }

    [HttpGet("all")]
    public ActionResult<CollectionResponse<ClientDTO>> GetAllClients()
    {
        var response = _service.GetAllClients();

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpPost("create")]
    public async Task<ActionResult<BaseResponse>> CreateClient([FromBody] ClientDTO clientDTO)
    {
        var response = await _service.CreateClient(clientDTO);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SingleResponse<ClientDTO>>> GetClient(Guid id)
    {
        var response = await _service.GetClient(id);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpPut("edit")]
    public async Task<ActionResult<BaseResponse>> EditClient([FromBody] ClientDTO clientDto)
    {
        var response = await _service.EditClient(clientDto);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpPatch("delete/{id}")]
    public async Task<ActionResult<BaseResponse>> DeleteClient(Guid id)
    {
        var response = await _service.DeleteClient(id);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }
}
