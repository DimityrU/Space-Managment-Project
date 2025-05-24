import { Components } from "../../../utilities/Components.js";
import { SpaceController } from "../../../Controllers/SpaceController.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import {ConsumableController} from "../../../Controllers/ConsumableController.js"
import { checkCookieExists } from "../../../utilities/checkCookie.js";

await checkCookieExists("SMPlace");
Components("spaces");

const spaceController = new SpaceController();
const consumableController = new ConsumableController();

let consumables = [];
let consumableCounter = 0;

let newOfficeForm = document.querySelector("#newOfficeForm");
newOfficeForm.setAttribute("novalidate", "true");

window.addEventListener("load", async () => {
  const data = await GetConsumables();
  if (data) {
    consumables = [...data.consumables];
    consumables = ["missingConsumable"].concat(consumables);
  } else {
    displayPrompt('.prompt-save', 'Няма налични консумативи.', false);
  }

  document.querySelector(".removable").remove();
  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove('blur');
  let addConsumableButton = document.querySelector("#addConsumable");
  addConsumableButton.addEventListener("click", () => AddConsumableToForm());
  AddConsumableToForm();
});

newOfficeForm.addEventListener("submit", async function (e) {
  newOfficeForm.classList.add("disable-typing");
  e.preventDefault();
  const { officeName, officeSize, officeVolume } =await GetOfficeData();
  
  if (!officeName || !officeSize || !officeVolume) return;
  
  if(+officeSize >= +officeVolume){
    displayPrompt('.prompt-save', 'Площа на залата не може да е по - малка или равнан на обема', false);
    return;
  }

  let selectedConsumables = [];
  let invalidConsumableIds = [];
  let consumableNames = [];
  let incorrectConsumablesCount;
  let isValid = true;
  Array.from(document.getElementById("extraConsumables").children).forEach(
    (element) => {
      const childIndex = element.id.substring("consumable-container".length);
      const consumableDiv = document.getElementById(`consumable${childIndex}`);

      const consumableName = consumableDiv.selectedOptions[0].text;
      if (consumableNames.includes(consumableName) && consumableName != "") {
        displayPrompt('.prompt-save', `Вече сте избрали консуматив "${consumableName}".`, false);
        isValid = false;
        return;
      }
      consumableNames.push(consumableName);

      const concumablesCount = document.getElementById(`count${childIndex}`)
        .value
        ? document.getElementById(`count${childIndex}`).value
        : 0;

      if (consumableDiv.value === "undefined") {
        invalidConsumableIds.push(consumableDiv.value);
      } else if (concumablesCount <= 0) {
        incorrectConsumablesCount = true;
        return;
      } else {
        selectedConsumables.push({
          ConsumablesId: consumableDiv.value,
          Count: concumablesCount,
        });
      }
    }
  );
  if (!isValid) {
    return;
  }

  if (invalidConsumableIds.length > 0) {
    displayPrompt('.prompt-save', 'Моля, въведете консуматив или изтрийте празните полета.', false);
    return;
  }

  if (incorrectConsumablesCount) {
    displayPrompt('.prompt-save', 'Броят на коснумативите не е валиден', false);
    return;
  }

  let prompt = document.querySelector(".prompt-save");
  prompt.innerHTML = `<p>Запази промените?</p>
    <button class="yes btn-custom hoverable">Да</button>
    <button class="no  btn-custom hoverable">Не</button>`;

  document.querySelector(".yes").addEventListener("click", async () =>{
    const officeDescription =
    document.querySelector("#officeDescription").value || null;

    let newOffice = {
      name: officeName,
      size: officeSize,
      volume: officeVolume,
      description: officeDescription,
      spaceConsumables: selectedConsumables,
    };

    let createdSpace = await  spaceController.CreateSpace(newOffice);
    
    if(createdSpace)
    window.location.href = `/WebLayer/components/space/space-index/spaces.html?newItem=${officeName}`;
    else
    window.location.href ="/WebLayer/components/space/space-index/spaces.html";
  });

  document.querySelector(".no").addEventListener("click", () => {
    prompt.style.display = "none";
    prompt.innerHTML = "";
  });

  prompt.style.display = "block";
  return;
  
});

