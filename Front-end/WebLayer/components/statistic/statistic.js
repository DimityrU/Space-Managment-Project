import {Components} from "../../utilities/Components.js";
import {GetParameter} from "../../utilities/GetUrlParam.js";
import { SortTableColumn } from "../../utilities/TableSorting.js";
import { DateBg } from "../../utilities/DateFormat.js";
import { SpaceController } from "../../Controllers/SpaceController.js";
import { checkCookieExists } from "../../utilities/checkCookie.js";
await checkCookieExists("SMPlace");
Components("statistic");
const spaceController = new SpaceController();
const spaceId = GetParameter("id");

function DisplayContent(space)
{
  document.querySelector(".details-bookings") ? document.querySelector(".details-bookings").innerHTML = "" : "";
  document.querySelector(".details-consumables") ? document.querySelector(".details-consumables").innerHTML = "" : "";


  const namePlaceholder = document.querySelector(".details-name");
  const sizePlaceholder = document.querySelector(".details-size");
  const volumePlaceholder = document.querySelector(".details-volume");
  const descriptionPlaceholder = document.querySelector(".details-description");
  const consumablesPlaceholder = document.querySelector(".details-consumables");
  const bookingsPlaceholder = document.querySelector(".details-bookings");

  if(!space.bookings.length){
    document.querySelector(".bookings").remove();
  }
  if(!space.spaceConsumables){
    document.querySelector(".consumables").remove();
  }

  namePlaceholder.innerText = space.name;
  sizePlaceholder.innerHTML = `${space.size} м&sup2;`;
  volumePlaceholder.innerHTML = `${space.volume} м&sup3;`;
  if(document.querySelector(".description")){
    space.description ? descriptionPlaceholder.innerText = space.description : document.querySelector(".description").remove();
  }
  if(space.spaceConsumables.length === 0)
  {
    document.querySelector(".consumables")?document.querySelector(".consumables").remove():"";
  }
  else
  {
    space.spaceConsumables.map(spaceConsumables=>{
      consumablesPlaceholder.innerHTML+=
      `<tr>
        <td>${spaceConsumables.consumables.name}</td>
        <td>${spaceConsumables.count}</td>
      </tr>`
    });   
  }
  if(space.bookings.length!==0)
  {
    space.bookings.map(booking=>{
      bookingsPlaceholder.innerHTML+=
      `<tr>
        <td>${DateBg(booking.startDate)}</td>
        <td>${DateBg(booking.endDate)}</td>
        <td>${booking.price} лв.</td>
        <td>${booking.clientName}</td>
      </tr>`
    });
  }
}

window.addEventListener('load',async ()=>
{
    document.querySelector(".loader").remove();
    document.querySelector(".blur").classList.remove('blur');
    Years();
    let response = await spaceController.GetSpace(spaceId);
    let space = response.dto;
    DisplayContent(space);
    if(space.bookings.length !== 0){
    AddSorting(space);
    }

});

document.querySelector('.back').addEventListener('click', ()=>
{
  window.history.back();
})


function AddSorting(array) {

  let sortStartDate = document.querySelector(".startDate-sort");
  let sortEndDate = document.querySelector(".endDate-sort");
  let sortPrice = document.querySelector(".price-sort");
  let sortName = document.querySelector(".clientName-sort");

  sortStartDate.remove();
  sortEndDate.remove();
  sortPrice.remove();
  sortName.remove();

  document.querySelector(".tb-sd").innerHTML+=`<span class="material-symbols-outlined startDate-sort ascending active">arrow_drop_down</span>`;
  document.querySelector(".tb-ed").innerHTML+=`<span class="material-symbols-outlined endDate-sort ascending">arrow_drop_down</span>`;
  document.querySelector(".tb-p").innerHTML+=`<span class="material-symbols-outlined price-sort ascending">arrow_drop_down</span>`;
  document.querySelector(".tb-c").innerHTML+=`<span class="material-symbols-outlined clientName-sort ascending">arrow_drop_down</span>`;

  sortStartDate = document.querySelector(".startDate-sort");
  sortEndDate = document.querySelector(".endDate-sort");
  sortPrice = document.querySelector(".price-sort");
  sortName = document.querySelector(".clientName-sort");

  sortStartDate.addEventListener("click", sortStartDateHandler);
  sortEndDate.addEventListener("click", sortEndDateHandler);
  sortPrice.addEventListener("click", sortPriceHandler);
  sortName.addEventListener("click", sortNameHandler);

  function sortStartDateHandler() {
    SortTableColumn(array.bookings, "startDate", "date");
    DisplayContent(array);
  };

  function sortEndDateHandler() {
    SortTableColumn(array.bookings, "endDate", "date");
    DisplayContent(array);
  };
  
  function sortPriceHandler() {
    SortTableColumn(array.bookings, "price", "numeric");
    DisplayContent(array);
  };

  function sortNameHandler() {
    SortTableColumn(array.bookings, "clientName", "alphabetic");
    DisplayContent(array);
  };
}

function Years() {

    const startYear = 1970;
    const endYear = new Date().getFullYear();
    const yearSelect = document.getElementById('year-select');

    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}