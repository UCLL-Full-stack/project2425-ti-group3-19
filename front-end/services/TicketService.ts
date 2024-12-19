const api = process.env.NEXT_PUBLIC_API_URL;

const getUserTickets = async ({ userId, token }: { userId: number; token: string }) => {
    try {
        const response = await fetch(`${api}/tickets/ticketuser?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tickets: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default { getUserTickets };
