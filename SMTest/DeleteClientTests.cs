namespace SMTest;

using AutoMapper;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class DeleteClientTests
{
    private IClientService clientService;
    private Mock<IRepository<Client>> clientRepository;
    private Mock<IMapper> mapperMock;

    [TestInitialize]
    public void Setup()
    {
        mapperMock = new Mock<IMapper>();
        clientRepository = new Mock<IRepository<Client>>();
        clientService = new ClientService(clientRepository.Object, mapperMock.Object);
    }

    [TestMethod]
    public void DeleteClient_ErrorResponse()
    {
        //Arrange
        var expected = "Възникна проблем при намирането на клиента.";
        var id = new Guid();
        Client client = null;
        clientRepository.Setup(b => b.GetSingle(id)).Returns(client);
        //Act
        var response = clientService.DeleteClient(id);
        //Assert
        clientRepository.Verify(b => b.GetSingle(id), Times.AtLeastOnce());
        Assert.AreEqual(expected, response.Result.Error.ErrorMessage);
        Assert.IsTrue(response.Result.HasError());
    }

    [TestMethod]
    public void DeleteClient_ValidResponse()
    {
        //Arrange
        var id = new Guid();
        Client client = new Client();
        clientRepository.Setup(b => b.GetSingle(id)).Returns(client);
        //Act
        var response = clientService.DeleteClient(id);
        //Assert
        clientRepository.Verify(b => b.GetSingle(id), Times.AtLeastOnce());
        Assert.IsNull(response.Result.Error.ErrorMessage);
        Assert.IsFalse(response.Result.HasError());
    }
}
