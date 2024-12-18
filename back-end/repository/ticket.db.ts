import { Ticket } from '../model/ticket'; // Assuming you have a Ticket model
import orderService from '../service/order.service';
import database from '../util/database';

// const tickets: Ticket[] = [];

// Function to retrieve all tickets
const getAllTickets = async (): Promise<Ticket[]> => {
    try {
        const ticketPrisma = await database.ticket.findMany();
        return ticketPrisma.map((ticketPrisma) => Ticket.from(ticketPrisma))
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }};

// Function to retrieve a ticket by ID
const getTicketById = async ({ id }: { id: number }): Promise<Ticket | null> => {
    try {
        const ticketPrisma = await database.ticket.findUnique({
            where: { id },
        });
        return ticketPrisma ? Ticket.from(ticketPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }
};


// Function to save a new ticket
const saveTicket = (ticket: Ticket): Ticket => {
    tickets.push(ticket); // Save the Ticket instance directly
    return ticket;
};

const findTicketsByUserId = async (userId: string): Promise<Ticket[]> => {
    var userIdN: number = +userId;
    const orders = await orderService.getUserOrders(userIdN);
    console.log(orders);
    const orderIds = orders.map(order => order.getorderReferentie());
    const userTickets = tickets.filter(ticket =>
        orderIds.includes(ticket.getOrderId())
    );
    return userTickets;
}

// Export the repository functions as an object for easy import
export default {
    getAllTickets,
    getTicketById,
    saveTicket,
    findTicketsByUserId,
};