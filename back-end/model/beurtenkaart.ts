import { isAfter } from 'date-fns';
import { Order } from './order'; // Assuming Order class is in the same directory

export class Beurtenkaart {
    private id: number; // Not optional
    private beurten: number;
    private price: number;
    private valid: boolean;
    private startDate: Date;
    private endDate: Date;
    private orderId: string;

    constructor(beurtenkaart: {
        id: number;
        beurten: number;
        price: number;
        valid: boolean;
        startDate: Date;
        endDate: Date;
        orderId: string;
    }) {
        this.validate(beurtenkaart);

        this.id = beurtenkaart.id;
        this.beurten = beurtenkaart.beurten;
        this.price = beurtenkaart.price;
        this.valid = beurtenkaart.valid;
        this.startDate = beurtenkaart.startDate;
        this.endDate = beurtenkaart.endDate;
        this.orderId = beurtenkaart.orderId;
    }

    getId(): number {
        return this.id;
    }

    getBeurten(): number {
        return this.beurten;
    }

    getPrice(): number {
        return this.price;
    }

    isValid(): boolean {
        return this.valid;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getOrderId(): string {
        return this.orderId;
    }

    validate(beurtenkaart: {
        id: number;
        beurten: number;
        price: number;
        valid: boolean;
        startDate: Date;
        endDate: Date;
        orderId: string;
    }) {
        if (beurtenkaart.id <= 0) {
            throw new Error('ID must be a positive number');
        }
        if (beurtenkaart.beurten <= 0) {
            throw new Error('Beurten must be a positive number');
        }
        if (beurtenkaart.price <= 0) {
            throw new Error('Price must be a positive number');
        }
        if (!(beurtenkaart.startDate instanceof Date)) {
            throw new Error('StartDate must be a valid date');
        }
        if (!(beurtenkaart.endDate instanceof Date)) {
            throw new Error('EndDate must be a valid date');
        }
        if (beurtenkaart.endDate < beurtenkaart.startDate) {
            throw new Error('EndDate cannot be before StartDate');
        }
        if (beurtenkaart.orderId === undefined) {
            throw new Error('Order ID is required');
        }
    }

    equals(beurtenkaart: Beurtenkaart): boolean {
        return (
            this.id === beurtenkaart.getId() &&
            this.beurten === beurtenkaart.getBeurten() &&
            this.price === beurtenkaart.getPrice() &&
            this.valid === beurtenkaart.isValid() &&
            this.startDate.getTime() === beurtenkaart.getStartDate().getTime() &&
            this.endDate.getTime() === beurtenkaart.getEndDate().getTime() &&
            this.orderId === beurtenkaart.getOrderId()
        );
    }
}