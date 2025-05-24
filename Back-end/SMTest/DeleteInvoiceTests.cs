namespace SMTest;

using AutoMapper;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class DeleteInvoiceTests
{
    private IInvoiceService invoiceService;
    private Mock<IDeletableRepository<Invoice>> genericRepository;
    private Mock<IInvoiceRepository> invoiceRepository;
    private Mock<IBookingRepository> bookingRepository;
    private Mock<IMapper> mapperMock;

    [TestInitialize]
    public void Setup()
    {
        mapperMock = new Mock<IMapper>();
        genericRepository = new Mock<IDeletableRepository<Invoice>>();
        invoiceRepository = new Mock<IInvoiceRepository>();
        bookingRepository = new Mock<IBookingRepository>();
        invoiceService = new InvoiceService(genericRepository.Object, invoiceRepository.Object, bookingRepository.Object, mapperMock.Object);
    }

    [TestMethod]
    public void DeleteClient_ErrorResponse()
    {
        //Arrange
        var expected = "Възникна грешка при достъпване на фактурата.";
        var id = new Guid();
        Invoice invoice = null;
        genericRepository.Setup(b => b.GetSingle(id)).Returns(invoice);
        //Act
        var response = invoiceService.DeleteInvoice(id);
        //Assert
        genericRepository.Verify(b => b.GetSingle(id), Times.AtLeastOnce());
        Assert.AreEqual(expected, response.Result.Error.ErrorMessage);
        Assert.IsTrue(response.Result.HasError());
    }

    [TestMethod]
    public void DeleteClient_ValidResponse()
    {
        //Arrange
        var id = new Guid();
        Invoice invoice = new Invoice();
        genericRepository.Setup(b => b.GetSingle(id)).Returns(invoice);
        //Act
        var response = invoiceService.DeleteInvoice(id);
        //Assert
        genericRepository.Verify(b => b.GetSingle(id), Times.AtLeastOnce());
        Assert.IsNull(response.Result.Error.ErrorMessage);
        Assert.IsFalse(response.Result.HasError());
    }

}
