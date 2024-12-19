import { Order } from "@/types";

const api = process.env.NEXT_PUBLIC_API_URL;

const validatePromoCode = async ({ promoCode }: { promoCode: string }) => {
    try {
        const response = await fetch(`${api}/promocodes/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promoCode }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid promo code.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getUserOrders = async ({ userId, token }: { userId: number; token: string }) => {
    try {
        const response = await fetch(`${api}/orders/user-orders?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const placeOrder = async ({ orders, promotionIds, token }: { orders: Order[]; promotionIds: number[]; token: string }) => {
    try {
        const response = await fetch(`${api}/orders`, {
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
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAllOrders = async (token: string): Promise<Order[]> => {
    const response = await fetch(`${api}/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
    throw new Error('Failed to fetch all orders');
}

return response.json();
}

export default { validatePromoCode, getUserOrders, placeOrder, getAllOrders };
