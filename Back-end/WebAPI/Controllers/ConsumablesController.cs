namespace WebAPI.Controllers;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/consumables")]
[ApiController]
public class ConsumablesController : ControllerBase
{
    private readonly IConsumablesService _service;

    public ConsumablesController(IConsumablesService service)
    {
        _service = service;
    }

    [HttpGet("all")]
    public ActionResult<CollectionResponse<ConsumableDTO>> GetAll()
    {
        CollectionResponse<ConsumableDTO> res = _service.GetAll();

        if (res.HasError())
        {
            return BadRequest(res.Error);
        }

        return Ok(res);
    }

    [HttpPost("edit")]
    public async Task<ActionResult<BaseResponse>> EditMultiple([FromBody] List<ConsumableDTO> consumables)
    {
        var res = await _service.EditMultiple(consumables);

        if (res.HasError())
        {
            return BadRequest(res);
        }

        return Ok(res);
    }
}
