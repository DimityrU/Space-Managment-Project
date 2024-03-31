namespace BusinessLayer.Services;

using AutoMapper;
using Contracts;
using Models;
using Interfaces;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using System.Collections.Generic;

public class SpaceService : ISpaceService
{
    private readonly ISpaceRepository _repository;
    private readonly IDeletableRepository<SpaceConsumable> _spaceConsumableRepository;
    private readonly IMapper _mapper;

    public SpaceService()
    {

    }

    public SpaceService(ISpaceRepository repository, IDeletableRepository<SpaceConsumable> spaceConsumableRepository, IMapper mapper)
    {
        _repository = repository;
        _spaceConsumableRepository = spaceConsumableRepository;
        _mapper = mapper;
    }

    public async Task<BaseResponse> CreateSpace(SpaceDTO spaceDto)
    {
        var response = new BaseResponse();
        var newSpace = _mapper.Map<Space>(spaceDto);

        var isSpaceNameTaken = _repository.Any(s => s.Name == spaceDto.Name);

        if (isSpaceNameTaken)
        {
            response.AddError($"Вече съществува помещение с име {spaceDto.Name}. Моля, въведете ново име!");
        }
        else
        {
            var created = await _repository.AddAsync(newSpace);
            await _repository.SaveChangesAsync();

            if (!created)
            {
                response.AddError("Неуспешно добавяне.");
            }
        }

        return response;
    }

    public CollectionResponse<SpaceBookingsDTO> GetAllSpacesWithBookings()
    {
        var response = new CollectionResponse<SpaceBookingsDTO>();

        var entities = _repository
            .GetAllWithBookings()
            .OrderBy(e => e.Name)
            .ToList();

        if (!entities.Any())
        {
            response.AddError("Няма въведени помещения.");
        }
        else
        {
            foreach (var entity in entities)
            {
                response.Data.Add(_mapper.Map<SpaceBookingsDTO>(entity));
            }
        }

        return response;
    }

    public async Task<BaseResponse> EditSpace(SpaceDTO updatedSpaceDto)
    {
        var response = new BaseResponse();
        var existingSpace = _repository.GetSingle(updatedSpaceDto.Id);

        if (existingSpace == null)
        {
            response.AddError("Помещението не беше открито. Моля, опитайте отново!");
            return response;
        }

        if (existingSpace.Name != updatedSpaceDto.Name && _repository.Any(s => s.Name == updatedSpaceDto.Name))
        {
            response.AddError($"Вече съществува помещение с име {updatedSpaceDto.Name}. Моля, въведете ново име!");
            return response;
        }

        existingSpace.Name = updatedSpaceDto.Name;
        existingSpace.Size = updatedSpaceDto.Size;
        existingSpace.Volume = updatedSpaceDto.Volume;
        existingSpace.Description = updatedSpaceDto.Description;

        foreach (var consumableDto in updatedSpaceDto.SpaceConsumables)
        {
            var consumable = _mapper.Map<SpaceConsumable>(consumableDto);

            switch (consumableDto.State)
            {
                case "modified":
                    {
                        _spaceConsumableRepository.Update(consumable);
                        break;
                    }

                case "deleted":
                    {
                        _spaceConsumableRepository.Delete(consumable);
                        break;
                    }

                case "created":
                    {
                        await _spaceConsumableRepository.AddAsync(consumable);
                        break;
                    }
            }
        }

        var changesCount = await _repository.SaveChangesAsync();

        if (changesCount == 0)
        {
            response.AddError("Не са направени промени по помещението. Моля, опитайте отново!");
        }

        return response;
    }

    public SingleResponse<SpaceDTO> GetCompleteSpace(Guid id)
    {
        var response = new SingleResponse<SpaceDTO>();
        var entity = _repository.GetSingleWithRelated(id);

        if (entity == null)
        {
            response.AddError("Възникна грешка с извеждането на детайлите. Моля, опитайте отново!");
            return response;
        }

        response.DTO = _mapper.Map<SpaceDTO>(entity);
        var spaceConsumables = new List<SpaceConsumableDTO>();

        foreach (var spaceConsumable in entity.SpaceConsumables)
        {
            spaceConsumables.Add(_mapper.Map<SpaceConsumableDTO>(spaceConsumable));
        }

        response.DTO.SpaceConsumables = spaceConsumables;

        return response;
    }

    public CollectionResponse<SpaceDTO> GetSpacesList()
    {
        var response = new CollectionResponse<SpaceDTO>();
        var spaces = new List<SpaceDTO>();
        var entities = _repository.All().OrderBy(s => s.Name).ToList();

        if (entities == null)
        {
            response.AddError("Не бяха открити помещения.");
        }
        else
        {
            foreach (var entity in entities)
            {
                spaces.Add(_mapper.Map<SpaceDTO>(entity));
            }

            response.Data = spaces;
        }

        return response;
    }
}
