namespace DataLayer.Repository.Interface;

using Entities;

public interface IBookingRepository : IRepository<Booking>
{
    public List<Booking> GetAllBookings();

    public Booking? GetById(Guid id);
}
