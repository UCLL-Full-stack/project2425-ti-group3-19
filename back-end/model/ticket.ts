import { Order } from './order'; 

export class Ticket {
    private id: number;
    private date: Date;
    private price: number;
    private startStation: string;
    private desStation: string;
    private orderId: string;

    constructor(ticket: {
        id: number;
        date: Date;
        price: number;
        startStation: string;
        desStation: string;
        orderId: string;
    }) {
        this.validate(ticket);

        this.id = ticket.id;
        this.date = ticket.date;
        this.price = ticket.price;
        this.startStation = ticket.startStation;
        this.desStation = ticket.desStation;
        this.orderId = ticket.orderId;
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

    validate(ticket: {
        id?: number;
        date: Date;
        price: number;
        startStation: string;
        desStation: string;
        orderId: string;
    }) {
        if (ticket.id !== undefined && ticket.id <= 0) {
            throw new Error('ID must be a positive number if provided');
        }
        if (!(ticket.date instanceof Date)) {
            throw new Error('Date is required');
        }
        if (ticket.price <= 0) {
            throw new Error('Price must be a positive number');
        }
        if (!ticket.startStation?.trim()) {
            throw new Error('StartStation is required');
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
            this.id === ticket.getId() &&
            this.date === ticket.getDate() &&
            this.price === ticket.getPrice() &&
            this.startStation === ticket.getStartStation() &&
            this.desStation === ticket.getDesStation() &&
            this.orderId === ticket.getOrderId()
        );
    }
}
