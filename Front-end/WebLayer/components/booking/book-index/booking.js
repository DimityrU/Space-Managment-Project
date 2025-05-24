import {Components} from "../../../utilities/Components.js";
import {BookingController} from "../../../Controllers/BookingController.js";
import {SortTableColumn} from "../../../utilities/TableSorting.js";
import {displayPrompt} from "../../../utilities/Prompt.js";
import {DateBg} from "../../../utilities/DateFormat.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
import {checkForNewEntry} from "../../../utilities/HighlightNewEntry.js";
await checkCookieExists("SMPlace");
Components("book");
let bookingController = new BookingController();
let bookings = [];

window.addEventListener("load", async () => 
{
    bookings = [...await bookingController.GetAllBookings()];
    let newItem = checkForNewEntry('newItem','spaceId',bookings);
    DisplayContent(bookings,newItem);
    AddSorting(bookings);
    AddFilters();

    document.getElementById('startDate').value="";
    document.getElementById('endDate').value="";
    document.getElementById('spaceName').value="";
    document.getElementById('clientName').value="";

    document.querySelector(".loader").remove();
    document.querySelector(".blur").classList.remove('blur');
});

function DisplayContent(content,newItem) 
{
    let tableBody = document.querySelector(".bookings-table-body");
    tableBody.innerHTML = "";

    content.map(item => {
      let startDate = DateBg(item.startDate);
      let endDate = DateBg(item.endDate);
      let itemRow = `<tr>
        <td class="tw-1">${item.spaceName}</td>
        <td class="tw-2">${item.clientName}</td>
        <td class="tw-3">${startDate}</td>
        <td class="tw-4">${endDate}</td>
        <td class="tw-5">${item.price} лв.</td>
        <td class="tw-6">
        <span class="material-symbols-outlined create-invoice clickable generate" data-link="../../invoice/invoice-create/invoice-generate.html?id=${item.id}"
        title="Създай фактура за периода.">
        edit_document
        </span>
        <span class="material-symbols-outlined delete-booking clickable" data-link="${item.id}"
        title="Изтрий историята за резервацията.">
        delete
        </span>
        </td>
        </tr>`;
        
      return tableBody.innerHTML += itemRow;
    });
    
    if(newItem)
    {
      var table = document.querySelector(".custom-table");
      var firstRow = table.rows[1];
      firstRow.classList.add("highlight");
      firstRow.classList.add("new-item");
    
      setTimeout(() => {
        firstRow.classList.remove("highlight");
      }, 2000);
    };

    document.querySelectorAll(".generate").forEach((button) => {
      button.addEventListener("click",()=>{
        window.location.href=button.dataset.link;
      });
    });
    document.querySelectorAll(".delete-booking").forEach((button) => {
      button.addEventListener("click",async ()=>{
        await DeleteBooking(button.dataset.link);
      });
    });
}

function AddSorting(array)
{
  let sortSpace=document.querySelector(".spaceName-sort");
  let sortClient=document.querySelector(".clientName-sort");
  let sortPrice=document.querySelector(".price-sort");
  let sortStartDate=document.querySelector(".startDate-sort");
  let sortEndDate=document.querySelector(".endDate-sort");

  sortSpace.remove();
  sortClient.remove();
  sortPrice.remove();
  sortStartDate.remove();
  sortEndDate.remove();

  document.querySelector(".tw-1").innerHTML+=`<span class="material-symbols-outlined spaceName-sort ascending active">arrow_drop_down</span>`;
  document.querySelector(".tw-2").innerHTML+=`<span class="material-symbols-outlined clientName-sort ascending">arrow_drop_down</span>`;
  document.querySelector(".tw-3").innerHTML+=`<span class="material-symbols-outlined startDate-sort ascending">arrow_drop_down</span>`;
  document.querySelector(".tw-4").innerHTML+=`<span class="material-symbols-outlined endDate-sort ascending">arrow_drop_down</span>`;
  document.querySelector(".tw-5").innerHTML+=`<span class="material-symbols-outlined price-sort ascending">arrow_drop_down</span>`;

  sortSpace=document.querySelector(".spaceName-sort");
  sortClient=document.querySelector(".clientName-sort");
  sortPrice=document.querySelector(".price-sort");
  sortStartDate=document.querySelector(".startDate-sort");
  sortEndDate=document.querySelector(".endDate-sort");

  sortSpace.addEventListener("click",()=>{
      SortTableColumn(array,"spaceName","alphabetic");
      DisplayContent(array);
  });

  sortClient.addEventListener("click",()=>{
      SortTableColumn(array,"clientName","alphabetic");
      DisplayContent(array);
  });
    
  sortPrice.addEventListener("click",()=>{
      SortTableColumn(array,"price","numeric");
      DisplayContent(array);
  });
  
  sortStartDate.addEventListener("click",()=>{
      SortTableColumn(array,"startDate","date");
      DisplayContent(array);
  });

  sortEndDate.addEventListener("click",()=>{
      SortTableColumn(array,"endDate","date");
      DisplayContent(array);
  });
}

function AddFilters()
{
    document.querySelector(".filter").addEventListener("click",()=>{
        FilterBookings(
            document.getElementById('startDate').value,
            document.getElementById('endDate').value,
            document.getElementById('spaceName').value,
            document.getElementById('clientName').value
        )
    });
}

function FilterBookings(startDate, endDate, spaceName, clientName) {
  const date = new Date(endDate);
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const increasedEndDate = `${year}-${month}-${day}`;
  const filteredBookings = bookings.filter(booking => {
      if (startDate && booking.startDate < startDate) {
        return false;
      }
      if (endDate && booking.endDate > increasedEndDate) {
        return false;
      }
      if (spaceName && !booking.spaceName.toLowerCase().includes(spaceName.toLowerCase())) {
        return false;
      }
      if (clientName && !booking.clientName.toLowerCase().includes(clientName.toLowerCase())) {
        return false;
      }
      if(endDate && booking.endDate < increasedEndDate){
        return true;
      }
      return true;
    });
    DisplayContent(filteredBookings);
    AddSorting(filteredBookings);
}

async function DeleteBooking(id)
{
  let result = await displayPrompt('.prompt-save', 'Искате ли да изтриите резервацията?', true);

    if(result) {
      await bookingController.DeleteBooking(id);
      window.location.href = "./booking.html";
    }
}