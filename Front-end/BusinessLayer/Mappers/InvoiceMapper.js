import { Invoice } from "../Models/Invoice.js";

export class InvoiceMapper {
  MapToInvoice(data) {
    let invoice = new Invoice();
    invoice.id = data.id;
    invoice.invoiceNumber = data.invoiceNumber;
    invoice.createdAt = data.createdAt;
    invoice.amount = data.amount;
    invoice.paid = data.paid;
    invoice.spaceName = data.spaceName;
    invoice.clientName = data.clientName;

    return invoice;
  }
}
