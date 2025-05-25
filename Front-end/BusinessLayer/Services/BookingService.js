import {BookingRepository} from "../../DataLayer/Repository/BookingRepository.js"

export class BookingService
{
    constructor()
    {
        this.bookingRepository = new BookingRepository();
    };

    async getAll()
    {
        let response = await this.bookingRepository.getAll();
        return response;
    };

    async getBookingInfo()
    {
        let response = await this.bookingRepository.getBookingInfo();
        return response;
    };

    async book(booking)
    {
        let response = await this.bookingRepository.book(booking);
        return response;
    };

    async getAllBookings()
    {
        let response = await this.bookingRepository.getAllBookings();
        return response;
    };

    async deleteBooking(id)
    {
        let response = await this.bookingRepository.deleteBooking(id);
        return response;
    };
}
