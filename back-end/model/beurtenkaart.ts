import { Order } from './order'; // Assuming Order class is in the same directory

export class Beurtenkaart {
    private id?: number; 
    private beurten: number;
    private price: number;
    private valid: boolean;
    private startDate: Date;
    private endDate: Date;
    private order: Order;

    constructor(beurtenkaart: {
        id?: number;
        beurten: number;
        price: number;
        valid: boolean;
        startDate: Date;
        endDate: Date;
        order: Order;
    }) {
        this.validate(beurtenkaart);

        this.id = beurtenkaart.id;
        this.beurten = beurtenkaart.beurten;
        this.price = beurtenkaart.price;
        this.valid = beurtenkaart.valid;
        this.startDate = beurtenkaart.startDate;
        this.endDate = beurtenkaart.endDate;
        this.order = beurtenkaart.order;
    }

    getId(): number | undefined{
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

    getOrder(): Order {
        return this.order;
    }

    validate(beurtenkaart: {
        id?: number;
        beurten: number;
        price: number;
        valid: boolean;
        startDate: Date;
        endDate: Date;
        order: Order;
    }) {
        if (beurtenkaart.id !== undefined && beurtenkaart.id <= 0) {
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
        if (beurtenkaart.order.getOrderId() === undefined) {
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
            this.order.getOrderId() === beurtenkaart.getOrder().getOrderId()
        );
    }
}