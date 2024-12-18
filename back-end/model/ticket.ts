import { Ticket as TicketPrisma } from '@prisma/client';

export class Ticket {
    readonly id?: number;
    readonly date: Date;
    readonly price: number;
    readonly startStation: string;
    readonly desStation: string;
    readonly orderId: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(ticket: {
        id?: number;
        date: Date;
        price: number;
        startStation: string;
        desStation: string;
        orderId: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(ticket);
        this.id = ticket.id;
        this.date = ticket.date;
        this.price = ticket.price;
        this.startStation = ticket.startStation;
        this.desStation = ticket.desStation;
        this.orderId = ticket.orderId;
        this.createdAt = ticket.createdAt;
        this.updatedAt = ticket.updatedAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    getDate(): Date {
        return this.date;
    }

    getPrice(): number {
        return this.price;
    }

    getStartStation(): string {
        return this.startStation;
    }

    getDesStation(): string {
        return this.desStation;
    }

    getOrderId(): string {
        return this.orderId;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    validate(ticket: {
        date: Date;
        price: number;
        startStation: string;
        desStation: string;
        orderId: string;
    }) {
        if (!(ticket.date instanceof Date)) {
            throw new Error('Date is required and must be a valid Date object');
        }
        if (ticket.price <= 0) {
            throw new Error('Price must be a positive number');
        }
        if (!ticket.startStation?.trim()) {
            throw new Error('Start Station is required');
        }
        if (!ticket.desStation?.trim()) {
            throw new Error('Destination Station is required');
        }
        if (!ticket.orderId?.trim()) {
            throw new Error('Order ID is required');
        }
    }

    equals(ticket: Ticket): boolean {
        return (
            this.id === ticket.id &&
            this.date.getTime() === ticket.date.getTime() &&
            this.price === ticket.price &&
            this.startStation === ticket.startStation &&
            this.desStation === ticket.desStation &&
            this.orderId === ticket.orderId &&
            this.createdAt?.getTime() === ticket.createdAt?.getTime() &&
            this.updatedAt?.getTime() === ticket.updatedAt?.getTime()
        );
    }

    static from(prismaTicket: TicketPrisma): Ticket {
        return new Ticket({
            id: prismaTicket.id,
            date: new Date(prismaTicket.date), // Convert string to Date
            price: prismaTicket.price,
            startStation: prismaTicket.startStation,
            desStation: prismaTicket.desStation,
            orderId: prismaTicket.orderId.toString(), // Convert number to string if necessary
            createdAt: prismaTicket.createdAt ? new Date(prismaTicket.createdAt) : undefined,
            updatedAt: prismaTicket.updatedAt ? new Date(prismaTicket.updatedAt) : undefined,
        });
    }
}
