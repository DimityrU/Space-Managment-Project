namespace DataLayer.Repository.Interface;

using Entities;

public interface IStatisticRepository
{
    public Task<List<VBookingStatistic>> GetReservationDates(Guid spaceId, int year);
}
