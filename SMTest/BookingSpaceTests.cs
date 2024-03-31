namespace SMTest;

using AutoMapper;
using BusinessLayer.Models;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class BookingSpaceTests
{
    private IBookingService _bookingService;
    private Mock<IBookingRepository> _bookingRepositoryMock;
    private Mock<ISpaceRepository> _spaceRepositoryMock;
    private Mock<IDeletableRepository<SpaceConsumable>> _spaceConsumableRepositoryMock;
    private Mock<IClientRepository> _clientRepositoryMock;
    private Mock<IMapper> _mapperMock;

    [TestInitialize]
    public void Setup()
    {
        _mapperMock = new Mock<IMapper>();
        _bookingRepositoryMock = new Mock<IBookingRepository>();
        _spaceRepositoryMock = new Mock<ISpaceRepository>();
        _clientRepositoryMock = new Mock<IClientRepository>();
        _spaceConsumableRepositoryMock = new Mock<IDeletableRepository<SpaceConsumable>>();
        _bookingService = new BookingService(_spaceRepositoryMock.Object, _bookingRepositoryMock.Object,
            _clientRepositoryMock.Object, _mapperMock.Object);
    }

    [TestMethod]
    public async Task ValidData_BookingRequest_BookingCreated()
    {
        var bookingDto = new BookingDTO
        {
            Id = Guid.NewGuid(),
            SpaceId = Guid.NewGuid(),
            ClientId = Guid.NewGuid(),
            Price = 100.0m,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(7)
        };
        var bookingEntity = new Booking
        {
            Id = Guid.NewGuid(),
            SpaceId = Guid.NewGuid(),
            ClientId = Guid.NewGuid(),
            Price = 100.0m,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(7)
        };
        _mapperMock.Setup(mapper => mapper.Map<Booking>(bookingDto)).Returns(bookingEntity);
        _bookingRepositoryMock.Setup(repo => repo.AddAsync(bookingEntity)).ReturnsAsync(true);

        var result = await _bookingService.AddBooking(bookingDto);

        Assert.IsFalse(result.HasError());
        _mapperMock.Verify(mapper => mapper.Map<Booking>(bookingDto), Times.Once);
        _bookingRepositoryMock.Verify(repo => repo.AddAsync(bookingEntity), Times.Once);
    }

    [TestMethod]
    public async Task InvalidSpace_BookingRequest_BadRequestReturned()
    {
        var bookingDto = new BookingDTO
        {
            Id = Guid.NewGuid(),
            SpaceId = null,
            ClientId = Guid.NewGuid(),
            Price = 50.0m,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(7)
        };

        var result = await _bookingService.AddBooking(bookingDto);

        Assert.IsTrue(result.HasError());
        Assert.AreEqual("Неуспешно резервиране.", result.Error.ErrorMessage);
    }

    [TestMethod]
    public async Task InvalidClient_BookingRequest_BadRequestReturned()
    {
        var bookingDto = new BookingDTO
        {
            Id = Guid.NewGuid(),
            SpaceId = Guid.NewGuid(),
            ClientId = null,
            Price = 50.0m,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(7)
        };

        var result = await _bookingService.AddBooking(bookingDto);

        Assert.IsTrue(result.HasError());
        Assert.AreEqual("Неуспешно резервиране.", result.Error.ErrorMessage);
    }

    [TestMethod]
    public async Task InvalidPrice_BookingRequest_BadRequestReturned()
    {
        var bookingDto = new BookingDTO
        {
            Id = Guid.NewGuid(),
            SpaceId = Guid.NewGuid(),
            ClientId = Guid.NewGuid(),
            Price = -50.0m,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(7)
        };

        var result = await _bookingService.AddBooking(bookingDto);

        Assert.IsTrue(result.HasError());
        Assert.AreEqual("Неуспешно резервиране.", result.Error.ErrorMessage);
    }
}