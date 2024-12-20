import { Order } from './order'; // Assuming Order class is in the same directory
import { Subscription as SubscriptionPrisma } from '@prisma/client';

export class Subscription {
    private id: number; // Not optional
    private region: string;
    private subtype: string;
    private startDate: Date;
    private endDate: Date;
    private orderId: string;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(subscription: {
        id: number;
        region: string;
        subtype: string;
        startDate: Date;
        endDate: Date;
        orderId: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(subscription);

        this.id = subscription.id;
        this.region = subscription.region;
        this.subtype = subscription.subtype;
        this.startDate = subscription.startDate;
        this.endDate = subscription.endDate;
        this.orderId = subscription.orderId;
        this.createdAt = subscription.createdAt;
        this.updatedAt = subscription.updatedAt;
    }

    getId(): number {
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

    getOrderId(): string {
        return this.orderId;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    validate(subscription: {
        id: number;
        region: string;
        subtype: string;
        startDate: Date;
        endDate: Date;
        orderId: string;
    }) {
        if (subscription.id <= 0) {
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
        if (subscription.orderId === undefined) {
            throw new Error('Order ID is required');
        }
    }

    equals(subscription: Subscription): boolean {
        return (
            this.id === subscription.getId() &&
            this.region === subscription.getRegion() &&
            this.subtype === subscription.getSubtype() &&
            this.startDate === subscription.getStartDate() &&
            this.endDate === subscription.getEndDate() &&
            this.orderId === subscription.getOrderId() &&
            this.createdAt?.getTime() === subscription.createdAt?.getTime() &&
            this.updatedAt?.getTime() === subscription.updatedAt?.getTime()
        );
    }
    static from({
        id,
        region,
        subtype,
        startDate,
        endDate,
        orderId,
        createdAt,
        updatedAt,
    }: SubscriptionPrisma) {
        return new Subscription({
            id,
            region,
            subtype,
            startDate,
            endDate,
            orderId,
            createdAt,
            updatedAt,
        });
    }
}
