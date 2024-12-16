import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokensto = localStorage.getItem('authToken');
        setToken(tokensto);
        if (!token) {
            router.push('/login'); // Redirect to login if no token is found
            return;
        }

        const fetchUserData = async () => {
            try {
                console.log('Fetching user data...');
                console.log('API URL:', process.env.NEXT_PUBLIC_API_URL + '/users/profile');
                console.log('Token exists:', !!token);
                const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Response status:', res.status);
                var error;
                if (!res.ok) {
                    const errorData = await res.json();
                    error = errorData;
                    throw new Error(errorData.message);
                }
                const data = await res.json();
                console.log('Received data:', data);
                setUser(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; // Display error message if fetching fails
    }

    return (
        <div>
            <h1>User Profile</h1>
            {user && (
                <div>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            )}
        </div>
    );
}