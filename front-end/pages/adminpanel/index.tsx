// pages/admin-panel.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import OrdersService from '@/services/OrderService';
import userService from '@/services/userService';
import { Order, User } from '@/types';
import { getUserIdFromToken } from '@/services/jwtdecode';
import OrderTable from '@/components/orderTableAll';
import UserTable from '@/components/userTable';
import AlertMessage from '@/components/alerts/alertMessage';  // Use AlertMessage component

export default function AdminPanel() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
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
        fetchUserDetails(userId, authToken);
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
      const fetchedUsers = await userService.getAllUsers(token);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to load users. Please try again.');
    }
  };

  const fetchUserDetails = async (userId: number, token: string) => {
    try {
      const fetchedUserDetail = await userService.getUserByID(userId, token);
      if (fetchedUserDetail.role === 'user') {
        router.push('/');
      }
      setRole(fetchedUserDetail.role);
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
      await userService.updateUserRole(userId, newRole, token);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setSuccessMessage('Role updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating role:', error);
      setErrorMessage('Failed to update role. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
      router.reload();
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2>Admin Panel</h2>

        {/* Show success or error message */}
        {errorMessage && <AlertMessage message={errorMessage} type="danger" />}
        {successMessage && <AlertMessage message={successMessage} type="success" />}
        
        {/* Orders Section */}
        <h3>All Orders</h3>
        <OrderTable orders={orders} />

        {/* Users Section */}
        <h3>All Users</h3>
        <UserTable
          users={users}
          loading={loading}
          role={role}
          handleRoleChange={handleRoleChange}
        />
      </div>
    </>
  );
}
