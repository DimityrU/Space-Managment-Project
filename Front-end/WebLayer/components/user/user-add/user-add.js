import { Components } from "../../../utilities/Components.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import {UserController} from "../../../Controllers/UserController.js"
import { getUsernameFromCookie } from "../../../utilities/GetUsernameCookie.js";
Components("admin");
let userController = new UserController();

window.addEventListener("load", async () => {
    let username = getUsernameFromCookie("SMPlace");
    let isAdmin=false;
    try {
        let response  = await fetch(`https://localhost:7286/api/user/admin/${username}`);
        let data = await response.json();
        isAdmin = !data.error.hasError;
    } catch (error) {
        displayPrompt('.save-prompt',"Имаше проблем със заявката.",false);
        window.history.back();
    };
    if (!isAdmin) {
       displayPrompt('.save-prompt',"Нямате права да достъпвате тази страница.",false);
       window.history.back();
    };

    document.querySelector(".show-password").addEventListener("click", () => { 
        let password = document.getElementById("password");
        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        };
    });

    document.querySelector(".add-user").addEventListener("click", (e)=>AddUser(e));
});

async function AddUser(e)
{
    e.preventDefault();
    let newUsername = document.getElementById("username").value;
    let role = 0;
    let loggedAdmin = getUsernameFromCookie("SMPlace"); 
    if(!newUsername || !document.getElementById("password").value)
    {
        displayPrompt('.prompt-save',"Моля, попълнете всички полета.",false);
        return;
    }
    let createdUser = await userController.createNewUser({
        Username: newUsername,
        Password: document.getElementById("password").value,
        Role: role,
        LoggedUser: loggedAdmin
    });
    if(createdUser.error.hasError)
    {
        await displayPrompt('.prompt-save',createdUser.error.message,false);
        window.location.reload();
    }
    else{
        await displayPrompt('.prompt-save',"Успешно създадохте нов мениджърски акаунт.",false);
        window.location.reload();
    };
};