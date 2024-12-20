import React from 'react';

interface OrderTableProps {
    orderList: any[];
    handleEditOrder: (orderId: number) => void;
    handleRemoveOrder: (orderId: number) => void;
}

const OrderTable = ({ orderList, handleEditOrder, handleRemoveOrder }: OrderTableProps) => (
    <table className="table mt-4">
        <thead>
            <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Order Date</th>
                <th>Price</th>
                <th>Region</th>
                <th>Begin Station</th>
                <th>End Station</th>
                <th>Subscription Length</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {orderList.map((order) => (
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.product}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>${order.price.toFixed(2)}</td>
                    <td>{order.region}</td>
                    <td>{order.beginStation}</td>
                    <td>{order.endStation}</td>
                    <td>{order.subscriptionLength}</td>
                    <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditOrder(order.id)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOrder(order.id)}>Remove</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default OrderTable;
