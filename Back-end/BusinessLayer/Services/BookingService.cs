namespace BusinessLayer.Services;

using System.Collections.Generic;

using AutoMapper;
using Contracts;
using DataLayer.Repository.Interface;
using DataLayer.Entities;
using Models;
using Interfaces;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IClientRepository _clientRepository;
    private readonly ISpaceRepository? _spaceRepository;
    private readonly IMapper _mapper;

    public BookingService(ISpaceRepository spaceRepository, IBookingRepository bookingRepository, IClientRepository clientRepository, IMapper mapper)
    {
        _spaceRepository = spaceRepository;
        _bookingRepository = bookingRepository;
        _clientRepository = clientRepository;
        _mapper = mapper;
    }

    public BookingInfoResponse GetBookingInfo(BookingRequest request)
    {
        var space = GetSpaceInfo(request.SpaceId);
        var clients = GetAllClients();

        return new BookingInfoResponse
        {
            BookingSpace = space,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            ClientBooking = clients
        };
    }

    public async Task<BaseResponse> AddBooking(BookingDTO booking)
    {
        var response = new BaseResponse();
        booking.Id = Guid.NewGuid();

        var newBooking = _mapper.Map<Booking>(booking);

        var created = await _bookingRepository.AddAsync(newBooking);
        await _bookingRepository.SaveChangesAsync();

        if (!created)
        {
            response.AddError("Неуспешно резервиране.");
        }

        return response;
    }

    private List<ClientBookingDTO>? GetAllClients()
    {
        var entities = _clientRepository?.GetCurrentClients().ToList();
        var clientBooking = new List<ClientBookingDTO>();

        if (entities == null)
        {
            return null;
        }

        foreach (var entityClient in entities)
        {
            clientBooking.Add(_mapper.Map<ClientBookingDTO>(entityClient));
        }

        return clientBooking;
    }

    private SpaceBookingsDTO? GetSpaceInfo(Guid id)
    {
        var entity = _spaceRepository?.GetSingleWithRelated(id);

        if (entity is null)
        {
            return null;
        }

        entity.Bookings.Clear();

        return _mapper.Map<SpaceBookingsDTO>(entity);
    }

    public CollectionResponse<BookingDetailsDTO> GetAllBookings()
    {
        var response = new CollectionResponse<BookingDetailsDTO>();
        var bookings = _bookingRepository.GetAllBookings();

        if (bookings.Count == 0)
        {
            response.AddError("Имаше проблем с извеждането на резервациите.");
        }
        else
        {
            var bookingDTOs = new List<BookingDetailsDTO>();

            foreach (var booking in bookings)
            {
                bookingDTOs.Add(_mapper.Map<BookingDetailsDTO>(booking));
            }

            response.Data = bookingDTOs;
        }

        return response;
    }

    public async Task<BaseResponse> DeleteBooking(Guid id)
    {
        var response = new BaseResponse();
        var booking = _bookingRepository.GetById(id);

        if (booking != null && !booking.IsDeleted)
        {
            booking.IsDeleted = true;
            _bookingRepository.Update(booking);
            await _bookingRepository.SaveChangesAsync();

            return response;
        }

        response.AddError("Изникна проблем с изтриването на резервацията.");

        return response;
    }
}