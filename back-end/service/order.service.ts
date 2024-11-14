// src/service/orderService.ts
import { Order } from '../model/order';
import orderRepository from '../repository/order.db';
import { User } from '../model/user';
import { Promotion } from '../model/promotion';

const createOrder = async (orderData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: Promotion[];
}): Promise<Order> => {

    const parsedOrderDate = new Date(orderData.orderDate);

    if (isNaN(parsedOrderDate.getTime())) {
        throw new Error('Invalid order date');
    }
    // Create a new Order instance using the provided data
    const order = new Order({
        ...orderData,
        orderDate: parsedOrderDate,  // Ensure it's passed as a Date object
    });

    // Save the order using the repository and return the saved order
    return await orderRepository.saveOrder({
        orderDate: order.getOrderDate(),
        product: order.getProduct(),
        price: order.getPrice(),
        user: order.getUser(),
        promotions: order.getPromotions()
    });
};

const createMultipleOrders = async (ordersData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: Promotion[];
}[]): Promise<Order[]> => {
    const orders: Order[] = [];
    for (const data of ordersData) {
        const order = await createOrder(data);  // Reuse the single order creation function
        orders.push(order);
    }
    return orders;
};

//Method to get all orders
const getAllOrders = (): Order[] => {
    return orderRepository.getAllOrders();
};

export default {
    getAllOrders,
    createOrder,
    createMultipleOrders,
    // other order-related methods...
};
