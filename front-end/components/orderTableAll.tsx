
import React from 'react';
// components/OrderTable.tsx
import { Order } from '@/types';

interface OrderTableProps {
  orders: Order[];
}

const OrderTable = ({ orders }: OrderTableProps) => {
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
            <td>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}</td>
            <td>{order.orderReferentie}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
