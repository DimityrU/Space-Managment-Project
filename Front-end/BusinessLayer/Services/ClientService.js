import { ClientRepository } from "../../DataLayer/Repository/ClientRepository.js";

export class ClientService {
    constructor() {
      this.ClientRepository = new ClientRepository();
    }
  
async createClient(client) {
    return await this.ClientRepository.createClient(client);
  }

  async editClient(client){
    return await this.ClientRepository.editClient(client);
  }

  async getAllClients()
  {
      let response = await this.ClientRepository.getAllClients();
      return response;
  };

  async deleteClient(id)
  {
      let response = await this.ClientRepository.deleteClient(id);
      return response;
  };

};