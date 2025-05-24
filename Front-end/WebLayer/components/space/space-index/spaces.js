import { Components } from "../../../utilities/Components.js";
import { SortTableColumn } from "../../../utilities/TableSorting.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
import { SpaceController } from "../../../Controllers/SpaceController.js"
import {checkForNewEntry} from "../../../utilities/HighlightNewEntry.js"
await checkCookieExists("SMPlace");

Components("spaces");
const spaceController=new SpaceController();
let spacesArray=new Array();

function DisplayContent(content,newItem){
  let table = document.querySelector(".spaces-table-body");
  table.innerHTML="";
  content.map(item=>{
    let itemRow=`<tr><td class="tw-1">${item.name}</td>
    <td class="tw-2"><p>${item.size} м&sup2;</p></td>
    <td class="tw-3">${item.volume} м&sup3;</td>
    <td class="tw-4">
    <span class="material-symbols-outlined option" 
    data-link="../space-details/space-details.html?id=${item.id}"
    title="Детайли">
    info
    </span>
    <span class="material-symbols-outlined option edit" 
    data-link="../space-edit/space-edit.html?id=${item.id}"
    title="Редактиране">
    edit
    </span>
    </td>
    </tr>`;
    return (table.innerHTML += itemRow);
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

  let options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.addEventListener("click", () => {
      window.location.href = option.getAttribute("data-link");
    });
  });
}

window.addEventListener("load", async () => {

  spacesArray=[...(await spaceController.GetAllSpaces(true))];
  let newItem=checkForNewEntry('newItem','name',spacesArray);
  DisplayContent(spacesArray,newItem);
  AddFilters();
  AddSorting(spacesArray);

  document.getElementById('spaceName').value="";
  document.getElementById('spaceSizeMin').value="";
  document.getElementById('spaceSizeMax').value="";
  document.getElementById('spaceVolumeMin').value="";
  document.getElementById('spaceVolumeMax').value="";

  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove('blur');
});

function AddFilters()
{
    document.querySelector(".filter").addEventListener("click",()=>{
        FilterSpaces(
            document.getElementById('spaceName').value,
            document.getElementById('spaceSizeMin').value,
            document.getElementById('spaceSizeMax').value,
            document.getElementById('spaceVolumeMin').value,
            document.getElementById('spaceVolumeMax').value
        )
    });
};

function FilterSpaces(spaceName, spaceSizeMin,spaceSizeMax, spaceVolumeMin,spaceVolumeMax) {

  let filteredArray = spacesArray.filter(space => {
      if (spaceName && !space.name.toLowerCase().includes(spaceName.toLowerCase())) {
        return false;
      }
      if (spaceSizeMin && space.size < spaceSizeMin) {
        return false;
      }
      if (spaceSizeMax && space.size > spaceSizeMax) {
        return false;
      }
      if (spaceVolumeMin && space.volume < spaceVolumeMin) {
        return false;
      }
      if (spaceVolumeMax && space.volume > spaceVolumeMax) {
        return false;
      }
      return true;
    });
    DisplayContent(filteredArray);
    AddSorting(filteredArray);
};

function AddSorting(array) {

  let sortName = document.querySelector(".name-sort");
  let sortSize = document.querySelector(".size-sort");
  let sortVolume = document.querySelector(".volume-sort");

  sortName.remove();
  sortSize.remove();
  sortVolume.remove();

  document.querySelector(".tw-1").innerHTML+=`<span class="material-symbols-outlined name-sort ascending active">arrow_drop_down</span>`;
  document.querySelector(".tw-2").innerHTML+=`<span class="material-symbols-outlined size-sort ascending">arrow_drop_down</span>`;
  document.querySelector(".tw-3").innerHTML+=`<span class="material-symbols-outlined volume-sort ascending">arrow_drop_down</span>`;

  sortName = document.querySelector(".name-sort");
  sortSize = document.querySelector(".size-sort");
  sortVolume = document.querySelector(".volume-sort");

  sortName.addEventListener("click", sortNameHandler);
  sortSize.addEventListener("click", sortSizeHandler);
  sortVolume.addEventListener("click", sortVolumeHandler);

  function sortNameHandler() {
    SortTableColumn(array, "name", "alphabetic");
    DisplayContent(array);
  };

  function sortSizeHandler() {
    SortTableColumn(array, "size", "numeric");
    DisplayContent(array);
  };
  
  function sortVolumeHandler() {
    SortTableColumn(array, "volume", "numeric");
    DisplayContent(array);
  };
}