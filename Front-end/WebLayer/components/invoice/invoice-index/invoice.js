import { Components } from "../../../utilities/Components.js";
import { InvoiceController } from "../../../Controllers/InvoiceController.js";
import { SortTableColumn } from "../../../utilities/TableSorting.js";
import { displayPrompt } from "../../../utilities/Prompt.js";
import { DateBg } from "../../../utilities/DateFormat.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
import { checkForNewEntry } from "../../../utilities/HighlightNewEntry.js";
await checkCookieExists("SMPlace");
Components("invoices");
let invoiceController = new InvoiceController();
let invoices = [];
let showPaidInvoices = false;

window.addEventListener("load", async () => {
  invoices = [...(await invoiceController.GetAllInvoices())];
  let newItem = checkForNewEntry('newItemCreated','createdAt',invoices.filter(inv=>inv.paid===false),'newItemTotal','amount');
  DisplayContent(invoices,newItem);
  AddSorting(invoices);
  AddFilters();

  document.getElementById("clientName").value = "";
  document.getElementById("spaceName").value = "";
  document.getElementById("createdAt").value = "";
  document.getElementById("paid").checked = false;

  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove("blur");
});

function DisplayContent(content,newItem) {
  let tableBody = document.querySelector(".invoices-table-body");
  tableBody.innerHTML = "";

  content
    .filter((invoice) => showPaidInvoices === invoice.paid)
    .map((item) => {
      let createdAt = DateBg(item.createdAt);

      let paidOptions = item.paid
        ? `<span class="material-symbols-outlined option invoice-detail clickable" 
        data-link="../invoice-details/invoice-details.html?id=${item.id}"
        title="Детайли на фактура">
        info
        </span>`
        : `<span class="material-symbols-outlined option invoice-detail clickable" 
        data-link="../invoice-details/invoice-details.html?id=${item.id}"
        title="Детайли на фактура">
        info
        </span>
        <span class="material-symbols-outlined pay-invoice clickable" data-id="${item.id}" title="Маркирай като платена">
        check_circle
        </span>
        <span class="material-symbols-outlined delete-invoice clickable" data-id="${item.id}"
        title="Изтрий фактура">
        delete
        </span>`;

      let itemRow = `<tr class="invoice">
      <td class="tw-1">${item.invoiceNumber}</td>
      <td class="tw-2">${createdAt}</td>
        <td class="tw-3">${item.clientName}</td>
        <td class="tw-4">${item.spaceName}</td>
        <td class="tw-5">${item.amount} лв.</td>
        <td class="tw-6">
        ${paidOptions}
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

  let detailButtons = document.querySelectorAll(".invoice-detail");
  detailButtons.forEach((button) =>
    button.addEventListener("click", () => {
      window.location.href = button.getAttribute("data-link");
    })
  );

  let markAsPaidButtons = document.querySelectorAll(".pay-invoice");
  markAsPaidButtons.forEach((button) =>
    button.addEventListener("click", async () => {
      await MarkInvoiceAsPaid(button.getAttribute("data-id"));
    })
  );

  let deleteButtons = document.querySelectorAll(".delete-invoice");
  deleteButtons.forEach((button) =>
    button.addEventListener("click", async () => {
      await DeleteInvoice(button.getAttribute("data-id"));
    })
  );
}

async function MarkInvoiceAsPaid(invoiceId) {
  let result = await displayPrompt(
    ".prompt-save",
    "Сигурни ли сте, че искате да отбележите фактурата като платена?",
    true
  );

  if (result) {
    await invoiceController.MarkInvoiceAsPaid(invoiceId);
    await displayPrompt(
      ".prompt-save",
      "Успешно отбелязване на фактурата като платена.",
      false
    );
    window.location.href="./invoice.html";
  }
}

async function DeleteInvoice(invoiceId) {
  let result = await displayPrompt(
    ".prompt-save",
    "Сигурни ли сте, че искате да изтриете фактурата?",
    true
  );

  if (result) {
    await invoiceController.DeleteInvoice(invoiceId);
    await displayPrompt(
      ".prompt-save",
      "Фактурата беше изтрита успешно.",
      false
    );
    window.location.reload();
  }
}

function AddSorting(array) {
  let sortInvoiceNumber = document.querySelector(".invoiceNumber-sort");
  let sortSpace = document.querySelector(".spaceName-sort");
  let sortClient = document.querySelector(".clientName-sort");
  let sortAmount = document.querySelector(".amount-sort");
  let sortCreatedAt = document.querySelector(".createdAt-sort");

  sortInvoiceNumber.remove();
  sortSpace.remove();
  sortClient.remove();
  sortAmount.remove();
  sortCreatedAt.remove();

  document.querySelector(
    ".tw-1"
  ).innerHTML += `<span class="material-symbols-outlined invoiceNumber-sort ascending active">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-2"
  ).innerHTML += `<span class="material-symbols-outlined createdAt-sort ascending">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-3"
  ).innerHTML += `<span class="material-symbols-outlined clientName-sort ascending">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-4"
  ).innerHTML += `<span class="material-symbols-outlined spaceName-sort ascending">arrow_drop_down</span>`;
  document.querySelector(
    ".tw-5"
  ).innerHTML += `<span class="material-symbols-outlined amount-sort ascending">arrow_drop_down</span>`;

  sortInvoiceNumber = document.querySelector(".invoiceNumber-sort");
  sortSpace = document.querySelector(".spaceName-sort");
  sortClient = document.querySelector(".clientName-sort");
  sortAmount = document.querySelector(".amount-sort");
  sortCreatedAt = document.querySelector(".createdAt-sort");

  sortInvoiceNumber.addEventListener("click", () => {
    SortTableColumn(array, "invoiceNumber", "alphabetic");
    DisplayContent(array);
  });

  sortCreatedAt.addEventListener("click", () => {
    SortTableColumn(array, "createdAt", "date");
    DisplayContent(array);
  });

  sortSpace.addEventListener("click", () => {
    SortTableColumn(array, "spaceName", "alphabetic");
    DisplayContent(array);
  });

  sortClient.addEventListener("click", () => {
    SortTableColumn(array, "clientName", "alphabetic");
    DisplayContent(array);
  });

  sortAmount.addEventListener("click", () => {
    SortTableColumn(array, "amount", "numeric");
    DisplayContent(array);
  });
}

