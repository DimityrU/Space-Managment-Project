namespace BusinessLayer.Services;

using System;

using AutoMapper;
using Contracts;
using DataLayer.Entities;
using DataLayer.Repository.Interface;
using Interfaces;

using Models;
using Models.InvoiceDTOs;
using Models.InvoiceDTOs.Create;
using Models.InvoiceDTOs.Generate;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IDeletableRepository<Invoice> _invoiceRepositoryGeneric;
    private readonly IMapper _mapper;

    public InvoiceService(IDeletableRepository<Invoice> invoiceRepositoryGeneric, IInvoiceRepository invoiceRepository, IBookingRepository bookingRepository, IMapper mapper)
    {
        _invoiceRepositoryGeneric = invoiceRepositoryGeneric;
        _invoiceRepository = invoiceRepository;
        _bookingRepository = bookingRepository;
        _mapper = mapper;
    }

    public InvoiceService(IInvoiceRepository invoiceRepository, IBookingRepository bookingRepository, IMapper mapper)
    {
        _invoiceRepository = invoiceRepository;
        _bookingRepository = bookingRepository;
        _mapper = mapper;
    }

    public CollectionResponse<InvoiceDisplayDTO> GetAll()
    {
        var response = new CollectionResponse<InvoiceDisplayDTO>();
        response.Data = new List<InvoiceDisplayDTO>();

        var invoices = _invoiceRepository.GetAll();

        if (invoices.Count == 0)
        {
            response.AddError("Възникна проблем при извеждането на фактурите. Моля, опитайте отново.");
            return response;
        }

        foreach (var invoice in invoices)
        {
            response.Data.Add(_mapper.Map<InvoiceDisplayDTO>(invoice));
        }

        return response;
    }

    public SingleResponse<InvoiceInfoDTO> GetInvoiceData(Guid bookingId)
    {
        var response = new SingleResponse<InvoiceInfoDTO>();
        var invoiceData = _bookingRepository.GetById(bookingId);

        if (invoiceData == null)
        {
            response.AddError("Невалидна резервация");
            return response;
        }

        response.DTO = _mapper.Map<InvoiceInfoDTO>(invoiceData);

        return response;
    }

    public async Task<BaseResponse> CreateInvoice(InvoiceDTO invoiceDTO)
    {
        var response = new BaseResponse();

        invoiceDTO.InvoiceNumber = GetInvoiceNumber();

        if (invoiceDTO.InvoiceNumber == null)
        {
            response.AddError("Неуспешно създаване на фактура!");
            return response;
        }

        var invoice = _mapper.Map<Invoice>(invoiceDTO);
        var created = await _invoiceRepository.AddAsync(invoice);

        if (!created)
        {
            response.AddError("Неуспешно създаване на фактура!");
            return response;
        }

        await _invoiceRepository.SaveChangesAsync();

        return response;
    }

    public async Task<BaseResponse> DeleteInvoice(Guid id)
    {
        var response = new BaseResponse();

        try
        {
            var invoice = _invoiceRepositoryGeneric.GetSingle(id);
            if (invoice == null)
            {
                response.AddError("Възникна грешка при достъпване на фактурата.");
                return response;
            }

            if (invoice.Paid)
            {
                response.AddError("Фактурата вече е платена. Не може да бъде изтрита.");
                return response;
            }

            const string fkColumnName = "InvoiceId";
            _invoiceRepositoryGeneric?.DeleteEntriesWithForeignKeys<InvoiceConsumable, Guid>(fkColumnName, invoice.Id);
            _invoiceRepositoryGeneric?.Delete(invoice);
            await _invoiceRepositoryGeneric.SaveChangesAsync();
        }
        catch
        {
            response.AddError("Възникна грешка при триене на фактурaтa.");
            return response;
        }

        return response;
    }

    public async Task<BaseResponse> PayInvoice(Guid invoiceId)
    {
        var response = new BaseResponse();
        var invoice = _invoiceRepository.GetSingle(invoiceId);

        if (invoice == null)
        {
            response.AddError("Невалидна фактура");
            return response;
        }
        else if (invoice.Paid)
        {
            response.AddError("Фактурата вече е платена.");
            return response;
        }

        invoice.Paid = true;

        _invoiceRepository.Update(invoice);

        await _invoiceRepository.SaveChangesAsync();

        return response;
    }

    private string GetInvoiceNumber()
    {
        var invoice = _invoiceRepository.All().OrderByDescending(i => i.InvoiceNumber).FirstOrDefault();
        var lastInvoiceNumber = 1;

        if (invoice == null)
        {
            return "INV-" + lastInvoiceNumber.ToString("D10");
        }

        for (int i = 4; i < invoice.InvoiceNumber.Length; i++)
        {
            if (invoice.InvoiceNumber[i] != '0')
            {
                var invoiceInteger = int.Parse(invoice.InvoiceNumber.Substring(i));
                lastInvoiceNumber += invoiceInteger;
            }
        }

        var formattedNumber = lastInvoiceNumber.ToString("D10");
        var invoiceNumber = "INV-" + formattedNumber;

        return invoiceNumber;
    }

    public SingleResponse<InvoiceDetailsDTO> GetCompleteInvoice(Guid id)
    {
        var response = new SingleResponse<InvoiceDetailsDTO>();
        var entity = _invoiceRepository.GetSingleWithRelated(id);

        if (entity == null)
        {
            response.AddError("Възникна грешка с извеждането на детайлите. Моля, опитайте отново.");
            return response;
        }

        response.DTO = _mapper.Map<InvoiceDetailsDTO>(entity);
        var invoiceConsumables = new List<InvoiceConsumableDTO>();
        foreach (var consumable in entity.InvoiceConsumables)
        {
            invoiceConsumables.Add(_mapper.Map<InvoiceConsumableDTO>(consumable));
        }

        response.DTO.InvoiceConsumables = invoiceConsumables;

        return response;
    }
}