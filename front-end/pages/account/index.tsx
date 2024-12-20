// pages/account.tsx
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
import UserInfo from '@/components/userInfo';
import OrdersTable from '@/components/orderTableAll';
import SubscriptionsTable from '@/components/subscriptionsTable';
import TicketsTable from '@/components/ticketsTable';
import BeurtenkaartenTable from '@/components/beurtenkaartenTable';
import AlertMessage from '@/components/alerts/alertMessage';

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
            const userData = await userService.getUserByID(userId, token);
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
            setError((error as Error).message || 'Failed to fetch user data');
        }
    };

    const isActive = (endDate: Date) => {
        const currentDate = new Date();
        return currentDate <= new Date(endDate);
    };

    if (loading) {
        return <AlertMessage message="Loading..." type="success" />;
    }

    if (error) {
        return <AlertMessage message={error} type="danger" />;
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="mb-4">Account Information</h2>
                <UserInfo user={user} />
                <h3 className="mb-4">Your Orders</h3>
                <OrdersTable orders={orders} />
                <h3 className="mb-4">Your Subscriptions</h3>
                <SubscriptionsTable subscriptions={subscriptions} isActive={isActive} />
                <h3 className="mb-4">Your Tickets</h3>
                <TicketsTable tickets={tickets} />
                <h3 className="mb-4">Your Beurtenkaarten</h3>
                <BeurtenkaartenTable beurten={beurten} />
            </div>
        </>
    );
}
