import {
    Order as PrismaOrder,
    User as PrismaUser,
    Promotion as PrismaPromotion
} from '@prisma/client';
import { User } from './user';
import { Promotion } from './promotion';

export class Order {
    readonly id?: string;
    readonly orderDate: Date;
    readonly product: string;
    readonly price: number;
    readonly user: User;
    readonly promotions: Promotion[];
    readonly orderReferentie: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(order: {
        id?: string;
        orderDate: Date;
        product: string;
        price: number;
        user: User;
        promotions: Promotion[];
        orderReferentie: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(order);
        this.id = order.id;
        this.orderDate = order.orderDate;
        this.product = order.product;
        this.price = order.price;
        this.user = order.user;
        this.promotions = order.promotions;
        this.orderReferentie = order.orderReferentie;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
    }

    getOrderDate(): Date {
        return this.orderDate;
    }
    getProduct(): string {
        return this.product;
    }
    getPrice(): number {
        return this.price;
    }
    getOrderId(): string | undefined {
        return this.id;
    }
    getUser(): User {
        return this.user;
    }
    getPromotions(): Promotion[] {
        return this.promotions;
    }
    getorderReferentie(): string {
        return this.orderReferentie;
    }

    validate(order: {
        orderDate: Date;
        product: string;
        price: number;
        user: User;
        promotions: Promotion[];
        orderReferentie: string;
    }) {
        if (!(order.orderDate instanceof Date)) {
            throw new Error('Order date must be a valid date');
        }
        if (!order.product?.trim()) {
            throw new Error('Product is required');
        }
        if (order.price < 0) {
            throw new Error('Price must be a positive number');
        }
        if (!order.user) {
            throw new Error('User is required');
        }
        if (!order.orderReferentie) {
            throw new Error('OrderReferenties is required');
        }
    }

    equals(order: Order): boolean {
        return (
            this.id === order.id &&
            this.orderDate === order.orderDate &&
            this.product === order.product &&
            this.price === order.price &&
            this.user.equals(order.user) &&
            this.promotions.every((promotion, index) => promotion.equals(order.promotions[index])) &&
            this.orderReferentie === order.orderReferentie &&
            this.createdAt === order.createdAt &&
            this.updatedAt === order.updatedAt
        );
    }

    static from({
        id,
        orderDate,
        product,
        price,
        orderReferentie,
        createdAt,
        updatedAt,
        user,
        promotions = [],
    }: PrismaOrder & {
        user?: PrismaUser;
        promotions?: PrismaPromotion[]
    }): Order {
        if (!user) {
            throw new Error("User is required to create an Order instance.");
        }
        return new Order({
            id,
            orderDate,
            product,
            price,
            user: User.from(user),
            promotions: promotions.map((promotion) => Promotion.from(promotion)),
            orderReferentie,
            createdAt,
            updatedAt,
        });
    }


}