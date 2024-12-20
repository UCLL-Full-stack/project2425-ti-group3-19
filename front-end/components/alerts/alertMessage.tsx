interface AlertMessageProps {
    message: string;
    type: 'success' | 'danger';
}

const AlertMessage = ({ message, type }: AlertMessageProps) => {
    if (!message) return null;

    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

    return <div className={`alert ${alertClass}`}>{message}</div>;
};

export default AlertMessage;
