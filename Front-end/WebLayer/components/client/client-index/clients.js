import { Components } from "../../../utilities/Components.js";
import { ClientController } from "../../../Controllers/ClientController.js";
import { SortTableColumn } from "../../../utilities/TableSorting.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
import { checkForNewEntry } from "../../../utilities/HighlightNewEntry.js";
await checkCookieExists("SMPlace");
Components("clients");
let clientController = new ClientController();
let clients = [];

window.addEventListener("load", async () => {
  clients = [...(await clientController.GetAllClients())];
  let newItem = checkForNewEntry('newItem','pin',clients);
  DisplayContent(clients,newItem);
  AddSorting(clients);
  AddFilters();

  document.getElementById("name").value = "";
  document.getElementById("pin").value = "";
  document.getElementById("phoneNumber").value = "";
  document.getElementById("email").value = "";

  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove("blur");
});

function DisplayContent(content,newItem) {
  let tableBody = document.querySelector(".bookings-table-body");
  tableBody.innerHTML = "";

  content.map((item) => {
    let phoneNumber = item.phoneNumber !== null
      ? item.phoneNumber
      : ` <span class="material-symbols-outlined" title="Няма данни.">
        unknown_med
        </span>`;
    let email = item.email !== null
      ? item.email
      : ` <span class="material-symbols-outlined" title="Няма данни.">
        unknown_med
        </span>`;
    let itemRow = `<tr>
        <td class="tw-1">${item.name}</td>
        <td class="tw-2">${item.pin}</td>
        <td class="tw-3">${phoneNumber}</td>
        <td class="tw-4">${email}</td>
        <td class="tw-5">
        <span class="material-symbols-outlined edit-client clickable edit" data-link="../client-edit/client-edit.html?id=${item.id}"
        title="Редактирай клиент.">
        edit
        </span>
        <span class="material-symbols-outlined delete-client clickable" data-link="${item.id}"
        title="Изтрий клиент.">
        delete
        </span>
        </td>
        </tr>`;

    return (tableBody.innerHTML += itemRow);
  });

  if(newItem)
  {
    let spacesTable = document.querySelector(".custom-table");
    var firstRow = spacesTable.rows[1];
    firstRow.classList.add("highlight");
    firstRow.classList.add("new-item");
  
    setTimeout(() => {
      firstRow.classList.remove("highlight");
    }, 2000);
  };

  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = button.dataset.link;
    });
  });
  document.querySelectorAll(".delete-client").forEach((button) => {
    button.addEventListener("click", async () => {
      await DeleteClients(button.dataset.link);
    });
  });
}

function AddSorting(array) {
  let sortName = document.querySelector(".name-sort");
  let sortPIN = document.querySelector(".pin-sort");
  let sortNumber = document.querySelector(".phoneNumber-sort");
  let sortEmail = document.querySelector(".email-sort");

  sortName.remove();
  sortPIN.remove();
  sortNumber.remove();
  sortEmail.remove();

  document.querySelector(
    ".tw-1"
  ).innerHTML += `<span class="material-symbols-outlined name-sort ascending active">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-2"
  ).innerHTML += `<span class="material-symbols-outlined pin-sort ascending">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-3"
  ).innerHTML += `<span class="material-symbols-outlined phoneNumber-sort ascending">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-4"
  ).innerHTML += `<span class="material-symbols-outlined email-sort ascending">arrow_drop_down</span>`;

  sortName = document.querySelector(".name-sort");
  sortPIN = document.querySelector(".pin-sort");
  sortNumber = document.querySelector(".phoneNumber-sort");
  sortEmail = document.querySelector(".email-sort");

  sortName.addEventListener("click", () => {
    SortTableColumn(array, "name", "alphabetic");
    DisplayContent(array);
  });

  sortPIN.addEventListener("click", () => {
    SortTableColumn(array, "pin", "numeric");
    DisplayContent(array);
  });

  sortNumber.addEventListener("click", () => {
    SortTableColumn(array, "phoneNumber", "numeric");
    DisplayContent(array);
  });

  sortEmail.addEventListener("click", () => {
    SortTableColumn(array, "email", "alphabetic");
    DisplayContent(array);
  });
}

function AddFilters() {
  document.querySelector(".filter").addEventListener("click", () => {
    FilterClients(
      document.getElementById("name").value,
      document.getElementById("pin").value,
      document.getElementById("phoneNumber").value,
      document.getElementById("email").value
    );
  });
}

function FilterClients(name, pin, phoneNumber, email) {
  const filteredclients = clients.filter((client) => {
    if (name && !client.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    if (pin && !client.pin.includes(pin)) {
      return false;
    }
    if (phoneNumber && !client.phoneNumber.includes(phoneNumber)) {
      return false;
    }
    if (email && !client.email.toLowerCase().includes(email.toLowerCase())) {
      return false;
    }
    return true;
  });
  DisplayContent(filteredclients);
  AddSorting(filteredclients);
}

async function DeleteClients(id) {
  let result = await displayPrompt(
    ".prompt-save",
    "Желаете ли да изтриете клиента?",
    true
  );

  if (result) {
    await clientController.DeleteClient(id);
    window.location.href = "./clients.html";
  }
}
