import { Components } from "../../../utilities/Components.js";
import { SpaceDTO } from "../../../../BusinessLayer/Models/Services.js";
import { GetParameter } from "../../../utilities/GetUrlParam.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import { getData } from "../../../utilities/SpaceBackendRequests.js";
import { SpaceController } from "../../../Controllers/SpaceController.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
await checkCookieExists("SMPlace");
Components("spaces");
const spaceId = GetParameter("id");
const space = new SpaceDTO();
const spaceController = new SpaceController();
const nameInput = document.querySelector("#officeName");
const sizeInput = document.querySelector("#officeSize");
const volumeInput = document.querySelector("#officeVolume");
const descriptionInput = document.querySelector("#officeDescription");
const consumablesInput = document.querySelector(".input-consumables");
let addedCounter = 1;
let consumables = [];

 function SaveChanges() {

  displayPrompt('.prompt-save', 'Запази промените?', true).then(result => {
    if(result) {
 
      space.name = document.querySelector("#officeName").value;
      space.size = document.querySelector("#officeSize").value;
      space.volume = document.querySelector("#officeVolume").value;
      space.description = document.querySelector("#officeDescription").value;
      space.spaceConsumables = space.spaceConsumables.filter(
        (consumable) => consumable.state !== null
      );
  
      space.spaceConsumables.forEach((consumable) => {
        if (consumable.state === "created") {
          delete consumable.id;
        }
      });
  
      spaceController.EditSpace(space);
    }
  });

  return;
}

async function GetDetails(space) {
  try {
    let data = await getData(`https://localhost:7286/api/space/${spaceId}`);
    let spaceResponse = data.dto;

    space.name = spaceResponse.name;
    space.id = spaceResponse.id;
    space.size = spaceResponse.size;
    space.volume = spaceResponse.volume;
    space.description = spaceResponse.description;
    space.spaceConsumables = spaceResponse.spaceConsumables;
    space.spaceConsumables.forEach((consumable) => {
      consumable;
    });
  } catch (error) {
    console.error(error);
  }
}

async function GetConsumables() {
  try {
    const data = await getData(`https://localhost:7286/api/consumables/all`);
    consumables = data.data;
  } catch (error) {
    console.error(error);
  }
}

function GenerateNewRow(e) {
  e.preventDefault();
  if (document.querySelector(`.done-create-${addedCounter}`) != null) {
    return;
  }

  document.querySelector(".custom-table").classList.remove("hidden");


  let consumablesTable = document.querySelector(".input-consumables");
  consumablesTable.innerHTML =
    `
    <tr id="new-row-${addedCounter}">
    <td class="name tw-1">
        <select id="consumable-select" class="edited-name edit-input"></select>
    </td>
    <td class="base-unit tw-2">
        <input class="edited-count edit-input" type="number" min="0" step="any" placeholder="Брой"/>
    </td>
    <td class="tw-3">
        <span class="material-symbols-outlined clickable done-create-${addedCounter}" title="Завърши">
            done
        </span>
        <span class="material-symbols-outlined clickable delete-${addedCounter} new-row-${addedCounter}" title="Отмени">
            disabled_by_default
        </span>
    </td>
    </tr>` + consumablesTable.innerHTML;

  const select = document.getElementById("consumable-select");
  AddConsumablesToTable(select);

  document
    .querySelector(`.done-create-${addedCounter}`)
    .addEventListener("click", () => {
      if (
        !ValidateNumberFields(document.querySelector(".edited-count").value)
      ) {       
        displayPrompt('.prompt-save', 'Бройката на консумативите трябва да бъде положително число.', false);
        return;
      }

      if(+officeSize >= +officeVolume){
        displayPrompt('.prompt-save', 'Площа на залата не може да е по - малък или равен от обема', false);
        return;
      }

      const consumaleId = document.querySelector("#consumable-select").value;
      if (CheckIfSpaceHasConsumable(consumaleId)) {
        const consumable = consumables.find((c) => c.id == consumaleId);
        displayPrompt('.prompt-save', `В помещението вече има ${consumable.name}.`, false);
        return;
      }
      AddNew(`new-row-${addedCounter}`);
    });
  document
    .querySelector(`.delete-${addedCounter}`)
    .addEventListener("click", () =>
      DeleteConsumable(`new-row-${addedCounter}`)
    );
}

async function AddConsumablesToTable(select) {
  consumables.forEach((consumable) => {
    let option = document.createElement("option");
    option.value = consumable.id;
    option.textContent = consumable.name;
    select.appendChild(option);
  });
}

function AddNew(id) {
  const consumable = consumables.find(
    (c) => c.id == document.querySelector(".edited-name").value
  );
  let newConsumable = {
    id: id,
    consumablesId: consumable.id,
    spaceId: space.id,
    count: document.querySelector(".edited-count").value,
    state: "created",
  };
  space.spaceConsumables.push(newConsumable);
  DisplayContent(space);
  addedCounter++;
}

