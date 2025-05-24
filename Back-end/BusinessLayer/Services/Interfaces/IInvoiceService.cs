namespace BusinessLayer.Services.Interfaces;

using Contracts;
using Models.InvoiceDTOs.Create;
using Models.InvoiceDTOs;
using BusinessLayer.Models.InvoiceDTOs.Generate;
using BusinessLayer.Models;

public interface IInvoiceService
{
    public CollectionResponse<InvoiceDisplayDTO> GetAll();

    public SingleResponse<InvoiceInfoDTO> GetInvoiceData(Guid bookingId);

    public Task<BaseResponse> CreateInvoice(InvoiceDTO invoice);

    public Task<BaseResponse> DeleteInvoice(Guid id);

    public Task<BaseResponse> PayInvoice(Guid invoiceId);

    public SingleResponse<InvoiceDetailsDTO> GetCompleteInvoice(Guid id);
}
