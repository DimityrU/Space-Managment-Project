namespace DataLayer.Repository;

using System;
using System.Collections.Generic;
using System.Linq;

using Entities;
using Interface;
using Microsoft.EntityFrameworkCore;

public class SpaceRepository : Repository<Space>, ISpaceRepository
{
    public SpaceRepository(SMContext context)
        : base(context)
    {

    }

    public Space? GetSingleWithRelated(Guid id)
    {
        var space = DbSet
            .Include(s => s.Bookings)
            .ThenInclude(sb => sb.Client)
            .Include(s => s.SpaceConsumables)
            .ThenInclude(sc => sc.Consumables)
            .FirstOrDefault(s => s.Id == id);

        if (space != null && space.Bookings != null)
        {
            space.Bookings = space.Bookings.OrderBy(booking => booking.StartDate).ToList();
        }

        if (space != null && space.SpaceConsumables != null)
        {
            space.SpaceConsumables = space.SpaceConsumables.OrderBy(consumable => consumable.Consumables.Name).ToList();
        }

        return space;
    }

    public IQueryable<Space> GetAllWithBookings()
    {
        return DbSet.Include(s => s.Bookings);
    }
}
