import {ConsumableRepository} from "/DataLayer/Repository/ConsumableRepository.js"

export class ConsumableService
{
    constructor()
    {
        this.consumableRepository = new ConsumableRepository();
    };

    async getAllConsumables()
    {
        let response = await this.consumableRepository.getAllConsumables();
        return response;
    };

    async editMultiple(changes)
    {
        let response = await this.consumableRepository.editMultiple(changes);
        return response;
    };
}