namespace BusinessLayer.Services.Interfaces;

using Contracts;
using Models;

public interface IStatisticService
{
    Task<GetStatisticResponse> GetStatistic(Guid spaceId, int year);
}
