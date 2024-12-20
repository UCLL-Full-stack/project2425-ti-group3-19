import Link from 'next/link';
import Header from '@/components/header';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import userService from '@/services/userService';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RegistrationForm from '@/components/register/registrationForm';
import AlertMessage from '@/components/alerts/alertMessage';

export default function Register() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();
    const { t } = useTranslation();

    const handleSubmit = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await userService.registerNewUser(firstName, lastName, email, password, role);
            const newUser = await response.json();
            console.log('User registered successfully:', newUser);
            setSuccessMessage('Registering successful!');
            setTimeout(() => router.push('/login'), 1000);
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>{t('register.title')}</h2>
                <AlertMessage message={errorMessage} type="danger" />
                <AlertMessage message={successMessage} type="success" />
                <RegistrationForm onSubmit={handleSubmit} />
                <p className="mt-3">
                    {t('register.alreadyAccount')} <Link href="/login">{t('register.loginHere')}</Link>.
                </p>
            </div>
        </>
    );
}

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;
    const translations = await serverSideTranslations(locale ?? "en", ["common"]);
    return {
        props: {
            ...translations
        },
    };
};
