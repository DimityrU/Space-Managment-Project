namespace SMTest;

using AutoMapper;
using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class GetBookingTests
{
    private IBookingService bookingService;
    private Mock<IBookingRepository> bookingRepository;
    private Mock<ISpaceRepository> spaceRepository;
    private Mock<IClientRepository> clientRepository;
    private Mock<IMapper> mapperMock;

    [TestInitialize]
    public void Setup()
    {
        mapperMock = new Mock<IMapper>();
        bookingRepository = new Mock<IBookingRepository>();
        spaceRepository = new Mock<ISpaceRepository>();
        clientRepository = new Mock<IClientRepository>();
        bookingService = new BookingService(spaceRepository.Object, bookingRepository.Object, clientRepository.Object, mapperMock.Object);
    }

    [TestMethod]
    public async Task GetAllBookings_ErrorResponse()
    {
        //Assign
        var response = new CollectionResponse<BookingDetailsDTO>();
        var expected = "Имаше проблем с извеждането на резервациите.";

        //Set up expectations
        bookingRepository.Setup(x => x.GetAllBookings()).Returns(new List<Booking>());

        //Act
        response = bookingService.GetAllBookings();

        //Assert
        bookingRepository.Verify(x => x.GetAllBookings(), Times.AtLeastOnce());
        Assert.AreEqual(expected,response.Error.ErrorMessage);
    }

    [TestMethod]
    public async Task GetAllBookings_ValidResponse()
    {
        //Assign
        var response = new CollectionResponse<BookingDetailsDTO>();

        //Set up expectations
        bookingRepository.Setup(x => x.GetAllBookings()).Returns(new List<Booking>()
        {
            new Booking(),
            new Booking()
        });

        //Act
        response = bookingService.GetAllBookings();

        //Assert
        bookingRepository.Verify(x => x.GetAllBookings(), Times.AtLeastOnce());
        Assert.IsNull(response.Error.ErrorMessage);
    }
}
