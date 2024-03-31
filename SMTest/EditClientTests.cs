namespace SMTest;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebAPI.Controllers;

[TestClass]
public class EditClientTests
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
    public async Task EditClient_WhenServiceReturnsSuccessfulResponse_ReturnsOkResult()
    {
        // Arrange
        var clientDto = new ClientDTO();
        var response = new BaseResponse();
        _clientServiceMock.Setup(s => s.EditClient(clientDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _clientController.EditClient(clientDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        var okResult = result.Result as OkObjectResult;
        Assert.AreEqual(response, okResult.Value);
    }

    [TestMethod]
    public async Task EditClient_WhenServiceReturnsErrorResponse_ReturnsBadRequestWithErrorMessage()
    {
        // Arrange
        var clientDto = new ClientDTO();
        var response = new BaseResponse();
        response.AddError("Error message");
        _clientServiceMock.Setup(s => s.EditClient(clientDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _clientController.EditClient(clientDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        var badRequestObjectResult = result.Result as BadRequestObjectResult;
        Assert.AreEqual(response.Error.ErrorMessage, ((ErrorResponse) badRequestObjectResult.Value).ErrorMessage);
    }
}
