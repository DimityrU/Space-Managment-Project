import { InvoiceController } from "../../../Controllers/InvoiceController.js";
import {Components} from "../../../utilities/Components.js"
import {GetParameter} from "../../../utilities/GetUrlParam.js"
import {displayPrompt} from "../../../utilities/Prompt.js"
import {DateBg} from "../../../utilities/DateFormat.js"
import { checkCookieExists } from "../../../utilities/checkCookie.js";
await checkCookieExists("SMPlace");
Components("invoices");
let invoiceController = new InvoiceController();
let invoice;
let bookingId;

window.addEventListener("load", async ()=>{
    
    bookingId = GetParameter("id");
    invoice = await invoiceController.GetInvoiceDetails(bookingId);
    invoice.dto.space.spaceConsumables.unshift({consumables:{price:invoice.dto.price,name:"Наем"},count:"1","non-edit":true});

    DisplayContent({...invoice.dto});
    DisplayConsumables({...invoice.dto});
    CalculateTotals({...invoice.dto});

    document.querySelector(".save-invoice").addEventListener("click", async ()=>{
        await SaveInvoice();
    });
    document.querySelector(".loader").remove();
    document.querySelector(".blur").classList.remove('blur');

});


 function DisplayContent(data)
 {
    let invoicePeriod = document.getElementById("invoice-period");
    let invoiceSpace = document.getElementById("invoice-space");
    let invoiceClient = document.getElementById("invoice-clientName");
    let invoiceClientPIN = document.getElementById("invoice-clientPIN");

    invoicePeriod.innerHTML = DateBg(data.startDate) + " - " + DateBg(data.endDate);
    invoiceSpace.innerHTML = data.space.name;
    invoiceClient.innerHTML = data.client.name;
    invoiceClientPIN.innerHTML = data.client.pin;
 };


 function DisplayConsumables(data)
 {
    let table = document.getElementById("invoice-consumables");
    table.innerHTML = "";
    data.space.spaceConsumables.map(consumable=>{
        let row = document.createElement("tr");
        
        let name = document.createElement("td");
        let count = document.createElement("td");
        let price = document.createElement("td");
        let vat = document.createElement("td");
        let total = document.createElement("td");
        let option = document.createElement("td");
        
        if(consumable.count!==0 && !consumable["non-edit"])
        {
            let countInput = document.createElement("input");
            countInput.setAttribute("type","number");
            countInput.setAttribute("value",consumable.count);
            countInput.setAttribute("min","0");
            countInput.classList.add("count-input");
            countInput.addEventListener("change",()=>{
                consumable.count = countInput.value ? countInput.value : 0;
                DisplayConsumables(data);
                CalculateTotals(data);
            });
            count.appendChild(countInput);
        }
        else if(consumable.count===0 && !consumable["non-edit"])
        {
            row.classList.add("removed");
            count.innerHTML = "0";
        }
        else{
            count.innerHTML = consumable.count;
            if(consumable.count===0)
            {
                row.classList.add("removed");
            };
        }

        name.classList.add("tw-1");
        count.classList.add("tw-2");
        price.classList.add("tw-3");
        vat.classList.add("tw-4");
        total.classList.add("tw-5");
        option.classList.add("tw-6");

        name.innerHTML = consumable.consumables.name;
        price.innerHTML =(consumable.consumables.price ? consumable.consumables.price : "-") +" лв.";
        if(consumable.count)
        {
            total.innerHTML =
            ((parseFloat(consumable.consumables.price) * 0.2 + parseFloat(consumable.consumables.price))*parseFloat(consumable.count)).toFixed(2)
            + " лв.";
            vat.innerHTML = (parseFloat(consumable.consumables.price)  * 0.2 * parseFloat(consumable.count)).toFixed(2) + " лв.";
        }
        else
        {
            total.innerHTML = "0 лв.";
            vat.innerHTML =  "0 лв.";
        }

        if(consumable.count!==0)
        {
            option.innerHTML = `<span class="material-symbols-outlined clickable delete"
            title="Премахни консуматива.">
            delete
            </span>`
            option.addEventListener("click",()=>{
                row.classList.add("removed");
                consumable.count = 0;
                DisplayConsumables(data);
                CalculateTotals(data);
            });
        }
        else
        {
            option.innerHTML = `<span class="material-symbols-outlined clickable return"
            title="Добави обратно.">
                undo
            </span>`
            option.addEventListener("click",()=>{
                consumable.count = 1;
                row.classList.remove("removed");
                DisplayConsumables(data);
                CalculateTotals(data);
            });
        }

        row.appendChild(name);
        row.appendChild(count);
        row.appendChild(price);
        row.appendChild(vat);
        row.appendChild(total);
        row.appendChild(option);

        table.appendChild(row);
    });
 };


 function CalculateTotals(data)
 {
    let rent = document.getElementById("invoice-rent");
    let consumableTotal = document.getElementById("invoice-consumable-total");
    let total = document.getElementById("invoice-total");
    let totalVAT = document.getElementById("invoice-total-vat");
    let totalAll = document.getElementById("invoice-total-all");

    let totalRent = data.space.spaceConsumables.find(item=>item.consumables.name==="Наем");
    let totalConsumable = 0;
    let totalNoVAT=0;
    let totalAllPrice=0;    

    data.space.spaceConsumables.map(consumable=>{
        if(consumable.count && consumable.consumables.name!=="Наем")
        {
            totalConsumable += parseFloat(consumable.consumables.price) * parseFloat(consumable.count);
        };
    });
    totalRent = parseFloat(totalRent.consumables.price*totalRent.count);
    totalNoVAT = totalRent + totalConsumable;
    totalAllPrice = totalNoVAT + (totalNoVAT*0.2);

    rent.innerHTML = totalRent.toFixed(2) + " лв.";
    consumableTotal.innerHTML = totalConsumable.toFixed(2) + " лв.";
    total.innerHTML = totalNoVAT.toFixed(2) + " лв.";
    totalVAT.innerHTML = (totalNoVAT*0.2).toFixed(2) + " лв.";
    totalAll.innerHTML = totalAllPrice.toFixed(2) + " лв.";
 };

 async function SaveInvoice()
 {
    if(CheckDate())
    {
        let createdOn = document.getElementById("invoice-created").value;
        let consumables = invoice.dto.space.spaceConsumables.filter((item)=>item.count!==0);
        let flattenedConsumables = consumables.map(consumable => {
            return {count:parseInt(consumable.count),name:consumable.consumables.name,price:consumable.consumables.price};
        });
        let total =  document.getElementById("invoice-total-all").innerHTML;
        let createdInvoice = {
            CreatedAt:createdOn,
            BookingId:bookingId,
            InvoiceConsumables:flattenedConsumables,
            Amount:parseFloat(total),
        };
        await invoiceController.GenerateInvoice(createdInvoice);
        await displayPrompt(".prompt-save", 'Фактурата беше създадена успешно.', false);

        window.location.href = `../invoice-index/invoice.html?newItemCreated=${createdOn}&newItemTotal=${parseFloat(total)}`;
    }
};

function CheckDate()
{
    let createdAt = document.getElementById("invoice-created");
    var createDate = new Date(createdAt.value);
    var startDate = new Date(invoice.dto.startDate);
    if(createDate <= startDate || !createdAt.value)
    {
        displayPrompt('.prompt-save', 'Моля въведете дата на създаването на фактура, която да не е преди начална дата на наема.', false);
        return false;
    }
    else
    {
        return true;
    }
};