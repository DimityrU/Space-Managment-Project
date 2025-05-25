namespace DataLayer.Repository;

using System;
using System.Collections.Generic;
using System.Linq;
using Entities;
using Interface;
using Microsoft.EntityFrameworkCore;

public class StatisticRepository(SMContext context) : IStatisticRepository
{
    public async Task<List<VBookingStatistic>> GetReservationDates(Guid spaceId, int year)
    {
        var result = await context.VBookingStatistics
            .Where(x => x.SpaceId == spaceId && x.Year == year)
            .ToListAsync();

        return result;
    }
}
