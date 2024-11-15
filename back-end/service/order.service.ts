// src/service/orderService.ts
import { Order } from '../model/order';
import orderRepository from '../repository/order.db';
import { User } from '../model/user';
import { Promotion } from '../model/promotion';
import { v4 as uuidv4 } from 'uuid';

const createOrder = async (orderData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: Promotion[];
    orderReferentie: string;
}): Promise<Order> => {

    const parsedOrderDate = new Date(orderData.orderDate);

    if (isNaN(parsedOrderDate.getTime())) {
        throw new Error('Invalid order date');
    }
    // Create a new Order instance using the provided data
    const order = new Order({
        ...orderData,
        orderDate: parsedOrderDate,
    });

    // Save the order using the repository and return the saved order
    return orderRepository.saveOrder({
        orderDate: order.getOrderDate(),
        product: order.getProduct(),
        price: order.getPrice(),
        user: order.getUser(),
        promotions: order.getPromotions(),
        orderReferentie: order.getorderReferentie(),
    });
};

const createMultipleOrders = async (ordersData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: Promotion[];
}[]): Promise<Order[]> => {
    const orderReferentie = uuidv4();
    const orders: Order[] = [];
    for (const data of ordersData) {
        const order = await createOrder({...data, orderReferentie});  // Reuse the single order creation function
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
