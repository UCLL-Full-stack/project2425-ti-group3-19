// components/Header.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        router.reload();
    };

    return (
        <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-dark">
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <h1 className="h3 m-0 text-white">Train Tickets</h1>
            </Link>
            <nav>
                {isLoggedIn ? (
                    <>
                        <Link href="/account" passHref>
                            <button className="btn btn-primary me-2">Account</button>
                        </Link>
                        <Link href="/buy-tickets" passHref>
                            <button className="btn btn-success me-2">Buy Tickets</button>
                        </Link>
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </>
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
