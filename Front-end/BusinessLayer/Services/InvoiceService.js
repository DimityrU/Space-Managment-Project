import { InvoiceRepository } from "../../DataLayer/Repository/InvoiceRepository.js";

export class InvoiceService {
  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async getInvoiceDetails(id) {
    let response = await this.invoiceRepository.getInvoiceDetails(id);
    return response;
  }

  async getCompleteInvoiceDetails(id) {
    let response = await this.invoiceRepository.getCompleteInvoiceDetails(id);
    return response;
  }

  async generateInvoice(invoice) {
    let response = await this.invoiceRepository.generateInvoice(invoice);
    return response;
  }

  async getAllInvoices() {
    let response = await this.invoiceRepository.getAllInvoices();
    return response;
  }

  async DeleteInvoice(id) {
    let response = await this.invoiceRepository.deleteInvoice(id);
    return response;
  }

  async MarkInvoiceAsPaid(id) {
    let response = await this.invoiceRepository.markInvoiceAsPaid(id);
    return response;
  }
}
