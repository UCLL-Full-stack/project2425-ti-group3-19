import { User } from './user';
import {Promotion} from './promotion';

export class Order {
    private id?: number;
    private orderDate: Date;
    private product: string;
    private price: number;
    private user: User;
    private promotions: Promotion[];
    private orderReferentie: string;

    constructor(order: {
        id?: number;
        orderDate: Date;
        product: string;
        price: number;
        user: User;
        promotions: Promotion[];
        orderReferentie: string;

    }) {
        this.validate(order);

        this.id = order.id;
        this.orderDate = order.orderDate;
        this.product = order.product;
        this.price = order.price;
        this.user = order.user;
        this.promotions = order.promotions;
        this.orderReferentie = order.orderReferentie;
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

    getOrderId(): number | undefined {
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
            this.product === order.getProduct() &&
            this.price === order.getPrice() &&
            this.user.getId() === order.getUser().getId() && // Compare by User ID
            this.promotions.every((promotion, index) => promotion.equals(order.getPromotions()[index])) &&
            this.orderReferentie === order.getorderReferentie()
        );
    }
}
