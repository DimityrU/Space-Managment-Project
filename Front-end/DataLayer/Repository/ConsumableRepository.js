import { BaseResponse } from "../../BusinessLayer/Contracts/BaseResponse.js";

export class ConsumableRepository
{
    async getAllConsumables()
    {
        let response = new BaseResponse();
        try
        {
            const data = await fetch("https://localhost:7286/api/consumables/all");
            response =await data.json();
        } 
        catch (error)
        {
            response.addError("Имаше проблем с извеждането на консумативите. Моля опитайте отново.")
        };
        return response;
    };

    async editMultiple(changes)
    {
        let response = new BaseResponse();
        try {
            const data=await fetch('https://localhost:7286/api/consumables/edit', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'},
                body: JSON.stringify(changes)});
            response = await data.json();
        }
        catch(error){
            response.addError("Имаше проблем със запазването на промените. Моля опитайте отново.")
        };
        return response
    };
}