namespace SMTest;

using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using BusinessLayer.Models;
using BusinessLayer.Services;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;

[TestClass]
public class SpaceServiceTests
{
    private Mock<IMapper> mapperMock;
    private Mock<ISpaceRepository> spaceRepositoryMock;
    private SpaceService spaceService;
    private Mock<IDeletableRepository<SpaceConsumable>> spaceConsumableRepositoryMock;

    [TestInitialize]
    public void Setup()
    {
        mapperMock = new Mock<IMapper>();
        spaceRepositoryMock = new Mock<ISpaceRepository>();
        spaceConsumableRepositoryMock = new Mock<IDeletableRepository<SpaceConsumable>>();
        spaceService = new SpaceService(spaceRepositoryMock.Object, spaceConsumableRepositoryMock.Object,
            mapperMock.Object);
    }

    [TestMethod]
    public async Task CreateSpace_ServiceCallsRepository_SpaceAlreadyExists()
    {
        var spaceDTO = new SpaceDTO
        {
            Name = "SpaceName",
            Size = 10,
            Volume = 20
        };
        var space = new Space
        {
            Name = "SpaceName",
            Size = 10,
            Volume = 20
        };

        mapperMock.Setup(x => x.Map<Space>(It.Is<SpaceDTO>(x => x.Equals(spaceDTO)))).Returns(space);
        spaceRepositoryMock.Setup(x => x.Any(It.IsAny<Expression<Func<Space, bool>>>())).Returns(true);


        var response = await spaceService.CreateSpace(spaceDTO);
        Assert.AreEqual("Вече съществува помещение с име SpaceName. Моля, въведете ново име!",
            response.Error.ErrorMessage);

        mapperMock.Verify(x => x.Map<Space>(It.Is<SpaceDTO>(x => x.Equals(spaceDTO))));
        spaceRepositoryMock.Setup(x => x.Any(It.IsAny<Expression<Func<Space, bool>>>()));
    }

    [TestMethod]
    public async Task CreateSpace_ServiceCallsRepository_SpaceCreated()
    {
        var spaceDTO = new SpaceDTO
        {
            Name = "SpaceName",
            Size = 10,
            Volume = 20
        };
        var space = new Space
        {
            Name = "SpaceName",
            Size = 10,
            Volume = 20
        };

        mapperMock.Setup(x => x.Map<Space>(It.Is<SpaceDTO>(x => x.Equals(spaceDTO)))).Returns(space);
        spaceRepositoryMock.Setup(x => x.Any(It.IsAny<Expression<Func<Space, bool>>>())).Returns(false);
        spaceRepositoryMock.Setup(x => x.AddAsync(It.Is<Space>(x => x.Equals(space)))).Returns(Task.FromResult(true));

        var response = await spaceService.CreateSpace(spaceDTO);
        Assert.IsFalse(response.HasError());

        mapperMock.Verify(x => x.Map<Space>(It.Is<SpaceDTO>(x => x.Equals(spaceDTO))));
        spaceRepositoryMock.Verify(x => x.Any(It.IsAny<Expression<Func<Space, bool>>>()));
        spaceRepositoryMock.Verify(x => x.AddAsync(It.Is<Space>(x => x.Equals(space))));
    }


    [TestMethod]
    public async Task CreateSpace_ServiceCallsRepository_SpaceNotCreated()
    {
        var spaceDTO = new SpaceDTO
        {
            Name = "SpaceName",
            Size = 10,
            Volume = 20
        };
        var space = new Space
        {
            Name = "SpaceName",
            Size = 10,
            Volume = 20
        };

        mapperMock.Setup(x => x.Map<Space>(It.Is<SpaceDTO>(x => x.Equals(spaceDTO)))).Returns(space);
        spaceRepositoryMock.Setup(x => x.Any(It.IsAny<Expression<Func<Space, bool>>>())).Returns(false);
        spaceRepositoryMock.Setup(x => x.AddAsync(It.Is<Space>(x => x.Equals(space)))).Returns(Task.FromResult(false));

        var response = await spaceService.CreateSpace(spaceDTO);
        Assert.AreEqual("Неуспешно добавяне.",
            response.Error.ErrorMessage);

        mapperMock.Verify(x => x.Map<Space>(It.Is<SpaceDTO>(x => x.Equals(spaceDTO))));
        spaceRepositoryMock.Verify(x => x.Any(It.IsAny<Expression<Func<Space, bool>>>()));
        spaceRepositoryMock.Verify(x => x.AddAsync(It.Is<Space>(x => x.Equals(space))));
    }

