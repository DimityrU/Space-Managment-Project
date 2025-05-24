import { BaseResponse } from "../../BusinessLayer/Contracts/BaseResponse.js";
import { displayPrompt } from "../../WebLayer/utilities/Prompt.js";

export class InvoiceRepository {

  async generateInvoice(invoice) {
    let response = new BaseResponse();
    try {
      let data = await fetch(
        "https://localhost:7286/api/invoice/create-invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoice),
        }
      );
      response = await data.json();
    } 
    catch (error) {
      response.addError("Имаше проблем със създаването на фактура. Моля опитайте отново.");
    };
    return response;
  };

  async getCompleteInvoiceDetails(id) {
    let response = new BaseResponse();
    try {
      let data = await fetch(`https://localhost:7286/api/invoice/get-invoice/${id}`);
      response = await data.json();
    } 
    catch (error) {
      response.addError(
        "Възникна грешка при извеждане на информация за фактурата. Моля, опитайте отново."
      );
    };
    return response;
  };

  async getInvoiceDetails(id)
  {
    let response = new BaseResponse();
    try {
      let data  = await fetch(`https://localhost:7286/api/invoice/generate-invoice/${id}`);
      response = await data.json();  
    } catch (error) {
      response.addError("Възникна грешка при извеждане на информация за фактурата. Моля, опитайте отново.");
    };
    return response;
  };

  async getAllInvoices() {
    let response = new BaseResponse();
    try {
      let data = await fetch("https://localhost:7286/api/invoice/all");
      response = await data.json();
    } 
    catch (error) {
      response.addError("Имаше проблем с извеждането на фактурите. Моля опитайте отново.");
    };
    return response;
  };

  async deleteInvoice(id) {
    let response = new BaseResponse();
    try {
      let data = await fetch(`https://localhost:7286/api/invoice/delete/${id}`,{
          method: "Delete",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify(id),
      });
      response = await data.json();
    } 
    catch (error) {
      response.addError("Възникна грешка при триенето на фактурата. Моля опитайте отново!");
    };
    return response;
  }

  async markInvoiceAsPaid(id) {
    let response = new BaseResponse();
    try {
      let data = await fetch(`https://localhost:7286/api/invoice/pay/${id}`,
      {
        method: "PATCH",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(id),
      });
      response = await data.json();
        } 
        catch (error) {
          response.addError("Възникна грешка при  отбелязването на фактурата като платена. Моля опитайте отново!");
        };
        return response;
  };
}
