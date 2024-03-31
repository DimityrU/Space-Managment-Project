namespace BusinessLayer.Services;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using AutoMapper;
using Contracts;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Interfaces;
using Models;

public class ConsumableService : IConsumablesService
{
    private readonly IDeletableRepository<Consumable>? _repository;
    private readonly IDeletableRepository<Consumable> _consumableRepository;
    private readonly IMapper _mapper;

    public ConsumableService(IDeletableRepository<Consumable> repository, IDeletableRepository<Consumable> consumableRepository, IMapper mapper)
    {
        _repository = repository;
        _consumableRepository = consumableRepository;
        _mapper = mapper;
    }

    public CollectionResponse<ConsumableDTO> GetAll()
    {
        var response = new CollectionResponse<ConsumableDTO>();
        var consumables = new List<ConsumableDTO>();
        var entities = _consumableRepository?.All().OrderBy(c => c.Name).ToList();

        if (entities == null)
        {
            response.AddError("Няма съществуващи консумативи.");
        }
        else
        {
            foreach (var entity in entities)
            {
                consumables.Add(_mapper.Map<ConsumableDTO>(entity));
            }

            response.Data = consumables;
        }

        return response;
    }

    public async Task<BaseResponse> EditMultiple(List<ConsumableDTO> consumables)
    {
        var response = new BaseResponse();

        if (consumables.Count < 1)
        {
            response.AddError("Празна заявка!");
        }

        foreach (var consumable in consumables)
        {
            switch (consumable.State)
            {
                case "modified":
                {
                    var updated = _mapper.Map<Consumable>(consumable);
                    _repository?.Update(updated);
                    break;
                }

                case "deleted":
                {
                    var deleted = _mapper.Map<Consumable>(consumable);
                    const string fkColumnName = "ConsumablesId";
                    _repository?.DeleteEntriesWithForeignKeys<SpaceConsumable, Guid>(fkColumnName, consumable.Id);
                    _repository?.Delete(deleted);
                    break;
                }

                case "created":
                {
                    var created = _mapper.Map<Consumable>(consumable);
                    await _repository?.AddAsync(created);
                    break;
                }
            }
        }

        var changesCount = await _repository?.SaveChangesAsync();

        if (changesCount < consumables.Count && changesCount > 0)
        {
            response.AddError("Не всички операции преминаха успешно.");
        }
        else if (changesCount == 0)
        {
            response.AddError("Операциите не преминаха успешно. Моля опитайте отново.");
        }

        return response;
    }
}
