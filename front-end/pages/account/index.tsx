import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { getUserIdFromToken } from '@/services/jwtdecode';
import { User, Order, Subscription, Ticket, Beurtenkaart } from '@/types';
import OrdersService from '@/services/OrderService';
import ticketService from '@/services/TicketService';
import SubscriptionService from '@/services/SubscriptionService';
import BeurtenkaartService from '@/services/BeurtenkaartService';
import userService from '@/services/userService';

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [beurten, setBeurten] = useState<Beurtenkaart[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const initializeUserData = async () => {
            const authToken = localStorage.getItem('authToken');
            setToken(authToken);

            if (!authToken) {
                router.push('/login');
                return;
            }

            const extractedUserId = getUserIdFromToken(authToken);
            setUserId(extractedUserId);

            if (extractedUserId) {
                try {
                    await fetchAllUserData(extractedUserId, authToken);
                } catch (error) {
                    setError((error as Error).message || 'An error occurred while fetching user data.');
                }
            } else {
                setError('Invalid token');
            }

            setLoading(false);
        };

        initializeUserData();
    }, [router]);

    const fetchAllUserData = async (userId: number, token: string) => {
        try {
            const userData = await userService.getUserByID(userId);
            setUser(userData);

            const ordersData = await OrdersService.getUserOrders({ userId, token });
            const subscriptionsData = await SubscriptionService.getUserSubscriptions({ userId, token });
            const ticketsData = await ticketService.getUserTickets({ userId, token });
            const beurtenData = await BeurtenkaartService.getUserBeurtenKaarten({ userId, token });

            setOrders(ordersData);
            setSubscriptions(subscriptionsData);
            setTickets(ticketsData);
            setBeurten(beurtenData);

        } catch (error) {
            throw new Error((error as Error).message || 'Failed to fetch user data');
        }
    };

    const isActive = (endDate: Date) => {
        const currentDate = new Date();
        return currentDate <= new Date(endDate);
    };

    if (loading) {
        return <div className="loading text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="error alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="mb-4">Account Information</h2>

                {user ? (
                    <div className="card p-4 shadow-sm mb-4">
                        <h3 className="mb-3">Welcome, {user.firstName} {user.lastName}</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-warning">User data is not available.</div>
                )}

                <h3 className="mb-4">Your Orders</h3>
                {orders.length > 0 ? (
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Order Date</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Order Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>{order.product}</td>
                                    <td>{order.price.toFixed(2)} USD</td>
                                    <td>{order.orderReferentie}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-info">You have no orders yet.</div>
                )}

                <h3 className="mb-4">Your Subscriptions</h3>
                {subscriptions.length > 0 ? (
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
                ) : (
                    <div className="alert alert-info">You have no subscriptions.</div>
                )}

                <h3 className="mb-4">Your Tickets</h3>
                {tickets.length > 0 ? (
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
                ) : (
                    <div className="alert alert-info">You have no tickets.</div>
                )}

                <h3 className="mb-4">Your Beurtenkaarten</h3>
                {beurten.length > 0 ? (
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
                ) : (
                    <div className="alert alert-info">You have no beurtenkaarten.</div>
                )}
            </div>
        </>
    );
}