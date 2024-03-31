namespace BusinessLayer.Services.Interfaces;

using System.Collections.Generic;
using System.Threading.Tasks;
using Contracts;
using Models;

public interface IConsumablesService
{
    CollectionResponse<ConsumableDTO> GetAll();

    Task<BaseResponse> EditMultiple(List<ConsumableDTO> consumables);
}
