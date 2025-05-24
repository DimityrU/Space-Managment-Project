namespace WebAPI;

using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Repository;
using DataLayer.Repository.Interface;

using Microsoft.Extensions.DependencyInjection;

public static class DependencyContainer
{
    public static IServiceCollection Configure(this IServiceCollection services)
    {
        // Registered repositories
        // Space repositories
        services.AddScoped<IRepository<Space>, Repository<Space>>();
        services.AddScoped<ISpaceRepository, SpaceRepository>();

        // Consumable repositories
        services.AddScoped<IRepository<Consumable>, Repository<Consumable>>();
        services.AddScoped<IDeletableRepository<Consumable>, DeletableRepository<Consumable>>();
        services.AddScoped<IDeletableRepository<SpaceConsumable>, DeletableRepository<SpaceConsumable>>();

        // Booking repositories
        services.AddScoped<IBookingRepository, BookingRepository>();

        // Client repositories
        services.AddScoped<IRepository<Client>, Repository<Client>>();
        services.AddScoped<IClientRepository, ClientRepository>();

        // User repositories
        services.AddScoped<IDeletableRepository<User>, DeletableRepository<User>>();

        // Invoice repositories
        services.AddScoped<IDeletableRepository<Invoice>, DeletableRepository<Invoice>>();
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();

        // Registered services
        services.AddScoped<ISpaceService, SpaceService>();
        services.AddScoped<IConsumablesService, ConsumableService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IInvoiceService, InvoiceService>();

        return services;
    }
}
