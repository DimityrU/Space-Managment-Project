import { UserRepository } from "../../DataLayer/Repository/UserRepository.js";

export class UserService
{
    constructor()
    {
        this.userRepository = new UserRepository();
    };

    async getAllUsers()
    {
        let response = await this.userRepository.getAll();
        return response;
    };

    async createNewUser(user)
    {
        let response = await this.userRepository.createNewUser(user);
        return response;
    };

    async deleteUser(data)
    {
        let response = await this.userRepository.deleteUser(data);
        return response;
    };
}