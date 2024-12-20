// components/SubscriptionsTable.tsx
import { Subscription } from '@/types';

interface SubscriptionsTableProps {
    subscriptions: Subscription[];
    isActive: (endDate: Date) => boolean;
}

const SubscriptionsTable = ({ subscriptions, isActive }: SubscriptionsTableProps) => {
    if (subscriptions.length === 0) {
        return <div className="alert alert-info">You have no subscriptions.</div>;
    }

    return (
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>Subscription ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Subscription Type</th>
                    <th>Region</th>
                    <th>Order Reference</th>
                </tr>
            </thead>
            <tbody>
                {subscriptions.map(sub => (
                    <tr key={sub.id}>
                        <td>{sub.id}</td>
                        <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td>{new Date(sub.endDate).toLocaleDateString()}</td>
                        <td>{isActive(sub.endDate) ? 'Active' : 'Expired'}</td>
                        <td>{sub.subtype}</td>
                        <td>{sub.region}</td>
                        <td>{sub.orderId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SubscriptionsTable;
