import { Ticket } from '../model/ticket'; // Assuming you have a Ticket model
import ticketRepository from '../repository/ticket.db';

const createTicket = async (ticket: Ticket): Promise<Ticket> => {
    return ticketRepository.saveTicket(ticket); // Save the Ticket instance directly
}

const getAllTickets = async (): Promise<Ticket[]> => {
    return ticketRepository.getAllTickets();
}

const getTicketById = async (id: number): Promise<Ticket | null> => {
    const ticket = ticketRepository.getTicketById({ id });
    if (!ticket) {
        throw new Error(`Ticket with id ${id} does not exist.`);
    }
    return ticket
}

const getTicketsByUserId = async (userId: string): Promise<Ticket[]> => {
    return await ticketRepository.findTicketsByUserId(userId);
}


export default {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
};