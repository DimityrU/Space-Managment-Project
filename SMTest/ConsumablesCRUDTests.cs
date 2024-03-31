namespace SMTest;
using AutoMapper;
using BusinessLayer.Models;
using BusinessLayer.Services;
using BusinessLayer.Services.Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebAPI.Controllers;


[TestClass]
public class ConsumablesCRUDTests
{
    private ConsumablesController consumablesController;
    private IConsumablesService consumableService;
    private Mock<IDeletableRepository<Consumable>> repositoryMock;
    private Mock<IDeletableRepository<Consumable>> consumableRepository;
    private Mock<IMapper> mapperMock;

	[TestInitialize]
    public void Setup()
    {
        mapperMock=new Mock<IMapper>();
        repositoryMock = new Mock<IDeletableRepository<Consumable>>();
        consumableRepository = new Mock<IDeletableRepository<Consumable>>();
		consumableService= new ConsumableService(repositoryMock.Object, consumableRepository.Object,mapperMock.Object) ;
        //consumablesController = new ConsumablesController(consumableServiceMock.Object);
    }

    [TestMethod]
    public async Task CreateConsumable_ServiceCallsRepository_ReturnsTrue()
    {
		//Arrange
		var entry = new ConsumableDTO()
        {
            Name = "Tester",BaseUnit = "kW",Id = new Guid(),Price = 20,State = "created"
        };
        var consumables = new List<ConsumableDTO>(){entry};
        var consumable =new Consumable()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20
		};

        //Set up expectations
		mapperMock.Setup(x => x.Map<Consumable>(It.IsAny<ConsumableDTO>())).Returns(consumable);
        repositoryMock.Setup(repo =>
            repo.AddAsync(It.Is<Consumable>(x => x.Equals(consumable))));

        //Act
        await consumableService.EditMultiple(consumables);

		//Assert
        repositoryMock.Verify(repo=> 
            repo.AddAsync(It.Is<Consumable>(x => x.Equals(consumable))), Times.AtLeastOnce());
    }

    [TestMethod]
    public async Task MultipleCRUD_AllOperationsInvoke_CorrectMethods()
    {
        //Arrange
        var entry1 = new ConsumableDTO()
        {
            Name = "Tester1",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20,
            State = "created"
        };
        var entry2 = new ConsumableDTO()
        {
            Name = "Tester2",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20,
            State = "deleted"
        };
        var entry3 = new ConsumableDTO()
        {
            Name = "Tester3",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20,
            State = "modified"
        };
		var consumables = new List<ConsumableDTO>() { entry1,entry2,entry3 };
        var consumable = new Consumable()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20
        };

        //Set up expectations
        mapperMock.Setup(x => x.Map<Consumable>(It.IsAny<ConsumableDTO>())).Returns(consumable);
        repositoryMock.Setup(repo =>
            repo.AddAsync(It.Is<Consumable>(x => x.Equals(consumable))));
        repositoryMock.Setup(repo =>
            repo.Delete(It.Is<Consumable>(x => x.Equals(consumable))));
        repositoryMock.Setup(repo =>
            repo.Update(It.Is<Consumable>(x => x.Equals(consumable))));

		//Act
		await consumableService.EditMultiple(consumables);

        //Assert
        repositoryMock.Verify(repo =>
            repo.AddAsync(It.Is<Consumable>(x => x.Equals(consumable))), Times.AtLeastOnce());
        repositoryMock.Verify(repo =>
            repo.Update(It.Is<Consumable>(x => x.Equals(consumable))), Times.AtLeastOnce());
        repositoryMock.Verify(repo =>
            repo.Delete(It.Is<Consumable>(x => x.Equals(consumable))), Times.AtLeastOnce());
	}

    [TestMethod]
    public async Task MockService_Test_NoChangesResponse()
    {
        //Arrange
        var entry = new ConsumableDTO()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20,
            State = "created"
        };
        var consumables = new List<ConsumableDTO>() { entry };
        var consumable = new Consumable()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20
        };

        //Set up expectations
        mapperMock.Setup(x => x.Map<Consumable>(It.IsAny<ConsumableDTO>())).Returns(consumable);
        repositoryMock.Setup(repo =>
            repo.AddAsync(It.Is<Consumable>(x => x.Equals(consumable))));

        //Act
        var response=await consumableService.EditMultiple(consumables);

        //Assert
        Assert.AreEqual("Операциите не преминаха успешно. Моля опитайте отново.", response.Error.ErrorMessage);
    }

    [TestMethod]
    public async Task MockService_Test_ChangesMade_NotAllChangesSaved_Response()
    {
        //Arrange
        var entry = new ConsumableDTO()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20,
            State = "created"
        };
        var entry2 = new ConsumableDTO()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20,
            State = "created"
        };

		var consumables = new List<ConsumableDTO>() { entry,entry2 };
        var consumable = new Consumable()
        {
            Name = "Tester",
            BaseUnit = "kW",
            Id = new Guid(),
            Price = 20
        };
        var changesMade = 1;
        //Set up expectations
        mapperMock.Setup(x => x.Map<Consumable>(It.IsAny<ConsumableDTO>())).Returns(consumable);
        repositoryMock.Setup(repo =>
            repo.AddAsync(It.Is<Consumable>(x => x.Equals(consumable))));
        repositoryMock.Setup(repo =>
            repo.SaveChangesAsync()).Returns(Task.FromResult(changesMade));
		//Act
		var response = await consumableService.EditMultiple(consumables);

        //Assert
        Assert.AreEqual("Не всички операции преминаха успешно.", response.Error.ErrorMessage);
    }
}
