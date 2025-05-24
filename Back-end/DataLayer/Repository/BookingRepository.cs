namespace DataLayer.Repository;

using Entities;
using Interface;
using Microsoft.EntityFrameworkCore;

public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public BookingRepository(SMContext dbContext)
        : base(dbContext)
    {

    }

    public List<Booking> GetAllBookings()
    {
        return DbSet.Include(b => b.Client)
            .Include(b => b.Space).Where(b => !b.IsDeleted)
            .OrderBy(b => b.Space.Name).ToList();
    }

    public Booking? GetById(Guid id)
    {
        return DbSet.Include(b => b.Space)
            .ThenInclude(s => s.SpaceConsumables)
            .ThenInclude(c => c.Consumables)
            .Include(b => b.Client)
            .FirstOrDefault(b => b.Id == id);
    }
}