function DisplayContent(space, hasLoaded = true) {
  nameInput.setAttribute("value", space.name);
  sizeInput.setAttribute("value", `${space.size}`);
  volumeInput.setAttribute("value", `${space.volume}`);
  if(space.description != null && !descriptionInput.value && !hasLoaded){
    descriptionInput.value = space.description;
  }
  consumablesInput.innerHTML = "";

  if(space.spaceConsumables.length === 0){
    document.querySelector(".custom-table").classList.add("hidden");
  }
  else{
    space.spaceConsumables.map((spaceConsumable) => {
      if (spaceConsumable.state != "deleted") {
        const consumable = consumables.find(
          (c) => c.id === spaceConsumable.consumablesId
        );
        consumablesInput.innerHTML += `<tr id=${spaceConsumable.id}><td class="tw-1">${consumable.name}</td>
          <td class="tw-2">${spaceConsumable.count}</td>
          <td class="tw-3">
          <span class="material-symbols-outlined clickable edit" data-id="${spaceConsumable.id}" name="${consumable.name}" title="Промени">
          edit
          </span>
          <span class="material-symbols-outlined clickable delete" data-id="${spaceConsumable.id}" name="${consumable.name}" title="Премахни">
          delete
          </span>
          </td>
          </tr>`;
      }
    });
  }

  let editButtons = [...document.querySelectorAll(".edit")];
  editButtons.map((button) =>
    button.addEventListener("click", () =>
      EditConsumable(button.getAttribute("data-id"))
    )
  );
  let deleteButtons = [...document.querySelectorAll(".delete")];
  deleteButtons.map((button) =>
    button.addEventListener("click", () =>
      DeleteConsumable(button.getAttribute("data-id"))
    )
  );
}

function SaveEditedRow(id) {
  let editedRow = document.getElementById(id); //query selector doesn't work if the class starts with a number
  space.spaceConsumables = space.spaceConsumables.map((consumable) => {
    if (consumable.id === id) {
      consumable.count = editedRow.querySelector(".edited-count").value;
      consumable.state = "modified";
    }
    return consumable;
  });

  DisplayContent(space);
  // AddCrudButtons method seems to break logic();
}

function EditConsumable(id) {
  let editedRow = document.getElementById(id); //query selector doesn't work if the class starts with a number
  let spaceConsumable = space.spaceConsumables.find(
    (consumable) => consumable.id == id
  );
  const consumable = consumables.find(
    (c) => c.id === spaceConsumable.consumablesId
  );
  editedRow.innerHTML = `<td class="name tw-1">
                <p  class="edited-name edit-input" placeholder="${consumable.name}" value="${consumable.name}">${consumable.name}</p>
            </td>
            <td class="base-unit tw-2">
                <input class="edited-count edit-input" type="number" min="0" step="any" placeholder="${spaceConsumable.count}" value="${spaceConsumable.count}"/>
            </td>
            <td class="tw-3">
                <span class="material-symbols-outlined clickable done-edit" data-id="${spaceConsumable.id}" name="${consumable.name}" title="Запази">
                    done
                </span>
                <span class="material-symbols-outlined clickable cancel" data-id="${spaceConsumable.id}" name="${consumable.name}" title="Отмени">
                    cancel
                </span>
            </td>`;
  document.querySelector(".done-edit").addEventListener("click", () => {
    if (ValidateNumberFields(document.querySelector(".edited-count").value)) {
      SaveEditedRow(id);
    } else {
      displayPrompt('.prompt-save', 'Бройката на консумативите e необходимо да бъде положително число.', false);
    }
  });
  document.querySelector(".cancel").addEventListener("click", () => {
    DisplayContent(space);
    // AddCrudButtons method seems to break logic();
  });
}

function DeleteConsumable(id) {
  let editedRow = document.getElementById(id); //query selector doesn't work if the class starts with a number
  editedRow.remove();
  for (let i = 0; i < space.spaceConsumables.length; i++) {
    if (space.spaceConsumables[i].id === id) {
      if (space.spaceConsumables[i].state === "created") {
        space.spaceConsumables.splice(i, 1);
      } else {
        space.spaceConsumables[i].state = "deleted";
      }
    }
  }
  DisplayContent(space);
  // AddCrudButtons method seems to break logic();
}

function ValidateNumberFields(value) {
  if (value <= 0 || value == "") {
    return false;
  }

  return true;
}

function CheckIfSpaceHasConsumable(consumaleId) {
  for (let i = 0; i < space.spaceConsumables.length; i++) {
    if (
      space.spaceConsumables[i].consumablesId == consumaleId &&
      space.spaceConsumables[i].state !== "deleted"
    ) {
      return true;
    }
  }

  return false;
}

window.addEventListener("load", async () => {
  await GetDetails(space);
  await GetConsumables();

  DisplayContent(space, false);
  // AddCrudButtons method seems to break logic();
  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove("blur");

  document
    .querySelector(".add-new")
    .addEventListener("click", (e) => GenerateNewRow(e));
});

let saveChanges = document.querySelector(".save-changes");
saveChanges.addEventListener("click", (e) => {
  e.preventDefault();
  let officeSize = document.querySelector("#officeSize").value;
  let officeVolume = document.querySelector("#officeVolume").value;
  if (
    !ValidateNumberFields(officeSize) ||
    !ValidateNumberFields(officeVolume)
  ) {
    displayPrompt('.prompt-save', 'Размерите на помещението е необходимо да бъдат положително число.', false);
    return;
  }
  if(+officeSize >= +officeVolume){
      displayPrompt('.prompt-save', 'Площа на залата не може да е по - малка или равнан на обема', false);
      return;
  }
  if (document.querySelector("#officeName").value == "") {
    displayPrompt('.prompt-save', 'Помещението е необходимо да има име.', false);
    return;
  }
  SaveChanges();
});