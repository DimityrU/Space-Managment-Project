import { UserService } from "../../BusinessLayer/Services/UserService.js"

export class UserController
{
    constructor()
    {
        this.userService = new UserService();
    };

    async getAllUsers()
    {
        let res = await this.userService.getAllUsers();
        if(res.error.hasError)
        {
            alert("Имаше проблем с извеждането на списъка.");
            return;
        };
        return res.data;
    };

    async createNewUser(user)
    {
        let res = await this.userService.createNewUser(user);
        return res;
    };

    async deleteUser(data)
    {
        let res = await this.userService.deleteUser(data);
        return res;
    };
}