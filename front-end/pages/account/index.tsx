import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { getUserIdFromToken } from '@/services/jwtdecode';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface Order {
    id: number;
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: any[];
    orderReferentie: string;
}

interface Subscription {
    id: number;
    startDate: Date;
    endDate: Date;
    subtype: string;
    region: string;
    orderId: string;
}

interface Ticket {
    id: number;
    date: Date;
    price: number;
    startStation: string;
    desStation: string;
    orderId: string;
}
interface Beurtenkaart {
    id: number;
    beurten: number;
    price: number;
    valid: boolean;
    startDate: Date;
    endDate: Date;
    orderId: string;
}

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
        const authToken = localStorage.getItem('authToken');
        setToken(authToken);
        if (!authToken) {
            router.push('/login'); // Redirect to login if no token is found
            return;
        }

        const userId = getUserIdFromToken(authToken);
        setUserId(userId);
        if (userId) {
            fetchUserDetails(userId);
        } else {
            setError('Invalid token');
            setLoading(false);
        }
    }, [router]);

    const fetchOrders = async (userId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user-orders?userId=${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchSubscriptions = async (userId: number) => {
        try {
            // Fetch all subscriptions for the user
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/subsuser?userId=${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
            }

            const data = await response.json();
            setSubscriptions(data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    const fetchTickets = async (userId: number) => {
        try {
            // Fetch all subscriptions for the user
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/ticketuser?userId=${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tickets: ${response.statusText}`);
            }

            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const fetchBeurten = async (userId: number) => {
        try {
            // Fetch all subscriptions for the user
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/beurtenkaarten/beurtuser?userId=${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch beurtenkaarten: ${response.statusText}`);
            }

            const data = await response.json();
            setBeurten(data);
        } catch (error) {
            console.error('Error fetching beurtenkaarten:', error);
        }
    };

    const fetchUserDetails = async (userId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            setUser(data);

            // Fetch orders and subscriptions after fetching user details
            await fetchOrders(userId);
            await fetchSubscriptions(userId);
            await fetchTickets(userId);
            await fetchBeurten(userId);
        } catch (error) {
            setError((error as Error).message || 'An error occurred while fetching user data.');
        } finally {
            setLoading(false);
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
                {tickets.length > 0 ? (
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>beurtenkaart ID</th>
                                <th>beurten</th>
                                <th>Price</th>
                                <th>Start date</th>
                                <th>end date</th>
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
