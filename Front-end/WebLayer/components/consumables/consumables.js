import { Components } from "../../utilities/Components.js";
import { SortTableColumn } from "../../utilities/TableSorting.js";
import { displayPrompt } from "../../utilities/Prompt.js";
import { ConsumableController } from "../..//Controllers/ConsumableController.js";
import { checkCookieExists } from "../../utilities/checkCookie.js";
await checkCookieExists("SMPlace");
Components("spaces");
let consumableController = new ConsumableController();
let consumables = new Array();
let createdCounter = 1;   
let changesCount = 0;

//Displays content to table
function DisplayContent(consumables)
{
    let consumablesTable=document.querySelector(".consumables");
    consumablesTable.innerHTML="";
    consumables.map(consumable => {
        if(consumable.state!=="deleted"){
        const row = document.createElement('tr');
        row.id = consumable.id;
        row.innerHTML = 
            `<td class="name tw-1">${consumable.name}</td>
            <td class="price tw-2">${consumable.price} лв.</td>
            <td class="base-unit tw-3">${consumable.baseUnit}</td>
            <td class="tw-4">
                <span class="material-symbols-outlined clickable edit" data-id="${consumable.id}" name="${consumable.name}">
                    edit
                </span>
                <span class="material-symbols-outlined clickable delete" data-id="${consumable.id}" name="${consumable.name}">
                    delete
                </span>
            </td>`;
        consumablesTable.appendChild(row);
        };
    });

    if (!document.querySelector("done-edit") && !document.querySelector("done-create") && changesCount!==0) {
    let saveButton = document.querySelector(".save-context");
    saveButton.classList.remove("disabled");
    saveButton.classList.add("hoverable");
    }
    else {
    let saveButton = document.querySelector(".save-context");
    saveButton.classList.add("disabled");
    }
    //Sets up edit and delete logic for all buttons in the table
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
};

//Send changes to backend
async function SaveChanges() {

  displayPrompt('.prompt-save', 'Запази промените?', true).then(async (result) => {
    if(result) {
      let changes = consumables.filter((consumable) => consumable.state !== null);
      if (changes.length === 0) return;
  
      changes.forEach((change) => {
        if (change.state === "created") {
          delete change.id;
        }
      });
      await consumableController.EditMultiple(changes);
      window.location.reload();
    }
  });
  return;
};

//Saves a row that has been edited
function SaveEditedRow(id){
        let editedConsumable=consumables.find(consumable => consumable.id === id);
        let newName=document.querySelector(".edited-name").value;
        let newPrice=document.querySelector(".edited-price").value;
        let newBaseUnit=document.querySelector(".edited-base-unit").value;
        if(newName===editedConsumable.name && newPrice==editedConsumable.price && newBaseUnit===editedConsumable.baseUnit)
        {
            DisplayContent(consumables);
            return;
        };
        editedConsumable.name=newName;
        editedConsumable.price=newPrice;
        editedConsumable.baseUnit=newBaseUnit;
        consumables = consumables.map(consumable => {
            //Checks that a consumable is not created now, so as not so send it with state="modified" to backend
            if (consumable.id === id && consumable.state!=="created") {
                return { ...consumable, state: "modified" };
            } else {
                return consumable;
            }});
        changesCount++;
        DisplayContent(consumables);
};

//Opens a row to editing
function EditConsumable(id) {
  let saveButton = document.querySelector(".save-context");
  saveButton.classList.add("disabled");
  saveButton.classList.remove("hoverable");
  if (document.querySelector(".done-edit") != null || document.querySelector(`.done-create-${createdCounter}`) != null) {
    return;
  }
  let editedRow = document.getElementById(`${id}`);
  let consumable = consumables.find((consumable) => consumable.id === id);
  editedRow.classList.add("edited");
  editedRow.innerHTML = `<td class="name tw-1">
    <input class="edited-name edit-input" placeholder="${consumable.name}" value="${consumable.name}"/>
    </td>
    <td class="price tw-2">
    <input class="edited-price edit-input" placeholder="${consumable.price}" value="${consumable.price}"/>
    </td>
    <td class="base-unit tw-3">
    <input class="edited-base-unit edit-input" placeholder="${consumable.baseUnit}" }" value="${consumable.baseUnit}"/>
    </td>
    <td class="tw-4">
        <span class="material-symbols-outlined clickable done-edit" data-id="${id}" name="${consumable.name}">
            done
        </span>
        <span class="material-symbols-outlined clickable cancel" data-id="${id}" name="${consumable.name}">
            disabled_by_default
        </span>
    </td>`;
  document
    .querySelector(".done-edit")
    .addEventListener("click", () => SaveEditedRow(id));
  document
    .querySelector(".cancel")
    .addEventListener("click", () => DisplayContent(consumables));
};

