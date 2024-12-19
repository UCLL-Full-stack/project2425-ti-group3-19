const api = process.env.NEXT_PUBLIC_API_URL;


//Ik gebruik geen type van user omdat hij anders een error gooit in de log.
const registerNewUser = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    const response = await fetch(api + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
    });
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
    return response
}


const loginUser = async (email: string, password: string) => {
    const response = await fetch(api + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
    return response
}
const getUserByID = async (userId: number) => {
    try {
        const response = await fetch(`${api}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch user with: ${userId}, response:${response.statusText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export default { registerNewUser, loginUser, getUserByID };
