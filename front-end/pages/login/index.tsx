import Header from '@/components/header';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import LoginForm from '@/components/login/loginForm';
import AlertMessage from '@/components/alerts/alertMessage';
import userService from '@/services/userService';
import Link from 'next/link';

export default function Login() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();
    const { t } = useTranslation();

    // Check if the user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/'); // Redirect to dashboard or any other protected route
        }
    }, []);

    // Function to check if user is authenticated by checking for token in localStorage
    function isAuthenticated() {
        return !!localStorage.getItem('authToken'); // Returns true if token exists
    }

    const handleSubmit = async (email: string, password: string) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await userService.loginUser(email, password);
            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            setSuccessMessage(t('login.successMessage'));
            router.push('/');
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>{t('login.title')}</h2>
                <AlertMessage message={errorMessage} type="danger" />
                <AlertMessage message={successMessage} type="success" />
                <LoginForm onSubmit={handleSubmit} />
                <p className="mt-3">
                    {t('login.register')} <Link href="/registration">{t('login.noaccount')}</Link>
                </p>
            </div>
        </>
    );
}

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;
    const translations = await serverSideTranslations(locale ?? "en", ["common"]);
    return {
        props: {
            ...translations
        },
    };
};
