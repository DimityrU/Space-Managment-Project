import { Components } from "../../../utilities/Components.js";
import { GetParameter } from "../../../utilities/GetUrlParam.js";
import { DateBg } from "../../../utilities/DateFormat.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import { SpaceController } from "../../../Controllers/SpaceController.js";
import { BookingController } from "../../../Controllers/BookingController.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
let spaceController = new SpaceController();
let bookingController = new BookingController();
Components("book");
await checkCookieExists("SMPlace");

const spaceId = GetParameter("id");
const startDate = GetParameter("sd");
const endDate = GetParameter("ed");
const namePlaceholder = document.querySelector(".details-name");
const sizePlaceholder = document.querySelector(".details-size");
const volumePlaceholder = document.querySelector(".details-volume");
let clientCounter = 1;

const startDatePlaceholder = document.querySelector(".booking-start-date");
const endDatePlaceholder = document.querySelector(".booking-end-date");

startDatePlaceholder.innerText = DateBg(startDate);
endDatePlaceholder.innerText = DateBg(endDate);

async function getSpace() {
  const data  = await spaceController.GetSpace(spaceId);
  namePlaceholder.innerText = data.dto.name;
  sizePlaceholder.innerHTML = `${data.dto.size} м&sup2;`;
  volumePlaceholder.innerHTML = `${data.dto.volume} м&sup3;`;
}

async function getClients() {
  const selector = document.getElementById("client-select");
  let data  = await bookingController.GetBookingInfo();
  const clients = data.clientBooking;
  clients.forEach((client) => {
    let newOption = document.createElement("option");
    newOption.id = `client${clientCounter++}`;
    newOption.value = client.id;
    newOption.textContent = client.name;
    selector.appendChild(newOption);
  });
}

window.addEventListener("load", async () => {
  await getSpace();
  await getClients();
});

const bookingForm = document.querySelector("#create-booking");
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const price = document.querySelector("#booking-price").value;
  const select = document.getElementById("client-select");

  const clientId = select.options[select.selectedIndex].value;

  let newBooking = {
    spaceId: spaceId,
    clientId: clientId,
    price: price,
    startDate: convertToCSharpDateTime(startDate),
    endDate: convertToCSharpDateTime(endDate),
  };

  let response = await bookingController.Book(newBooking);
  if(!response.error.hasError)
  {
    await displayPrompt('.prompt-save', 'Успешно запазване на помещение.', false);
  };
  window.location.href = `../../booking/book-index/booking.html?newItem=${spaceId}`;
});

function convertToCSharpDateTime(dateString) {
  const jsDate = new Date(dateString);
  const formattedDate = jsDate.toISOString();

  return formattedDate;
}

document.querySelector(".back").addEventListener("click", (e) => {
  e.preventDefault();
  window.history.back();
});
