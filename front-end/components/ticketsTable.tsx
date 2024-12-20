// components/TicketsTable.tsx
import { Ticket } from '@/types';

interface TicketsTableProps {
    tickets: Ticket[];
}

const TicketsTable = ({ tickets }: TicketsTableProps) => {
    if (tickets.length === 0) {
        return <div className="alert alert-info">You have no tickets.</div>;
    }

    return (
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>Ticket ID</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Start Station</th>
                    <th>Destination Station</th>
                    <th>Order Reference</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{new Date(ticket.date).toLocaleDateString()}</td>
                        <td>{ticket.price}</td>
                        <td>{ticket.startStation}</td>
                        <td>{ticket.desStation}</td>
                        <td>{ticket.orderId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TicketsTable;
