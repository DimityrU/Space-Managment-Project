namespace WebAPI.Controllers;

using BusinessLayer.Contracts;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/statistic")]
[ApiController]
public class StatisticController(IStatisticService service) : ControllerBase
{
    [HttpGet("{spaceId:guid}/{year:int}")]
    public async Task<ActionResult<GetStatisticResponse>> GetStatistics(Guid spaceId, int year)
    {
        var response = await service.GetStatistic(spaceId, year);

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }
}
