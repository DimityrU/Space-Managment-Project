namespace SMTest;

using AutoMapper;
using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;
using System.Collections.Generic;
using System.Linq;

[TestClass]
public class ClientsTableTests
{
    private Mock<IRepository<Client>> _clientRepositoryMock;
    private Mock<IMapper> _mapperMock;
    private ClientService _clientServiceMock;

    [TestInitialize]
    public void Setup()
    {
        _mapperMock = new Mock<IMapper>();
        _clientRepositoryMock = new Mock<IRepository<Client>>();
        _clientServiceMock = new ClientService(_clientRepositoryMock.Object, _mapperMock.Object);
    }

    [TestMethod]
    public void GetAllClients_ValidResponse()
    {
        // Arrange
        _mapperMock.Setup(x => x.Map<ClientDTO>(It.IsAny<Client>())).Returns(new ClientDTO());
        _clientRepositoryMock.Setup(c => c.All()).Returns(
            Queryable.AsQueryable(new List<Client>() { new Client(), new Client() }));
        var response = new CollectionResponse<ClientDTO>();
		// Act
		response = _clientServiceMock.GetAllClients();
        // Assert
        _clientRepositoryMock.Verify(c => c.All(), Times.AtLeastOnce());
        Assert.IsNull(response.Error.ErrorMessage);
        Assert.IsFalse(response.HasError());
    }

    [TestMethod]
    public void GetAllClients_ErrorResponse()
    {
        // Arrange
        _mapperMock.Setup(x => x.Map<ClientDTO>(It.IsAny<Client>())).Returns(new ClientDTO());
        _clientRepositoryMock.Setup(c => c.All()).Returns(
            Queryable.AsQueryable(new List<Client>()));
        var response = new CollectionResponse<ClientDTO>();
        // Act
        response = _clientServiceMock.GetAllClients();
        // Assert
        _clientRepositoryMock.Verify(c => c.All(), Times.AtLeastOnce());
        Assert.IsNotNull(response.Error.ErrorMessage);
        Assert.IsTrue(response.HasError());
        Assert.AreEqual("Няма такъв лист.",response.Error.ErrorMessage);
    }
}

