import { BaseResponse } from "../../BusinessLayer/Contracts/BaseResponse.js";

export class BookingRepository
{
  async getAll()
  {
    let response = new BaseResponse();
    try
    {
        const data = await fetch("https://localhost:7286/api/booking/all");
        response = await data.json();
      } 
      catch (error)
      {
        response.addError("Имаше проблем с извеждането на резервацийте. Моля опитайте отново.")
      };
      return response;
  };

  async getBookingInfo()
  {
    let response = new BaseResponse();
    try
    {
        const data = await fetch("https://localhost:7286/api/booking/bookingInfo");
        response = await data.json();
    } 
    catch (error)
    {
        response.addError("Имаше проблем с извеждането на данните. Моля опитайте отново.")
    };
    return response;
  };

  async book(booking)
  {
    let response = new BaseResponse();
    try {
        let data = await fetch(
          "https://localhost:7286/api/booking/bookingInfo/book",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking),
          }
        );
        response = await data.json();
    } 
    catch (error) {
        response.addError("Имаше проблем при въвеждане на записа.");
    }
    return response;
  };

  async getAllBookings()
  {
    let response = new BaseResponse();
    try
    {
        let data = await fetch("https://localhost:7286/api/booking/all-bookings");
        response = await data.json();
    } 
    catch (error)
    {
        response.addError("Имаше проблем с извеждането на резервацийте. Моля опитайте отново.")
    };
    return response;
  };

  async deleteBooking(id) {
    let response = new BaseResponse();
    try {
      let data = await fetch(`https://localhost:7286/api/booking/delete/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
      });
      response = await data.json();
    } 
    catch (error) {
      response.addError("Изникна проблем с изтриването на резервацията.");
    };
    return response;
  };      
}