// components/BeurtenkaartenTable.tsx
import { Beurtenkaart } from '@/types';

interface BeurtenkaartenTableProps {
    beurten: Beurtenkaart[];
}

const BeurtenkaartenTable = ({ beurten }: BeurtenkaartenTableProps) => {
    if (beurten.length === 0) {
        return <div className="alert alert-info">You have no beurtenkaarten.</div>;
    }

    return (
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>Beurtenkaart ID</th>
                    <th>Beurten</th>
                    <th>Price</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Order Reference</th>
                </tr>
            </thead>
            <tbody>
                {beurten.map(beurt => (
                    <tr key={beurt.id}>
                        <td>{beurt.id}</td>
                        <td>{beurt.beurten}</td>
                        <td>{beurt.price}</td>
                        <td>{new Date(beurt.startDate).toLocaleDateString()}</td>
                        <td>{new Date(beurt.endDate).toLocaleDateString()}</td>
                        <td>{beurt.orderId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BeurtenkaartenTable;
