import { Components } from "../../../utilities/Components.js";
import { ClientController } from "../../../Controllers/ClientController.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import GetClientData from "../../../utilities/GetClientData.js";

Components("clients");
const clientController = new ClientController();

window.addEventListener("load", async () => {
  document.querySelector(".blur").classList.remove("blur");
  document.querySelector(".loader").remove();
});

let newClientForm = document.querySelector("#newClientForm");

newClientForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { name, pinNumber, phoneNumber, email } = GetClientData();

  let prompt = document.querySelector(".prompt-save");
  prompt.innerHTML = `<p>Запази промените?</p>
    <button class="yes btn-custom hoverable">Да</button>
    <button class="no  btn-custom hoverable">Не</button>`;

  document.querySelector(".yes").addEventListener("click", async () => {
    let newClient = {
      name: name,
      pin: pinNumber,
    };

    if (phoneNumber !== "") {
      newClient.number = phoneNumber;
    }

    if (email !== "") {
      newClient.email = email;
    }

    let response = await clientController.CreateClient(newClient);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", "Запазването беше неуспешно", false);
    } else {
      await displayPrompt(
        ".prompt-save",
        "Успешно създаване на нов клиент.",
        false
      );

      window.location.href = `../client-index/clients.html?newItem=${pinNumber}`;
    }
  });

  document.querySelector(".no").addEventListener("click", () => {
    prompt.style.display = "none";
    prompt.innerHTML = "";
  });

  prompt.style.display = "block";
  return;
});
