namespace BusinessLayer.Mappings;

using AutoMapper;
using Models;
using Models.InvoiceDTOs;
using DataLayer.Entities;
using Models.InvoiceDTOs.Generate;
using Models.InvoiceDTOs.Create;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<VBookingStatistic, StatisticDTO>();

        // source --> destination
        CreateMap<Space, SpaceDTO>().ReverseMap();
        CreateMap<Consumable, ConsumableDTO>().ReverseMap();
        CreateMap<User, UserDto>().ReverseMap();
        CreateMap<Booking, BookingDetailsDTO>().ReverseMap();
        CreateMap<SpaceConsumable, SpaceConsumableDTO>().ReverseMap();
        CreateMap<Client, ClientDTO>().ReverseMap();
        CreateMap<Booking, BookingDates>().ReverseMap();
        CreateMap<Booking, BookingDTO>().ReverseMap();
        CreateMap<Booking, BookingDetailsDTO>().ReverseMap();
        CreateMap<Space, SpaceBookingsDTO>().ReverseMap();
        CreateMap<Client, ClientBookingDTO>().ReverseMap();

        // Invoices/Generate
        CreateMap<Booking, InvoiceInfoDTO>().ReverseMap();
        CreateMap<Space, SpaceInvoiceDTO>().ReverseMap();
        CreateMap<SpaceConsumable, SpaceConsumablesInvoiceDTO>().ReverseMap();
        CreateMap<Consumable, ConsumableInvoiceDTO>().ReverseMap();
        CreateMap<Client, ClientInvoiceDTO>().ReverseMap();

        // Invoices/Create
        CreateMap<Invoice, InvoiceDTO>().ReverseMap();
        CreateMap<InvoiceConsumable, InvoiceConsumableDTO>().ReverseMap();

        CreateMap<Invoice, InvoiceDisplayDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
            .ForMember(dest => dest.Paid, opt => opt.MapFrom(src => src.Paid))
            .ForMember(dest => dest.SpaceName, opt => opt.MapFrom(src => src.Booking.Space.Name))
            .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Booking.Client.Name));

        CreateMap<Invoice, InvoiceDetailsDTO>()
            .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Booking.Client.Name))
            .ForMember(dest => dest.ClientPin, opt => opt.MapFrom(src => src.Booking.Client.Pin))
            .ForMember(dest => dest.SpaceName, opt => opt.MapFrom(src => src.Booking.Space.Name));
    }
}