    [TestMethod]
    public async Task EditSpace_UpdatesSpaceAndConsumables_ReturnsSuccessResponse()
    {
        var existingSpaceGuid = new Guid();

        var existingSpace = new Space
            { Id = existingSpaceGuid, Name = "Old Name", Size = 100, Volume = 1000, Description = "Old Description" };
        spaceRepositoryMock.Setup(r => r.GetSingle(existingSpaceGuid)).Returns(existingSpace);

        var modifiedSpaceConsumableGuid = new Guid();
        var deletedSpaceConsumableGuid = new Guid();
        var createdSpaceConsumableGuid = new Guid();

        var consumableId1 = new Guid();
        var consumableId2 = new Guid();
        var consumableId3 = new Guid();

        var spaceConsumableToBeModified = new SpaceConsumable
            { Id = modifiedSpaceConsumableGuid, ConsumablesId = consumableId1, SpaceId = existingSpaceGuid, Count = 2 };
        var spaceConsumableToBeDeleted = new SpaceConsumable
            { Id = deletedSpaceConsumableGuid, ConsumablesId = consumableId2, SpaceId = existingSpaceGuid, Count = 3 };
        var spaceConsumableToBeCreated = new SpaceConsumable
        {
            Id = createdSpaceConsumableGuid,
            ConsumablesId = consumableId3,
            SpaceId = existingSpaceGuid,
            Count = 3
        };

        spaceConsumableRepositoryMock.Setup(sr => sr.Update(spaceConsumableToBeModified));
        spaceConsumableRepositoryMock.Setup(sr => sr.Delete(spaceConsumableToBeDeleted));
        spaceConsumableRepositoryMock.Setup(sr => sr.AddAsync(spaceConsumableToBeCreated))
            .Returns(Task.FromResult(true));
        spaceRepositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.FromResult(1));

        var modifiedDto = new SpaceConsumableDTO
        {
            Id = modifiedSpaceConsumableGuid,
            State = "modified",
            ConsumablesId = consumableId1,
            SpaceId = existingSpaceGuid,
            Count = 2
        };

        var deletedDto = new SpaceConsumableDTO
        {
            Id = deletedSpaceConsumableGuid,
            State = "deleted",
            ConsumablesId = consumableId2,
            SpaceId = existingSpaceGuid,
            Count = 3
        };

        var createdDto = new SpaceConsumableDTO
        {
            Id = createdSpaceConsumableGuid,
            State = "created",
            ConsumablesId = consumableId3,
            SpaceId = existingSpaceGuid,
            Count = 3
        };

        var updatedSpaceDto = new SpaceDTO
        {
            Id = existingSpaceGuid,
            Name = "Old Name",
            Size = 200,
            Volume = 2000,
            Description = "New Description",
            SpaceConsumables = new List<SpaceConsumableDTO>
            {
                modifiedDto, createdDto, deletedDto
            }
        };

        mapperMock.Setup(r => r.Map<SpaceConsumable>(modifiedDto)).Returns(spaceConsumableToBeModified);
        mapperMock.Setup(r => r.Map<SpaceConsumable>(deletedDto)).Returns(spaceConsumableToBeDeleted);
        mapperMock.Setup(r => r.Map<SpaceConsumable>(createdDto)).Returns(spaceConsumableToBeCreated);

        var result = await spaceService.EditSpace(updatedSpaceDto);

        spaceRepositoryMock.Verify(r => r.GetSingle(updatedSpaceDto.Id), Times.Once);
        spaceRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        spaceRepositoryMock.VerifyNoOtherCalls();

