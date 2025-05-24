import {BaseResponse} from "../../BusinessLayer/Contracts/BaseResponse.js"

export class UserRepository
{
    async getAll()
    {
        let response = new BaseResponse();
        try {
            let data = await fetch('https://localhost:7286/api/user/all');
            response = await data.json();
        } 
        catch (error) 
        {
            response.addError("Неуспешно изпълняване на операцията.");
            response.error = true;
        };
        return response;
    };

    async createNewUser(user)
    {
        let response = new BaseResponse();
        try {
            let request = await fetch(
                "https://localhost:7286/api/user/create",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(user),
                }
              );
            response = await request.json();
        } 
        catch  (error) 
        {
            response.addError("Грешка при изпълнението на операцията.");
            response.error = true;
        };
        return response;
    };

    async deleteUser(data)
    {
        let response = new BaseResponse();
        try {
          let request = await fetch(`https://localhost:7286/api/user/${data.deletedUser}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(data.loggedAdmin),
          });
            response = await request.json();
        } 
        catch  (error)
         {
            response.addError("Неуспешно изпълняване на операцията.");
            response.error = true;
        };
        return response;
    };
}