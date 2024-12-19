import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import OrdersService from '@/services/OrderService';
import userService from '@/services/userService';
import { Order, User } from '@/types';
import { getUserIdFromToken } from '@/services/jwtdecode';
import {Role} from "@/types";

export default function AdminPanel() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]); // New state for users
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            router.push('/login');
        } else {
            setToken(authToken);
            fetchOrders(authToken);
            fetchUsers(authToken);
            const userId = getUserIdFromToken(authToken);
            if (userId) {
                console.log(userId);
                fetchUserDetails(userId);
            }
        }
    }, [router]);

    // Fetch orders
    const fetchOrders = async (token: string) => {
        try {
            const fetchedOrders = await OrdersService.getAllOrders(token);
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setErrorMessage('Failed to load orders. Please try again.');
        }
    };

    // Fetch users
    const fetchUsers = async (token: string) => {
        try {
            const fetchedUsers = await userService.getAllUsers(token); // Assume this function exists
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMessage('Failed to load users. Please try again.');
        }
    };

    const fetchUserDetails = async (userId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            console.log(data);
            setUser(data);
            setRole(data.role);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    // Handle role update
    const handleRoleChange = async (userId: number, newRole: string) => {
        if (!token) return;
        setLoading(true);

        try {
            await userService.updateUserRole(userId, newRole, token); // Call the API to update the role
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            setErrorMessage('');
        } catch (error) {
            console.error('Error updating role:', error);
            setErrorMessage('Failed to update role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Render orders table
    const renderOrdersTable = () => {
        if (orders.length === 0) {
            return <div className="alert alert-info mt-4">No orders available.</div>;
        }

        return (
            <table className="table table-bordered table-hover mt-4">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Customer</th>
                        <th>Order Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>{order.product}</td>
                            <td>{order.price.toFixed(2)} USD</td>
                            <td>
                                {order.user
                                    ? `${order.user.firstName} ${order.user.lastName}`
                                    : 'N/A'}
                            </td>
                            <td>{order.orderReferentie}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Render users table with role update
    const renderUsersTable = () => {
        if (users.length === 0) {
            return <div className="alert alert-info mt-4">No users available.</div>;
        }

        return (
            <table className="table table-bordered table-hover mt-4">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => {if(user.id !== undefined){handleRoleChange(user.id, e.target.value)}}}
                                    disabled={loading || role !== 'admin'}
                                    className="form-select"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Admin Panel</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Orders Section */}
                <h3>Your Orders</h3>
                {renderOrdersTable()}

                {/* Users Section */}
                <h3>All Users</h3>
                {renderUsersTable()}
            </div>
        </>
    );
}
