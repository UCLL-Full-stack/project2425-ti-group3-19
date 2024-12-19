    import Link from 'next/link';
import Header from '@/components/header';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import userService from '@/services/userService';
import { User } from '@/types';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role can be set as needed
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // const user: User = { firstName, lastName, email, password, role };
            const response = await userService.registerNewUser(firstName, lastName, email, password, role);

            const newUser = await response.json();
            // Handle successful registration, e.g., redirect or show a success message
            console.log('User registered successfully:', newUser);
            setSuccessMessage('Registering successful!');
            setTimeout(() => router.push('/login'), 1000)

        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Register</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter your first name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter your last name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary">Register</button>
                    <p className="mt-3">
                        Already have an account? <Link href="/login">Login here</Link>.
                    </p>
                </form>
            </div>
        </>
    );
}
