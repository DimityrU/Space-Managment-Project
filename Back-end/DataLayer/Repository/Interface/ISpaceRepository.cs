namespace DataLayer.Repository.Interface;

using System;
using Entities;

public interface ISpaceRepository : IRepository<Space>
{
    Space? GetSingleWithRelated(Guid id);

    IQueryable<Space> GetAllWithBookings();
}
