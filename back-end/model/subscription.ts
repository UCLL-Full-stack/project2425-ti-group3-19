import { Order } from './order'; // Assuming Order class is in the same directory

export class Subscription {
    private id?: number;
    private region: string;
    private subtype: string;
    private startDate: Date;
    private endDate: Date;
    private order: Order;

    constructor(subscription: {
        id?: number;
        region: string;
        subtype: string;
        startDate: Date;
        endDate: Date;
        order: Order;
    }) {
        this.validate(subscription);

        this.id = subscription.id;
        this.region = subscription.region;
        this.subtype = subscription.subtype;
        this.startDate = subscription.startDate;
        this.endDate = subscription.endDate;
        this.order = subscription.order;
    }

    getId(): number | undefined {
        return this.id;
    }

    getRegion(): string {
        return this.region;
    }

    getSubtype(): string {
        return this.subtype;
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

    validate(subscription: {
        id?: number;
        region: string;
        subtype: string;
        startDate: Date;
        endDate: Date;
        order: Order;
    }) {
        // Only validate id if it is provided
        if (subscription.id !== undefined && subscription.id <= 0) {
            throw new Error('ID must be a positive number');
        }
        if (!subscription.region?.trim()) {
            throw new Error('Region is required');
        }
        if (!subscription.subtype?.trim()) {
            throw new Error('Subtype is required');
        }
        if (!(subscription.startDate instanceof Date)) {
            throw new Error('StartDate must be a valid date');
        }
        if (!(subscription.endDate instanceof Date)) {
            throw new Error('EndDate must be a valid date');
        }
        if (subscription.order.getOrderId() === undefined) {
            throw new Error('Order ID is required');
        }
    }

    equals(subscription: Subscription): boolean {
        return (
            this.id === subscription.getId() &&
            this.region === subscription.getRegion() &&
            this.subtype === subscription.getSubtype() &&
            this.startDate.getTime() === subscription.getStartDate().getTime() &&
            this.endDate.getTime() === subscription.getEndDate().getTime() &&
            this.order.getOrderId() === subscription.getOrder().getOrderId()
        );
    }
}
