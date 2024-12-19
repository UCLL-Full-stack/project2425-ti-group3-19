import { User } from "@/types";

const api = process.env.NEXT_PUBLIC_API_URL;

// Function to register a new user
const registerNewUser = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    return await fetch(api + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
    });
}

// Function to log in a user
const loginUser = async (email: string, password: string) => {
    return await fetch(api + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
}

// Function to get all users
const getAllUsers = async (token: string): Promise<User[]> => {
    const response = await fetch(api + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json(); // Return the list of users
}

// Function to update the user's role
const updateUserRole = async (userId: number, role: string, token: string) => {
    return await fetch(`${api}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
    });
}

export default { registerNewUser, loginUser, getAllUsers, updateUserRole };
