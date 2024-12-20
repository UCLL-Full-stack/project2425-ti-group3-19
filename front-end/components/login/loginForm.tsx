import { useState, FormEvent } from 'react';
import { useTranslation } from 'next-i18next';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(email, password);
    };

    return (
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
        </form>
    );
};

export default LoginForm;
