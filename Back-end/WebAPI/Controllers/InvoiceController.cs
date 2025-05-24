namespace WebAPI.Controllers;

using System;
using System.Threading.Tasks;

using BusinessLayer.Contracts;
using BusinessLayer.Models;
using BusinessLayer.Models.InvoiceDTOs;
using BusinessLayer.Models.InvoiceDTOs.Create;
using BusinessLayer.Models.InvoiceDTOs.Generate;
using BusinessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/invoice")]
[ApiController]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    public InvoiceController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet("generate-invoice/{id}")]
    public ActionResult<SingleResponse<InvoiceInfoDTO>> GetInvoiceData(Guid id)
    {
        var response = _invoiceService.GetInvoiceData(id);

        if (!response.HasError())
        {
            return Ok(response);
        }

        return NotFound(response.Error);
    }

    [HttpPost("create-invoice")]
    public async Task<ActionResult<Type>> CreateInvoice([FromBody] InvoiceDTO invoice)
    {
        var response = await _invoiceService.CreateInvoice(invoice);

        if (response.HasError())
        {
            return UnprocessableEntity();
        }

        return Ok(response);
    }

    [HttpGet("all")]
    public async Task<ActionResult<CollectionResponse<InvoiceDisplayDTO>>> GetAllInvoicesAsync()
    {
        var response = new CollectionResponse<InvoiceDisplayDTO>();
        response = _invoiceService.GetAll();

        if (response.HasError())
        {
            return BadRequest(response.Error);
        }

        return Ok(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<BaseResponse>> DeleteInvoice([FromBody] Guid invoiceId)
    {
        var result = await _invoiceService?.DeleteInvoice(invoiceId);

        if (result.HasError())
        {
            return BadRequest(result.Error);
        }

        return Ok(result);
    }

    [HttpPatch("pay/{id}")]
    public async Task<ActionResult<BaseResponse>> PayInvoice(Guid id)
    {
        var response = await _invoiceService.PayInvoice(id);

        if (response.HasError())
        {
            return UnprocessableEntity(response.Error);
        }

        return Ok(response);
    }

    [HttpGet("get-invoice/{id}")]
    public async Task<ActionResult<SingleResponse<InvoiceDetailsDTO>>> GetInvoice(Guid id)
    {
        SingleResponse<InvoiceDetailsDTO> response = _invoiceService.GetCompleteInvoice(id);

        if (!response.HasError())
        {
            return Ok(response);
        }

        return BadRequest(response.Error);
    }
}
