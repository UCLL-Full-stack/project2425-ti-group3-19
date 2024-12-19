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
const saveTicket = async (ticket: Ticket): Promise<Ticket> => {
    const orderId = ticket.getOrderId();
    const orderExists = await database.order.findUnique({
        where: { id: orderId }, 
    });

    if (orderExists) {
        throw new Error(`Order with ID ${orderId} already exists.`);
    }

    console.log(`Creating ticket for order ID: ${orderId}`);

    // Create the ticket
    const prismaTicket = await database.ticket.create({
        data: {
            date: ticket.getDate(),
            price: ticket.getPrice(),
            startStation: ticket.getStartStation(),
            desStation: ticket.getDesStation(),
            orderId: orderId,
        },
    });

    return Ticket.from(prismaTicket);
};

const findTicketsByUserId = async (userId: string): Promise<Ticket[]> => {
    const userIdN: number = +userId; 

    const ordersPrisma = await database.order.findMany({
        where: {
            userId: userIdN, 
        },
        select: {
            orderReferentie: true, 
        },
    });

    const orderReferenties = ordersPrisma.map(order => order.orderReferentie);

    const ticketsPrisma = await database.ticket.findMany({
        where: {
            orderId: { in: orderReferenties },
        },
    });

    return ticketsPrisma.map(ticket => Ticket.from(ticket));
};

// Export the repository functions as an object for easy import
export default {
    getAllTickets,
    getTicketById,
    saveTicket,
    findTicketsByUserId,
};