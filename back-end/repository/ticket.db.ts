import { Ticket } from '../model/ticket'; // Assuming you have a Ticket model

const tickets: Ticket[] = [];

// Function to retrieve all tickets
const getAllTickets = (): Ticket[] => {
    return tickets;
};

// Function to retrieve a ticket by ID
const getTicketById = (id: number): Ticket | null => {
    const ticket = tickets.find((ticket) => ticket.getId() === id);
    return ticket || null;
};

// Function to save a new ticket
const saveTicket = (ticket: Ticket): Ticket => {
    tickets.push(ticket); // Save the Ticket instance directly
    return ticket;
};

// Export the repository functions as an object for easy import
export default {
    getAllTickets,
    getTicketById,
    saveTicket,
};