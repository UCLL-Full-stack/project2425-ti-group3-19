import { Order, PromoCodeResponse } from '@/types';

export class OrdersService {
    private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

    static async validatePromoCode(promoCode: string): Promise<PromoCodeResponse> {
        const response = await fetch(`${this.baseUrl}/promocodes/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promoCode }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid promo code.');
        }

        return response.json();
    }

    static async getUserOrders(userId: number, token: string): Promise<Order[]> {
        const response = await fetch(`${this.baseUrl}/orders/user-orders?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }

        return response.json();
    }

    static async getSubscription(orderReference: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/subscriptions/${orderReference}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch subscription');
        }

        return response.json();
    }

    static async placeOrder(orders: Order[], promotionIds: number[], token: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ orders, promotionIds }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to place order');
        }
    }
}