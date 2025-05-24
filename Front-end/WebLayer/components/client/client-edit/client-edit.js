import { ClientController } from "../../../Controllers/ClientController.js";
import { Components } from "../../../utilities/Components.js";
import { Client } from "../../../../BusinessLayer/Models/Client.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import { GetParameter } from "../../../utilities/GetUrlParam.js";
import GetClientData from "../../../utilities/GetClientData.js";
import { getData } from "../../../utilities/SpaceBackendRequests.js";

Components("clients");
const clientController = new ClientController();
const clientId = GetParameter("id");
const client = new Client();
const nameInput = document.querySelector("#client-name");
const pinNumberInput = document.querySelector("#pin-number");
const phoneNumberInput = document.querySelector("#phone-number");
const emailInput = document.querySelector("#e-mail");

window.addEventListener("load", async () => {
  await GetClientDetails(client);
  DisplayContent(client);
  
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
    let client = {
      id: clientId,
      name: name,
      pin: pinNumber
    };

    if (phoneNumber !== ""){
        client.number = phoneNumber;
    }

    if (email !== ""){
        client.email = email;
    }

    let response = await clientController.EditClient(client);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", "Запазването беше неуспешно", false);
    } else {
      await displayPrompt(
        ".prompt-save",
        "Успешно променихте данните на клиента.",
        false
      );

      window.location.href = "../client-index/clients.html";
    }
  });

  document.querySelector(".no").addEventListener("click", () => {
    prompt.style.display = "none";
    prompt.innerHTML = "";
  });

  prompt.style.display = "block";
  return;
});

async function GetClientDetails(client) {
  try {
    let data = await getData(`https://localhost:7286/api/client/${clientId}`);
    let clientResponse = data.dto;

    client.name = clientResponse.name;
    client.pin = clientResponse.pin;
    client.phoneNumber = clientResponse.number;
    client.email = clientResponse.email;
  } catch (error) {
    console.error(error);
  }
}

function DisplayContent(client) {
  nameInput.value = client.name;
  pinNumberInput.value = client.pin;
  phoneNumberInput.value = client.phoneNumber || "";
  emailInput.value = client.email || "";
}
