namespace SMTest;

using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BusinessLayer.Contracts;
using BusinessLayer.Models.InvoiceDTOs;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class DisplayInvoicesUnitTests
{
    private IInvoiceService invoiceService;
    private Mock<IInvoiceRepository> invoiceRepository;
    private Mock<IBookingRepository> bookingRepository;
    private Mock<IMapper> mapperMock;

    [TestInitialize]
    public void Setup()
    {
        mapperMock = new Mock<IMapper>();
        invoiceRepository = new Mock<IInvoiceRepository>();
        bookingRepository = new Mock<IBookingRepository>();
        invoiceService = new InvoiceService(invoiceRepository.Object,bookingRepository.Object, mapperMock.Object);
    }

    [TestMethod]
    public async Task GetAllInvoices_ErrorResponse()
    {
        //Assign
        var response = new CollectionResponse<InvoiceDisplayDTO>();
        var expected = "Възникна проблем при извеждането на фактурите. Моля, опитайте отново.";

        //Set up expectations
        invoiceRepository.Setup(x => x.GetAll()).Returns(new List<Invoice>());
        //Act
        response = invoiceService.GetAll();
        //Assert
        Assert.AreEqual(expected,response.Error.ErrorMessage);
        Assert.IsTrue(response.HasError());
    }

    [TestMethod]
    public async Task GetAllBookings_ValidResponse()
    {
        //Assign
        var response = new CollectionResponse<InvoiceDisplayDTO>();

        //Set up expectations
        invoiceRepository.Setup(x => x.GetAll()).Returns(new List<Invoice>()
        {
            new Invoice()
        });
        //Act
        response = invoiceService.GetAll();
        //Assert
        Assert.IsNull(response.Error.ErrorMessage);
        Assert.IsFalse(response.HasError());
	}
}