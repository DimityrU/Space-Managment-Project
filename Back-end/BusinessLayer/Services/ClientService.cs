namespace BusinessLayer.Services;

using System;
using System.Threading.Tasks;

using AutoMapper;
using Contracts;
using Models;
using DataLayer.Repository.Interface;
using Interfaces;
using DataLayer.Entities;
using Microsoft.EntityFrameworkCore;

public class ClientService : IClientService
{
    private readonly IRepository<Client> _repository;
    private readonly IMapper _mapper;

    public ClientService(IRepository<Client> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<BaseResponse> CreateClient(ClientDTO clientDto)
    {
        var response = new BaseResponse();

        var existingClients = _repository.AllAsNoTracking();
        if (existingClients.Any(client => client.Pin == clientDto.Pin))
        {
            response.AddError("Вече съществува клиент с това ЕГН/ЕИК.");

            return response;
        }

        Client client = _mapper.Map<Client>(clientDto);
        var isAdded = await _repository.AddAsync(client);

        try
        {

            await _repository.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine(ex.Message);
            response.AddError("Неуспешно добавяне на клиент. Моля, въведете валидни данни!");
            return response;
        }

        if (!isAdded)
        {
            response.AddError("Неуспешно добавяне на клиент. Моля, опитайте отново!");
        }

        return response;
    }

    public async Task<SingleResponse<ClientDTO>> GetClient(Guid id)
    {
        var response = new SingleResponse<ClientDTO>();
        try
        {
            var client = _repository.GetSingle(id);
            if (client == null)
            {
                response.AddError("Клиента не съществува. Моля, опитайте отново!");
            }

            response.DTO = _mapper.Map<ClientDTO>(client);
        }
        catch (Exception )
        {
            response.AddError("Възникна грешка при извеждането на клиента.");
        }

        return response;
    }

    public async Task<BaseResponse> EditClient(ClientDTO updatedClientDto)
    {
        var response = new BaseResponse();
        var clientEntity = _repository.GetSingle(updatedClientDto.Id);

        if (clientEntity == null)
        {
            response.AddError("Възникна грешка при обновяването на клиента.");

            return response;
        }

        if (updatedClientDto.Pin != clientEntity.Pin && _repository.Any(c => c.Pin == updatedClientDto.Pin))
        {
            response.AddError("Вече съществува клиент с това ЕГН/ЕИК.");

            return response;
        }

        clientEntity.Pin = updatedClientDto.Pin;
        clientEntity.Name = updatedClientDto.Name;
        clientEntity.Number = updatedClientDto.Number;
        clientEntity.Email = updatedClientDto.Email;

        var changes = await _repository.SaveChangesAsync();

        if (changes == 0)
        {
            response.AddError("Не са направени промени по клиента. Моля, опитайте отново!");
        }

        return response;
    }

    public CollectionResponse<ClientDTO> GetAllClients()
    {
        var response = new CollectionResponse<ClientDTO>();
        var clients = new List<ClientDTO>();
        var entities = _repository
            .All()
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.Name)
            .ToList();

        if (entities.Count == 0)
        {
            response.AddError("Няма такъв лист.");
        }
        else
        {
            foreach (var entity in entities)
            {
                clients.Add(_mapper.Map<ClientDTO>(entity));
            }

            response.Data = clients;
        }

        return response;
    }

    public async Task<BaseResponse> DeleteClient(Guid id)
    {
        var response = new BaseResponse();
        var client = _repository.GetSingle(id);
        if (client == null)
        {
            response.AddError("Възникна проблем при намирането на клиента.");
        }
        else
        {
            client.IsDeleted = true;
            await _repository.SaveChangesAsync();
        }

        return response;
    }
}
