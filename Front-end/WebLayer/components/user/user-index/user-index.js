import { Components } from "../../../utilities/Components.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import {UserController} from "../../../Controllers/UserController.js";
import {getUsernameFromCookie} from "../../../utilities/GetUsernameCookie.js";
Components("admin");

let userController = new UserController();
let users;

window.addEventListener("load", async () => {
    let username = getUsernameFromCookie("SMPlace");
    let isAdmin=false;
    try {
        let response  = await fetch(`https://localhost:7286/api/user/admin/${username}`);
        let data = await response.json();
        isAdmin = !data.error.hasError;
    } catch (error) {
        alert("Имаше проблем със заявката.");
        window.history.back();
    };
    if (!isAdmin) {
       alert("Нямате права да достъпвате тази страница.");
       window.history.back();
    };
    users = await userController.getAllUsers();
    users.sort((a, b) => (a === username ? -1 : 0));
    DisplayContent(users);
});

function DisplayContent(users)
{
    let container = document.querySelector(".sm-container");
    users.forEach(user => {
        let div = document.createElement("div");
        
        let p = document.createElement("p");
        p.innerHTML =  user == getUsernameFromCookie("SMPlace")?`Вие (<p class="logged-user">${user}</p>)` : `${user}`;
        p.classList.add("user-name");
        div.appendChild(p);


        if(user !== getUsernameFromCookie("SMPlace"))
        {
        let span = document.createElement("span");
        span.classList.add("material-symbols-outlined");
        span.classList.add("delete");
        span.textContent = "delete";
        span.addEventListener("click", async () => {
            let isDeleted = await displayPrompt('.prompt-save',`Изтриване на потребител ${user}?`,true);
            if (isDeleted) {
                let response = await userController.deleteUser({deletedUser: user,loggedAdmin:getUsernameFromCookie("SMPlace")});
                if(response.error.hasError)
                {
                    await displayPrompt('.prompt-save',response.error.message,false);
                    window.location.reload();
                }
                else{
                    await displayPrompt('.prompt-save',`Усепешно изтрихте потребител ${user}.`,false);
                    window.location.reload();
                }
            };
            return;
        });
        div.appendChild(span);
        };
        container.appendChild(div);  
    }
    );
};