import { BookingService } from "../../BusinessLayer/Services/BookingService.js";
import { SpaceMap } from "../../BusinessLayer/Mappers/SpaceMap.js";
import { BookingMapper } from "../../BusinessLayer/Mappers/BookingMapper.js";
import { displayPrompt } from "../utilities/Prompt.js";


export class BookingController
{
    constructor()
    {
        this.bookingService = new BookingService();
        this.spaceMapper = new SpaceMap();
        this.bookingMapper = new BookingMapper();
    };
    
    async GetAll()
    {
        let response = await this.bookingService.getAll();
        if(response.hasError)
        {
            await displayPrompt('.prompt-save', response.errorMessage, false);
            return;
        };
        let bookings = response.data.map(spaceData=>this.spaceMapper.MapToSpace(spaceData,true));
        return bookings;
    };

    async GetBookingInfo()
    {
        let response = await this.bookingService.getBookingInfo();
        if(response.error.hasError)
        {
            await displayPrompt('.prompt-save', response.error.errorMessage, false);
            return;
        };
        return response;
    };

    async Book(booking)
    {
        let bookingDTO = this.bookingMapper.MapToBookingDTO(booking);
        let response = await this.bookingService.book(bookingDTO);
        if(response.error.hasError)
        {
            await displayPrompt('.prompt-save', response.error.errorMessage, false);
            return;
        };
        return response;
    };

    async GetAllBookings()
    {
        let response = await this.bookingService.getAllBookings();
        if(response.error.hasError)
        {
            await displayPrompt('.prompt-save', response.error.errorMessage, false);
            return;
        };
        let bookings = response.data.map(bookingData=>this.bookingMapper.MapToBooking(bookingData));
        return bookings;
    };

    async DeleteBooking(id)
    {
        let response = await this.bookingService.deleteBooking(id);
        if(response.error.hasError)
        {
            await displayPrompt('.prompt-save', response.error.errorMessage, false);
            return;
        };
        await displayPrompt('.prompt-save', 'Успешно изтрихте резервацията.', false);
        return;
    };
    
}