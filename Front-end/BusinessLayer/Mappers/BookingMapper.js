import {BookingDTO} from "../Models/BookingDTO.js"
import {Booking} from "../Models/Booking.js"
export class BookingMapper
{
    MapToBookingDTO(data)
    {
        let booking = new BookingDTO();
        booking.spaceId = data.spaceId;
        booking.clientId = data.clientId;
        booking.price = data.price;
        booking.startDate = data.startDate;
        booking.endDate = data.endDate;

        return booking;
    };
    MapToBooking(data)
    {
        let booking = new Booking();
        booking.id = data.id;
        booking.clientName = data.clientName
        booking.clientId = data.clientId;
        booking.spaceName = data.spaceName;
        booking.spaceId = data.spaceId;
        booking.price = data.price;
        booking.startDate = data.startDate;
        booking.endDate = data.endDate;
        return booking;
    };
}