//Deletes a row and removes consumable from array
function DeleteConsumable(id) {
    const regex = /^new-row-\d+$/;
    if(regex.test(id)){
        document.getElementById(`${id}`).remove();

        if(parseInt(id.slice(id.length-1,id.length))!==createdCounter)
        {
        createdCounter>1 ? createdCounter--   : "";
        changesCount!==0 ? changesCount-- : "";
        };

        consumables = consumables.filter(consumable => consumable.id !== id);
        return DisplayContent(consumables);
    }
    else
    {
        document.getElementById(`${id}`).remove();
        changesCount++;
        consumables = consumables.map((consumable) => {
        if (consumable.id === id) {
        return { ...consumable, state: "deleted" };
        }
        return consumable;
    });
    DisplayContent(consumables);
    }
};

//Adds new consumable to array
function CreateNew(id) {
    if(!document.querySelector(".created-name").value)
    {
        displayPrompt('.prompt-save', 'Името на консуматива е задължително!', false);
        DisplayContent(consumables);
        return;
    }
    let newConsumable = {
        id: `new-row-${id}`,
        name: document.querySelector(".created-name").value,
        price: document.querySelector(".created-price").value,
        baseUnit: document.querySelector(".created-base-unit").value,
        state: "created"
    };
    consumables.push(newConsumable);
    changesCount++;
    createdCounter++;
    DisplayContent(consumables);
};  

//Generates a new row in the table for new consumable
function GenerateNewRow() {
  let saveButton = document.querySelector(".save-context");
  saveButton.classList.add("disabled");
  saveButton.classList.remove("hoverable");
  if (document.querySelector(`.done-create-${createdCounter}`) != null || document.querySelector(".done-edit") != null) {
    return;
  }
  let consumablesTable = document.querySelector(".consumables");
  consumablesTable.innerHTML =
    `<tr id="new-row-${createdCounter}" class="created-row-${createdCounter} edited"><td class="name tw-1">
        <input class="created-name edit-input" placeholder="Консуматив"/>
        </td>
        <td class="price tw-2">
        <input class="created-price edit-input" type="number" placeholder="Цена"/>
        </td>
        <td class="base-unit tw-3">
        <input class="created-base-unit edit-input" placeholder="Мерна единица" }"/>
        </td>
        <td class="tw-4">
            <span class="material-symbols-outlined clickable done-create-${createdCounter}" >
                done
            </span>
            <span class="material-symbols-outlined clickable delete-${createdCounter} data-id="new-row-${createdCounter}"">
                disabled_by_default
            </span>
        </td></tr>` + consumablesTable.innerHTML;
  document
    .querySelector(`.done-create-${createdCounter}`)
    .addEventListener("click", () => CreateNew(createdCounter));
  document
    .querySelector(`.delete-${createdCounter}`)
    .addEventListener("click", () =>
      DeleteConsumable(`new-row-${createdCounter}`)
    );
};

//Sets up logic for awaiting html to fetch data and add event listeners
window.addEventListener("load", async () => {
    consumables = await consumableController.GetAllConsumables();
    DisplayContent(consumables);
    let saveButton = document.querySelector(".save-context");
    saveButton.classList.add("disabled");
    saveButton.classList.remove("hoverable");
    saveButton.addEventListener("click", () => {
    if (saveButton.classList.contains("disabled")) {
        return;
    }
    SaveChanges(consumables);
    });

    let sortNumeric = document.querySelector(".price-sort");
    sortNumeric.addEventListener("click", () => {
    SortTableColumn(consumables, "price", "numeric");
    DisplayContent(consumables);
    });

    let sortAlphabetic = document.querySelector(".name-sort");
    sortAlphabetic.addEventListener("click", () => {
    SortTableColumn(consumables, "name", "alphabetic");
    DisplayContent(consumables);
    });

    document.querySelector(".create-new").addEventListener("click", () => GenerateNewRow());
    //Executed when all functionalities and HTML are loaded
    document.querySelector(".blur").classList.remove("blur");
    document.querySelector(".loader").remove();
});