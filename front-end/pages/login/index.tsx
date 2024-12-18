import Header from "@/components/header";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    // Check if the user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/'); // Redirect to dashboard or any other protected route
        }
    }, []);

    // Function to check if user is authenticated by checking for token in localStorage
    function isAuthenticated() {
        console.log(localStorage.getItem('authToken'));
        return !!localStorage.getItem('authToken'); // Returns true if token exists
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/login', {
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

            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            setSuccessMessage('Login successful!');
            router.push('/');
            console.log(token.email)
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Login</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className="mt-3">
                        Don’t have an account? <Link href="/registration">Register here</Link>.
                    </p>
                </form>
            </div>
        </>
    );
}
