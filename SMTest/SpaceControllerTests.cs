namespace SMTest;

using Azure;
using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;

using Microsoft.AspNetCore.Mvc;
using Moq;
using WebAPI.Controllers;

[TestClass]
public class SpaceControllerTests
{
    private SpaceController _spaceController;
    private Mock<ISpaceService> _spaceServiceMock;

    [TestInitialize]
    public void Setup()
    {
        _spaceServiceMock = new Mock<ISpaceService>();
        _spaceController = new SpaceController(_spaceServiceMock.Object);
    }

    [TestMethod]
    public async Task CreateSpace_WhenServiceReturnsSuccessfulResponse_ReturnsOkResultWithSuccessMessage()
    {
        // Arrange
        var spaceDto = new SpaceDTO();
        var response = new BaseResponse();
        _spaceServiceMock.Setup(s => s.CreateSpace(spaceDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _spaceController.CreateSpace(spaceDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
    }

    [TestMethod]
    public async Task CreateSpace_WhenServiceReturnsErrorResponse_ReturnsUnprocessableEntityWithErrorMessage()
    {
        // Arrange
        var spaceDto = new SpaceDTO();
        var response = new BaseResponse();
        response.AddError("Error message");
        _spaceServiceMock.Setup(s => s.CreateSpace(spaceDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _spaceController.CreateSpace(spaceDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        var badRequestObjectResult = result.Result as BadRequestObjectResult;
        Assert.AreEqual(response.Error, badRequestObjectResult.Value);
    }

    [TestMethod]
    public async Task CreateSpace_WhenServiceReturnsError_ReturnsStatusCode400WithErrorMessage()
    {
        // Arrange
        var spaceDto = new SpaceDTO();
        var exceptionMessage = "Some error occurred";
        var response = new BaseResponse();
        response.AddError(exceptionMessage);
        _spaceServiceMock.Setup(s => s.CreateSpace(spaceDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _spaceController.CreateSpace(spaceDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(ObjectResult));
        var statusCodeResult = result.Result as BadRequestObjectResult;
        Assert.AreEqual(400, statusCodeResult.StatusCode);
        Assert.AreEqual(exceptionMessage, (statusCodeResult.Value as ErrorResponse).ErrorMessage);
    }

    [TestMethod]
    public async Task EditSpace_WhenServiceReturnsSuccessfulResponse_ReturnsOkResultWithSuccessMessage()
    {
        // Arrange
        var spaceDto = new SpaceDTO();
        var response = new BaseResponse();
        _spaceServiceMock.Setup(s => s.EditSpace(spaceDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _spaceController.EditSpace(spaceDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
    }

    [TestMethod]
    public async Task EditSpace_WhenServiceReturnsErrorResponse_ReturnsUnprocessableEntityWithErrorMessage()
    {
        // Arrange
        var spaceDto = new SpaceDTO();
        var response = new BaseResponse();
        response.AddError("Error message");
        _spaceServiceMock.Setup(s => s.EditSpace(spaceDto)).Returns(Task.FromResult(response));

        // Act
        var result = await _spaceController.EditSpace(spaceDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(UnprocessableEntityObjectResult));
        var unprocessablleEntityObjectResult = result.Result as UnprocessableEntityObjectResult;
        Assert.AreEqual(response.Error.ErrorMessage, ((ErrorResponse)unprocessablleEntityObjectResult.Value).ErrorMessage);
    }

    [TestMethod]
    public async Task EditSpace_WhenServiceThrowsException_ReturnsStatusCode500WithErrorMessage()
    {
        // Arrange
        var spaceDto = new SpaceDTO();
        var exceptionMessage = "Some error occurred";
        _spaceServiceMock.Setup(s => s.EditSpace(spaceDto)).Throws(new Exception(exceptionMessage));

        // Act
        var result = await _spaceController.EditSpace(spaceDto);

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(ObjectResult));
        var statusCodeResult = result.Result as ObjectResult;
        Assert.AreEqual(500, statusCodeResult.StatusCode);
        Assert.AreEqual($"An error occurred: {exceptionMessage}", statusCodeResult.Value);
    }
}
