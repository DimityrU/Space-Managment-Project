import {ConsumableDTO} from "../Models/ConsumableDTO.js";

export class ConsumableMapper
{
    MapToConsumable(data,hasId)
    {
        let consumable = new ConsumableDTO();
        if(hasId)
        {
            consumable.id = data.id;
        };
        consumable.name = data.name;
        consumable.price = data.price;
        consumable.state = data.state;
        consumable.baseUnit = data.baseUnit;
        return consumable;
    };
}