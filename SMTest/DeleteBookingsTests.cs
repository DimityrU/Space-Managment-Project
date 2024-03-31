namespace SMTest;

using AutoMapper;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class DeleteBookingsTests
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
        bookingService = new BookingService(spaceRepository.Object, bookingRepository.Object, clientRepository.Object,
            mapperMock.Object);
    }

    [TestMethod]
    public void DeleteBooking_ErrorResponse()
    {
        //Arrange
        var expected = "Изникна проблем с изтриването на резервацията.";
        var id = new Guid();
        Booking booking = null;
        bookingRepository.Setup(b=>b.GetById(id)).Returns(booking);
        //Act
        var response = bookingService.DeleteBooking(id);
        //Assert
        bookingRepository.Verify(b => b.GetById(id),Times.AtLeastOnce());
        Assert.AreEqual(expected,response.Result.Error.ErrorMessage);
        Assert.IsTrue(response.Result.HasError());
    }

    [TestMethod]
    public void DeleteBooking_ValidResponse()
    {
        //Arrange
        var id = new Guid();
        Booking booking = new Booking();
        bookingRepository.Setup(b => b.GetById(id)).Returns(booking);
        //Act
        var response = bookingService.DeleteBooking(id);
        //Assert
        bookingRepository.Verify(b => b.GetById(id), Times.AtLeastOnce());
        Assert.IsNull(response.Result.Error.ErrorMessage);
        Assert.IsFalse(response.Result.HasError());
    }
}
