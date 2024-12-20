import { useState, FormEvent } from 'react';
import { useTranslation } from 'next-i18next';

interface RegistrationFormProps {
    onSubmit: (firstName: string, lastName: string, email: string, password: string, role: string) => void;
}

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { t } = useTranslation();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(firstName, lastName, email, password, role);
    };

    return (
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
        </form>
    );
};

export default RegistrationForm;
