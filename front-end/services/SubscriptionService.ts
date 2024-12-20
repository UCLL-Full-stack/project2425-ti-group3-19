const api = process.env.NEXT_PUBLIC_API_URL;

const getSubscription = async ({ orderReferentie, token }: { orderReferentie: string, token: string }) => {
    try {
        console.log(orderReferentie);
        const response = await fetch(`${api}/subscriptions/${orderReferentie}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch subscription: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getUserSubscriptions = async ({ userId, token }: { userId: number; token: string }) => {
    try {
        const response = await fetch(`${api}/subscriptions/subsuser?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default { getSubscription, getUserSubscriptions };
