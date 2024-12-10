import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
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

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login'); // Redirect to login if no token is found
            return;
        }

        const fetchUserData = async () => {
            try {
                console.log('API URL:', process.env.NEXT_PUBLIC_API_URL + '/users/profile');
                const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError('Failed to fetch user data');
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
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Your Account</h1>
            {user && (
                <div>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            )}
        </div>
    );
}
