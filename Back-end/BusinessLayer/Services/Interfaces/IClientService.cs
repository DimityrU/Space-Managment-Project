namespace BusinessLayer.Services.Interfaces;

using Contracts;
using Models;

public interface IClientService
{
    CollectionResponse<ClientDTO> GetAllClients();

    Task<BaseResponse> CreateClient(ClientDTO clientDto);

    Task<SingleResponse<ClientDTO>> GetClient(Guid id);

    Task<BaseResponse> EditClient(ClientDTO updatedClientDto);

    Task<BaseResponse> DeleteClient(Guid id);
}
