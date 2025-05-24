namespace SMTest;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using WebAPI.Controllers;

[TestClass]
public class ShowSpacesTests
{
    private SpaceController controller;
    private Mock<ISpaceService> serviceMock;

    [TestInitialize]
    public void Initialize()
    {
        serviceMock = new Mock<ISpaceService>();
        controller = new SpaceController(serviceMock.Object);
    }

    [TestMethod]
    public void GetAllSpaces_ReturnsOkResult_WithSpacesList()
    {
        // Arrange
        var expectedResponse = new CollectionResponse<SpaceDTO>()
        {
            Data = new List<SpaceDTO>()
            {
                new SpaceDTO { Name = "Office B-1", Size = 45.5, Volume = 136.5, Description = "Descriptin 1" },
                new SpaceDTO { Name = "Office C-2", Size = 50, Volume = 160, Description = "Descriptin 2" },
            }
        };

        // Set up the service mock to return the expected spaces list
        serviceMock.Setup(s => s.GetSpacesList()).Returns(expectedResponse);

        // Act
        var result = controller.GetAllSpaces();

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));

        var okResult = result.Result as OkObjectResult;
        Assert.AreEqual(expectedResponse, okResult.Value);
    }

    [TestMethod]
    public void GetAllSpaces_ReturnsBadRequest_WhenSpacesListIsNull()
    {
        // Arrange
        // Set up the service mock to return null
        var expectedResponse = new CollectionResponse<SpaceDTO>()
        {
            Data = null,
        };
        expectedResponse.AddError("Няма такъв лист.");

        serviceMock.Setup(s => s.GetSpacesList()).Returns((CollectionResponse<SpaceDTO>) expectedResponse);

        // Act
        var result = controller.GetAllSpaces();

        // Assert
        Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
    }
}