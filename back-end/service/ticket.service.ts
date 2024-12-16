import { Ticket } from '../model/ticket'; // Assuming you have a Ticket model
import ticketRepository from '../repository/ticket.db';

    const createTicket = async (ticket: Ticket): Promise<Ticket> => {
        return ticketRepository.saveTicket(ticket); // Save the Ticket instance directly
    }

    const getAllTickets = async (): Promise<Ticket[]> => {
        return ticketRepository.getAllTickets();
    }

    const getTicketById = async (id: number): Promise<Ticket | null> => {
        return ticketRepository.getTicketById(id);
    }


export default {
    createTicket,
    getAllTickets,
    getTicketById,
};