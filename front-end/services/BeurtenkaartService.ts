const api = process.env.NEXT_PUBLIC_API_URL;

const getUserBeurtenKaarten = async ({ userId, token }: { userId: number; token: string }) => {
    try {
        const response = await fetch(`${api}/beurtenkaarten/beurtuser?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch beurtenkaarten: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default { getUserBeurtenKaarten };
