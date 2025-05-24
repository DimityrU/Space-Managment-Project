import { Components } from "../../../utilities/Components.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import { BookingController } from "../../../Controllers/BookingController.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
let bookingController = new BookingController();
Components("book");
await checkCookieExists("SMPlace");

let data = { booking: [] };
window.addEventListener("load", async () => {
  data.booking = await bookingController.GetAll();

  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove('blur');
});

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", async () => {
  let startDate = document.querySelector("#start-date").value;
  let endDate = document.querySelector("#end-date").value;
  let minSize = document.querySelector("#min-size").value;
  let maxSize = document.querySelector("#max-size").value;
  let minVolume = document.querySelector("#min-volume").value;
  let maxVolume = document.querySelector("#max-volume").value;

  let date = new Date();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let year = date.getFullYear();
  let newDate = `${year}-${month.slice(-2)}-${day}`;

  let filter = {
    startDate: startDate,
    endDate: endDate,
    minSize: minSize,
    maxSize: maxSize,
    minVolume: minVolume,
    maxVolume: maxVolume,
  };

  if (!isValidInput(filter, newDate)) {
    return;
  }

  let spaces = filterData(data.booking, filter);

  if (spaces.length === 0) {
    displayPrompt('.prompt-save', 'Няма помещения отговарящи на желаните условия.', false);
  } else {
    let tableBody = document.querySelector(".spaces-table-body");
    tableBody.innerHTML = "";
    spaces.map((space) => addTableData(tableBody, space, filter));
    document.getElementById("spaces-table").style.display = "table";
    document.querySelectorAll(".book").forEach((button) => {button.addEventListener("click", () => {
      window.location.href = button.dataset.link;
    })});
    document.querySelectorAll(".details").forEach((button) => {button.addEventListener("click", () => {
      window.location.href = button.dataset.link;
    })});
  }
});

function addTableData(tableBody, space, filter) {
  let spaceRow = `<tr><td class="tw-1">${space.name}</td>
  <td class="tw-2">${space.size} м&sup2;</td>
  <td class="tw-3">${space.volume} м&sup3;</td>
  <td class="tw-4">
    <span class="material-symbols-outlined option details" 
    data-link="../../space/space-details/space-details.html?id=${space.id}"
    title="Детайли">
    info
    </span>
    <span id="book-button" class="material-symbols-outlined option book" 
    data-link="../book-create/book-create.html?id=${space.id}&sd=${filter.startDate}&ed=${filter.endDate}"
    title="Резервиране">
    book
    </span>
  </td>
  </tr>`;
  return (tableBody.innerHTML += spaceRow);
}

function filterData(data = [], filter) {
  let displayData = data
    .filter((space) => filter.minSize === "" || space.size >= filter.minSize)
    .filter((space) => filter.maxSize === "" || space.size <= filter.maxSize)
    .filter(
      (space) => filter.minVolume === "" || space.volume >= filter.minVolume
    )
    .filter(
      (space) => filter.maxVolume === "" || space.volume <= filter.maxVolume
    )
    .filter((space) => {
      if (space.bookings.length > 0) {
        for (let i = 0; i < space.bookings.length; i++) {
          const booking = space.bookings[i];
          if (
            (Date.parse(filter.startDate) < Date.parse(booking.startDate) &&
              Date.parse(filter.endDate) >= Date.parse(booking.startDate)) ||
            (Date.parse(filter.startDate) >= Date.parse(booking.startDate) &&
              Date.parse(filter.endDate) <= Date.parse(booking.endDate)) ||
            (Date.parse(filter.startDate) >= Date.parse(booking.startDate) &&
              Date.parse(filter.startDate) <= Date.parse(booking.endDate))
          ) {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    });
  return displayData;
}

function isValidInput(filter, newDate) {
  if (filter.startDate < newDate || filter.endDate <= newDate) {
    displayPrompt('.prompt-save', 'Моля въведете бъдещи дати!', false);
    return false;
  } else if (filter.startDate > filter.endDate) {
    displayPrompt('.prompt-save', 'Крайната дата трябва да е след началната.', false);
    return false;
  }

  if (filter.minVolume != "" && filter.minSize >= filter.minVolume) {
    displayPrompt('.prompt-save', 'Размерът на залата трябва да е по-малък от обема ѝ.', false);
    return false;
  }
  if (filter.minSize < 0 || filter.minVolume < 0) {
    displayPrompt('.prompt-save', 'Размерите трябва да са по-големи от 0.', false);
    return false;
  }
  return true;
}

document.querySelector(".back").addEventListener("click", () => {
  window.history.back();
});
