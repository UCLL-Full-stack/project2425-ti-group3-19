import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if the authToken exists in localStorage
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token); // Set to true if token exists, false otherwise
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear the token
        setIsAuthenticated(false); // Update authentication status
        router.push('/'); // Redirect to homepage or login
    };

    return (
        <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-dark">
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <h1 className="h3 m-0 text-white">Train tickets</h1>
            </Link>
            <nav>
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                ) : (
                    <>
                        <Link href="/login" passHref>
                            <button className="btn btn-primary me-2">Login</button>
                        </Link>
                        <Link href="/registration" passHref>
                            <button className="btn btn-secondary">Register</button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
