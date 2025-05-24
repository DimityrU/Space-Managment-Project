import SpaceDTO from "../Models/SpaceDTO.js";

export class SpaceMap
{
    MapToSpace(spaceData,hasId)
    {
        const spaceDTO = new SpaceDTO(hasId ? true : false);
        if(hasId)
        {
            spaceDTO.id = spaceData.id;
        };
        spaceDTO.name = spaceData.name;
        spaceDTO.size = spaceData.size;
        spaceDTO.volume = spaceData.volume;
        spaceDTO.description = spaceData.description ? spaceData.description : "";
        spaceDTO.spaceConsumables = spaceData.spaceConsumables ? spaceData.spaceConsumables : [];
        spaceDTO.bookings = spaceData.bookings ? spaceData.bookings : [];
        return spaceDTO;
    }
}