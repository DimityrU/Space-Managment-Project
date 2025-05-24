import { InvoiceService } from "../../BusinessLayer/Services/InvoiceService.js";
import { InvoiceMapper } from "../../BusinessLayer/Mappers/InvoiceMapper.js";
import { displayPrompt } from "../utilities/Prompt.js";

export class InvoiceController {
  constructor() {
    this.invoiceMapper = new InvoiceMapper();
    this.invoiceService = new InvoiceService();
  }

  async GenerateInvoice(invoice) {
    let response = await this.invoiceService.generateInvoice(invoice);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    return response;
  };

  async GetInvoiceDetails(id) {
    let response = await this.invoiceService.getInvoiceDetails(id);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    return response;
  };

  async GetCompleteInvoiceDetails(id) {
    let response = await this.invoiceService.getCompleteInvoiceDetails(id);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    return response;
  };

  async GetAllInvoices() {
    let response = await this.invoiceService.getAllInvoices();
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    let invoices = response.data.map((invoiceData) =>
      this.invoiceMapper.MapToInvoice(invoiceData)
    );
    return invoices;
  };

  async DeleteInvoice(id) {
    let response = await this.invoiceService.DeleteInvoice(id);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }

    return "Фактурата бе успешно изтрита.";
  };

  async MarkInvoiceAsPaid(id) {
    let response = await this.invoiceService.MarkInvoiceAsPaid(id);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save",response.error.errorMessage, false);
      return;
    }
    return "Фактурата бе успешно маркирана като платена.";
  };
}
