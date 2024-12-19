import Header from "@/components/header";
import userService from "@/services/userService";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { t } = useTranslation();
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
            const response = await userService.loginUser(email,password);

            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            setSuccessMessage(t('login.successMessage'));
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
                <h2>{t('login.title')}</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">{t('login.email')}:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder={t('login.email')}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">{t('login.password')}:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder={t('login.password')}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">{t('login.loginButton')}</button>
                    <p className="mt-3">
                    {t('login.register')} <Link href="/registration">{t('login.noaccount')} </Link>
                    </p>
                </form>
            </div>
        </>
    );
}


export const getServerSideProps = async ( context: { locale: any; } ) => {
    const { locale } = context;
    console.log("Locale:", locale);

    const translations = await serverSideTranslations(locale ?? "en", ["common"]);
    return {
        props: {
            ...translations
        },
    };
};
