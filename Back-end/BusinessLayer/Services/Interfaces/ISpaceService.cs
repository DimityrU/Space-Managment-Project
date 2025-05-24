namespace BusinessLayer.Services.Interfaces;

using Contracts;
using Models;

public interface ISpaceService
{
    CollectionResponse<SpaceDTO> GetSpacesList();

    SingleResponse<SpaceDTO> GetCompleteSpace(Guid id);

    Task<BaseResponse> CreateSpace(SpaceDTO spaceDto);

    CollectionResponse<SpaceBookingsDTO> GetAllSpacesWithBookings();

    Task<BaseResponse> EditSpace(SpaceDTO updatedSpaceDto);
}
