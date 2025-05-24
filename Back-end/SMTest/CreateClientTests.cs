namespace SMTest;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebAPI.Controllers;

[TestClass]
public class CreateClientTests
{
    private ClientController _clientController;
    private Mock<IClientService> _clientServiceMock;

    [TestInitialize]
    public void Setup()
    {
        _clientServiceMock = new Mock<IClientService>();
        _clientController = new ClientController(_clientServiceMock.Object);
    }

    [TestMethod]
    public async Task CreateClient_WhenServiceReturnsSuccessfulResponse_ReturnsOkResult()
    {
        // Arrange
        var clientDto = new ClientDTO();
        var response = new BaseResponse();
        _clientServiceMock.Setup(s => s.CreateClient(clientDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _clientController.CreateClient(clientDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        var okResult = result.Result as OkObjectResult;
        Assert.AreEqual(response, okResult.Value);
    }

    [TestMethod]
    public async Task CreateClient_WhenServiceReturnsErrorResponse_ReturnsUnprocessableEntityWithErrorMessage()
    {
        // Arrange
        var clientDto = new ClientDTO();
        var response = new BaseResponse();
        response.AddError("Error message");
        _clientServiceMock.Setup(s => s.CreateClient(clientDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _clientController.CreateClient(clientDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        var badRequestObjectResult = result.Result as BadRequestObjectResult;
        Assert.AreEqual(response.Error, badRequestObjectResult.Value);
    }
}
