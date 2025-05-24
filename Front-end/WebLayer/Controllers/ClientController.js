import { ClientService } from "../../BusinessLayer/Services/ClientService.js";
import { ClientMapper } from "../../BusinessLayer/Mappers/ClientMapper.js";
import { displayPrompt } from "../utilities/Prompt.js";
export class ClientController {
  constructor() {
    this.clientMapper = new ClientMapper();
    this.ClientService = new ClientService();
  }

  async CreateClient(client) {
    return await this.ClientService.createClient(client);
  }

  async EditClient(client){
    return await this.ClientService.editClient(client);
  }

  async GetAllClients()
  {
      let response = await this.ClientService.getAllClients();
      if(response.error.hasError)
      {
          await displayPrompt('.prompt-save', response.message, false);
          return;
      };
      let clients = response.data.map(clientData=>this.clientMapper.MapToClient(clientData));
      return clients;
  };

  async DeleteClient(id)
  {
      let response = await this.ClientService.deleteClient(id);
      if(response.error.hasError)
      {
      await displayPrompt('.prompt-save', response.message, false);
      return;
      };
      await displayPrompt('.prompt-save', 'Успешно изтрихте клиента.', false);
      return;
  };
};