        spaceConsumableRepositoryMock.Verify(r => r.Update(spaceConsumableToBeModified), Times.Once);
        spaceConsumableRepositoryMock.Verify(r => r.Delete(spaceConsumableToBeDeleted), Times.Once);
        spaceConsumableRepositoryMock.Verify(r => r.AddAsync(spaceConsumableToBeCreated), Times.Once);


        mapperMock.Verify(r => r.Map<SpaceConsumable>(modifiedDto), Times.Once);
        mapperMock.Verify(r => r.Map<SpaceConsumable>(deletedDto), Times.Once);
        mapperMock.Verify(r => r.Map<SpaceConsumable>(createdDto), Times.Once);

        Assert.IsFalse(result.HasError());
    }

    [TestMethod]
    public async Task EditSpace_UpdatesSpaceAndConsumables_ReturnsSameNameExists()
    {
        var existingSpaceGuid = new Guid();

        var existingSpace = new Space
            { Id = existingSpaceGuid, Name = "Old Name", Size = 100, Volume = 1000, Description = "Old Description" };
        spaceRepositoryMock.Setup(r => r.GetSingle(existingSpaceGuid)).Returns(existingSpace);
        spaceRepositoryMock.Setup(sr => sr.Any(It.IsAny<Expression<Func<Space, bool>>>())).Returns(true);

        var updatedSpaceDto = new SpaceDTO
        {
            Id = existingSpaceGuid,
            Name = "New Name",
            Size = 200,
            Volume = 2000,
            Description = "New Description",
        };

        var result = await spaceService.EditSpace(updatedSpaceDto);

        spaceRepositoryMock.Verify(r => r.GetSingle(existingSpaceGuid), Times.Once);
        spaceRepositoryMock.Verify(sr => sr.Any(It.IsAny<Expression<Func<Space, bool>>>()), Times.Once);
        spaceConsumableRepositoryMock.VerifyNoOtherCalls();
        mapperMock.VerifyNoOtherCalls();

        Assert.IsTrue(result.HasError());
        Assert.AreEqual(
            $"Вече съществува помещение с име {updatedSpaceDto.Name}. Моля, въведете ново име!",
            result.Error.ErrorMessage);
    }


    [TestMethod]
    public async Task EditSpace_FailsToUpdateSpace_ReturnsErrorResponse()
    {
        var existingSpaceGuid = new Guid();

        var existingSpace = new Space
            { Id = existingSpaceGuid, Name = "Old Name", Size = 100, Volume = 1000, Description = "Old Description" };
        spaceRepositoryMock.Setup(r => r.GetSingle(existingSpaceGuid)).Returns(existingSpace);
        spaceRepositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(0);

        var updatedSpaceDto = new SpaceDTO
        {
            Id = existingSpaceGuid,
            Name = "Old Name",
            Size = 200,
            Volume = 2000,
            Description = "New Description"
        };

        var result = await spaceService.EditSpace(updatedSpaceDto);

        spaceRepositoryMock.Verify(r => r.GetSingle(updatedSpaceDto.Id), Times.Once);
        spaceRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        spaceRepositoryMock.VerifyNoOtherCalls();

        spaceConsumableRepositoryMock.VerifyNoOtherCalls();
        mapperMock.VerifyNoOtherCalls();

        Assert.IsTrue(result.HasError());
        Assert.AreEqual("Не са направени промени по помещението. Моля, опитайте отново!", result.Error.ErrorMessage);
    }

    [TestMethod]
    public async Task EditSpace_UpdatesSpaceAndConsumables_ReturnsErrorResponse()
    {
        var existingSpaceGuid = new Guid();

        Space existingSpace = null;
        spaceRepositoryMock.Setup(r => r.GetSingle(existingSpaceGuid)).Returns(existingSpace);

        var spaceDTO = new SpaceDTO
        {
            Id = existingSpaceGuid,
            Name = "Old Name",
            Size = 200,
            Volume = 2000,
            Description = "New Description"
        };

        var response = await spaceService.EditSpace(spaceDTO);

        spaceRepositoryMock.Verify(r => r.GetSingle(existingSpaceGuid), Times.Once);

        Assert.AreEqual("Помещението не беше открито. Моля, опитайте отново!", response.Error.ErrorMessage);
    }
}