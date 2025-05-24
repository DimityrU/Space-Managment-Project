import { Client } from  "../Models/Client.js"

export class ClientMapper{
    MapToClient(data){
        let client = new Client();
        client.id = data.id;
        client.name = data.name;
        client.pin = data.pin;
        client.phoneNumber = data.number;
        client.email = data.email;

        return client;
    }
}