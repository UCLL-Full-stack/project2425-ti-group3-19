    import Link from 'next/link';
import Header from '@/components/header';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import userService from '@/services/userService';
import { User } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role can be set as needed
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();
    const { t } = useTranslation();

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
                <h2>{t('register.title')}</h2> {/* Use translation for title */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">{t('register.firstName')}:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder={t('register.firstName')}
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">{t('register.lastName')}:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder={t('register.lastName')}
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">{t('register.email')}:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder={t('register.email')}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">{t('register.password')}:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder={t('register.password')}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">{t('register.registerButton')}</button>
                    <p className="mt-3">
                        {t('register.alreadyAccount')} <Link href="/login">{t('register.loginHere')}</Link>.
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

