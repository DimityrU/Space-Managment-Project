import { InvoiceController } from "../../../Controllers/InvoiceController.js";
import { Components } from "../../../utilities/Components.js";
import { GetParameter } from "../../../utilities/GetUrlParam.js";
import { DateBg } from "../../../utilities/DateFormat.js";
import { checkCookieExists } from "../../../utilities/checkCookie.js";
const invoiceController = new InvoiceController();
const invoiceId = GetParameter("id");

await checkCookieExists("SMPlace");
Components("invoices");

function DisplayContent(invoice) {
  const invoiceNumberPlaceholder = document.getElementById("invoice-number");
  const createdOnPlaceholder = document.getElementById("invoice-created");
  const periodPlaceholder = document.getElementById("invoice-period");
  const spaceNamePlaceholder = document.getElementById("invoice-space");
  const clientNamePlaceholder = document.getElementById("client-name");
  const clientPinPlaceholder = document.getElementById("invoice-clientPIN");
  const consumablesTable = document.getElementById("invoice-consumables");

  invoiceNumberPlaceholder.innerText = invoice.invoiceNumber;
  createdOnPlaceholder.innerText = DateBg(invoice.createdAt);
  periodPlaceholder.innerText =
    DateBg(invoice.bookingStartDate) + " - " + DateBg(invoice.bookingEndDate);
  spaceNamePlaceholder.innerText = invoice.spaceName;
  clientNamePlaceholder.innerText = invoice.clientName;
  clientPinPlaceholder.innerText = invoice.clientPin;

  invoice.invoiceConsumables.forEach((consumable) => {
    let row = document.createElement("tr");

    let name = document.createElement("td");
    let count = document.createElement("td");
    let price = document.createElement("td");
    let vat = document.createElement("td");
    let total = document.createElement("td");

    name.classList.add("tw-1");
    count.classList.add("tw-2");
    price.classList.add("tw-3");
    vat.classList.add("tw-4");
    total.classList.add("tw-5");

    name.innerHTML = consumable.name;
    count.innerHTML = consumable.count;
    price.innerHTML = consumable.price.toFixed(2) + " " + "лв.";
    vat.innerHTML =
      (parseFloat(consumable.price) * 0.2 * consumable.count).toFixed(2) +
      " " +
      "лв.";
    total.innerHTML =
      (
        (consumable.price + parseFloat(consumable.price) * 0.2) *
        consumable.count
      ).toFixed(2) +
      " " +
      "лв.";

    row.appendChild(name);
    row.appendChild(count);
    row.appendChild(price);
    row.appendChild(vat);
    row.appendChild(total);

    consumablesTable.appendChild(row);
  });
}

window.addEventListener("load", async () => {
  let response = await invoiceController.GetCompleteInvoiceDetails(invoiceId);
  let invoice = response.dto;
  DisplayContent(invoice);
  CalculateTotals(invoice.invoiceConsumables);
  document.querySelector(".loader").remove();
  document.querySelector(".blur").classList.remove("blur");
  document.querySelector(".create-invoice").addEventListener("click",()=>createPDFfromHTML(invoice));
});

function createPDFfromHTML(invoice) {
  var HTML_Width = document.querySelector(".invoice-container").offsetWidth;
  var HTML_Height = document.querySelector(".invoice-container").offsetHeight;
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + top_left_margin * 2;
  var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  var options = {
    scale: 3
  };

  html2canvas(document.querySelector(".invoice"),options).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      "JPEG",
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height
    );
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(
        imgData,
        "JPEG",
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height
      );
    }
    pdf.save(`Фактура-${invoice.invoiceNumber}.pdf`);
  });
}

function CalculateTotals(consumables) {
  let rent = document.getElementById("invoice-rent");
  let consumableTotal = document.getElementById("invoice-consumable-total");
  let total = document.getElementById("invoice-total");
  let totalVAT = document.getElementById("invoice-total-vat");
  let totalAll = document.getElementById("invoice-total-all");

  let totalRent = consumables.find((item) => item.name.includes("Наем"));
  let totalConsumable = 0;
  let totalNoVAT = 0;
  let totalAllPrice = 0;

  consumables.map((consumable) => {
    if (consumable.count && !consumable.name.includes("Наем")) {
      totalConsumable +=
        parseFloat(consumable.price) * parseFloat(consumable.count);
    }
  });

  totalRent =
    totalRent === undefined ? 0 : parseFloat(totalRent.price * totalRent.count);
  totalNoVAT = totalRent + totalConsumable;
  totalAllPrice = totalNoVAT + totalNoVAT * 0.2;

  rent.innerHTML = totalRent.toFixed(2) + " лв.";
  consumableTotal.innerHTML = totalConsumable.toFixed(2) + " лв.";
  total.innerHTML = totalNoVAT.toFixed(2) + " лв.";
  totalVAT.innerHTML = (totalNoVAT * 0.2).toFixed(2) + " лв.";
  totalAll.innerHTML = totalAllPrice.toFixed(2) + " лв.";
}
