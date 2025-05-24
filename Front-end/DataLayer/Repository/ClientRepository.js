import { displayPrompt } from "../../WebLayer/utilities/Prompt.js";
import { BaseResponse } from "../../BusinessLayer/Contracts/BaseResponse.js";

export class ClientRepository {
  async createClient(client) {
    try {
      const req = await fetch("https://localhost:7286/api/client/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });
      const data = await req.json();
      if (!req.ok) {
        displayPrompt(
          ".prompt-save",
          data.errorMessage,
          false
        );
      } else {
        displayPrompt(".prompt-save", "Успешно съдадохте клиент.", false);
      }
      return data;
    } catch (error) {
      displayPrompt(
        ".prompt-save",
        "Възникна проблем при създаването на клиент. Моля, опитайте отново.",
        false
      );
      return {error:{hasError:true,errorMessage:"Възникна проблем при създаването на клиент. Моля, опитайте отново."}}
    }
  }

  async editClient(client) {
   
    try {
      const req = await fetch("https://localhost:7286/api/client/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });
      const data = await req.json();
      if (!req.ok) {
        displayPrompt(
          ".prompt-save",
          data.errorMessage,
          false
        );
      } else {
        displayPrompt(".prompt-save", "Успешно променихте данните на клиента.", false);
      }
      return data;
    } catch (error) {
      displayPrompt(
        ".prompt-save",
        "Възникна проблем проблем при промяната на клиент. Моля, опитайте отново.",
        false
      );
      return {error:{hasError:true,errorMessage:"Възникна проблем при модифицирането на клиент. Моля, опитайте отново."}}
    }
  }

  async getAllClients()
    {
        let response = new BaseResponse();
        try
        {
            const req = await fetch("https://localhost:7286/api/client/all");
            if (!req.ok) {
              response.addError("Имаше проблем с извеждането на клиентите. Моля опитайте отново.")
              return response;
            }
            let clients = await req.json();
            response.data = clients.data;
            return response;
        } 
        catch (error)
        {
            response.addError("Имаше проблем с извеждането на клиентите. Моля опитайте отново.")
            return response;
        }
    };

    async deleteClient(id) {
      let response = new BaseResponse();
      try {
        let req = await fetch(`https://localhost:7286/api/client/delete/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(id)
        });
        let data =  await req.json();
        response.error=data.error.hasError;
        response.message=data.error.message;
      } catch (error) {
        response.addError("Изникна проблем с премахването на клиента.");
      }
      return response;
    }      

}
