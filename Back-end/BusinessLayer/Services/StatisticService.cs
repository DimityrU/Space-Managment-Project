namespace BusinessLayer.Services;

using AutoMapper;
using Azure;
using Contracts;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Threading.Tasks;

public class StatisticService(IStatisticRepository statisticRepository, IMapper mapper) : IStatisticService
{

    public async Task<GetStatisticResponse> GetStatistic(Guid spaceId, int year)
    {
        var response = new GetStatisticResponse();

        var result = await statisticRepository.GetReservationDates(spaceId, year);

        response.Statistic = mapper.Map<List<StatisticDTO>>(result);

        return response;
    }
}