function CreateConsumableDiv() {
  let newConsumableField = document.createElement("div");
  newConsumableField.classList.add("input-field", "first-element");

  let newLabel = document.createElement("label");
  newLabel.setAttribute("for", `consumable${consumableCounter}`);
  newLabel.classList.add("label-text");
  newLabel.innerText = `Консуматив:`;
  newConsumableField.appendChild(newLabel);

  // Add consumable drop-down menu
  let newSelect = document.createElement("select");
  newSelect.id = `consumable${consumableCounter}`;
  newSelect.name = `consumable${consumableCounter}`;
  newSelect.classList.add("consumable","custom-input");
  newConsumableField.appendChild(newSelect);

  consumables.forEach((consumable) => {
    let option = document.createElement("option");
    option.value = consumable.id;
    option.textContent = consumable.name;
    newSelect.appendChild(option);
  });

  return newConsumableField;
};

function CreateConsumableCountDiv() {
  let newCountField = document.createElement("div");
  newCountField.classList.add("input-field");
  newCountField.classList.add("second-element");

  let newCountLabel = document.createElement("label");
  newCountLabel.setAttribute("for", `count${consumableCounter}`);
  newCountLabel.classList.add("label-text");
  newCountLabel.innerText = `Брой:`;

  let newCountInput = document.createElement("input");
  newCountInput.type = "number";
  newCountInput.min = "0";
  newCountInput.id = `count${consumableCounter}`;
  newCountInput.name = `count${consumableCounter}`;
  newCountInput.classList.add("custom-input");  

  newCountField.appendChild(newCountLabel);
  newCountField.appendChild(newCountInput);

  return newCountField;
};

function CreateRemoveConsumableButton(newConsumableContainer) {
  let newRemoveButton = document.createElement("span");
  newRemoveButton.setAttribute("id", `remove${consumableCounter}`);
  newRemoveButton.classList.add("material-symbols-outlined");
  newRemoveButton.classList.add("third-element");
  newRemoveButton.innerHTML = `disabled_by_default`;
  newRemoveButton.addEventListener("click", () => {
    document.getElementById(newConsumableContainer.id).remove();
  });

  return newRemoveButton;
};

function AddConsumableToForm() {
  let newConsumableContainer = document.createElement("div");
  newConsumableContainer.className = "flex-row";
  newConsumableContainer.id = `consumable-container${consumableCounter}`;

  newConsumableContainer.appendChild(CreateConsumableDiv());
  newConsumableContainer.appendChild(CreateConsumableCountDiv());
  newConsumableContainer.appendChild(
    CreateRemoveConsumableButton(newConsumableContainer)
  );

  let extraConsumablesDiv = document.querySelector("#extraConsumables");
  extraConsumablesDiv.appendChild(newConsumableContainer);

  consumableCounter++;
};

async function GetConsumables() {
  let data = { consumables: [] };
  data.consumables = await consumableController.GetAllConsumables();
  return data;
};

async function GetOfficeData() {
  const officeName = document.querySelector("#officeName").value;
  if (officeName === "" || officeName.length < 3) {
    await displayPrompt('.prompt-save', 'Моля, въведете минимум 3 символа за наименование на помещение.', false);
  }

  const officeSize = document.querySelector("#officeSize").value;
  if (officeSize === "" || isNaN(officeSize) || officeSize < 0) {
    await displayPrompt('.prompt-save', 'Моля, въведете валидно число за размер.', false);
  }

  const officeVolume = document.querySelector("#officeVolume").value;
  if (officeVolume === "" || isNaN(officeVolume) || officeVolume < 0) {
    await displayPrompt('.prompt-save', 'Моля, въведете валидно число за обем.', false);
  }

  return { officeName, officeSize, officeVolume };
};
