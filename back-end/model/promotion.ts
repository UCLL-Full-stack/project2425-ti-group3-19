import { 
    Promotion as PrismaPromotion, 
    Order as PrismaOrder 
} from '@prisma/client';
import { Order } from './order';

export class Promotion {
    readonly id?: number;
    readonly Code: string;
    readonly IsActive: boolean;
    readonly DiscountAmount: number;
    readonly orders: Order[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(promotion: {
        id?: number;
        Code: string;
        IsActive: boolean;
        DiscountAmount: number;
        orders: Order[];
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(promotion);
        this.Code = promotion.Code;
        this.IsActive = promotion.IsActive;
        this.DiscountAmount = promotion.DiscountAmount;
        this.orders = promotion.orders;
        this.id = promotion.id;
        this.createdAt = promotion.createdAt;
        this.updatedAt = promotion.updatedAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    getCode(): string {
        return this.Code;
    }

    getIsActive(): boolean {
        return this.IsActive;
    }

    getDiscountAmount(): number {
        return this.DiscountAmount;
    }

    getOrders(): Order[] {
        return this.orders;
    }

    validate(promotion: { 
        Code: string; 
        IsActive: boolean; 
        DiscountAmount: number; 
        orders: Order[];
    }) {
        if (!promotion.Code) {
            throw new Error('Code is required');
        }
        if (promotion.IsActive === undefined) {
            throw new Error('IsActive is required');
        }
        if (!promotion.DiscountAmount) {
            throw new Error('DiscountAmount are required');
        }
        if (!promotion.orders) {
            throw new Error('Orders are required');
        }
    }

    equals(promotion: Promotion): boolean {
        return (
            this.id === promotion.id &&
            this.Code === promotion.Code &&
            this.IsActive === promotion.IsActive &&
            this.DiscountAmount === promotion.DiscountAmount &&
            this.orders.every((order, index) => order.equals(promotion.orders[index])) &&
            this.createdAt === promotion.createdAt &&
            this.updatedAt === promotion.updatedAt
        );
    }

    static from({
        id,
        Code,
        IsActive,
        DiscountAmount,
        orders = [], // Provide a default empty array
        createdAt,
        updatedAt,
    }: PrismaPromotion & { 
        orders?: PrismaOrder[] 
    }): Promotion {
        return new Promotion({
            id,
            Code,
            IsActive,
            DiscountAmount,
            orders: orders.map((order) => Order.from(order)),
            createdAt,
            updatedAt,
        });
    }
}