function AddFilters() {
  document.querySelector(".filter").addEventListener("click", () => {
    FilterInvoices(
      document.getElementById("invoiceNumber").value,
      document.getElementById("clientName").value,
      document.getElementById("spaceName").value,
      document.getElementById("createdAt").value,
      document.getElementById("paid").checked
    );
  });
}

function FilterInvoices(invoiceNumber, clientName, spaceName, createdAt, paid) {
  const date = new Date(createdAt);
  date.setDate(date.getDate());
  showPaidInvoices = paid;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const increasedCreatedAt = `${year}-${month}-${day}`;
  const filteredInvoices = invoices.filter((invoice) => {
    if (
      invoiceNumber &&
      !invoice.invoiceNumber.toLowerCase().includes(invoiceNumber.toLowerCase())
    ) {
      return false;
    }
    if (createdAt && increasedCreatedAt > invoice.createdAt) {
      return false;
    }
    if (
      spaceName &&
      !invoice.spaceName.toLowerCase().includes(spaceName.toLowerCase())
    ) {
      return false;
    }
    if (
      clientName &&
      !invoice.clientName.toLowerCase().includes(clientName.toLowerCase())
    ) {
      return false;
    }
    if (paid != invoice.paid) {
      return false;
    }
    if (createdAt && invoice.createdAt < increasedCreatedAt) {
      return true;
    }
    return true;
  });
  DisplayContent(filteredInvoices);
  AddSorting(filteredInvoices);
}
