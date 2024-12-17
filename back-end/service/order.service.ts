// src/service/orderService.ts
import { Order } from '../model/order';
import orderRepository from '../repository/order.db';
import { User } from '../model/user';
import { Promotion } from '../model/promotion';
import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '../model/ticket';
import { Subscription } from '../model/subscription';
import { Beurtenkaart } from '../model/beurtenkaart';
import ticketService from './ticket.service';
import subscriptionService from './subscription.service';
import beurtenkaartService from './beurtenkaart.service';

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
    region: string;
    beginStation: string;
    endStation: string;
    subscriptionLength: string;
}[]): Promise<Order[]> => {
    const orderReferentie = uuidv4();
    const orders: Order[] = [];
    for (const data of ordersData) {
        const orderDate = data.orderDate instanceof Date ? data.orderDate : new Date(data.orderDate);
        let product;
        console.log(data);
        console.log(data.orderDate, typeof data.orderDate);
        switch (data.product) {
            case 'Ticket':
                product = new Ticket({
                id: orders.length + 1,
                date: orderDate,
                price: data.price,
                startStation: data.beginStation,
                desStation: data.endStation,
                orderId: orderReferentie,
                });
                await ticketService.createTicket(product);
                break;
            case 'Subscription':
                const endDate = calculateSubscriptionEndDate(orderDate, data.subscriptionLength);
                if (!endDate) throw new Error('Invalid subscription length');

                product = new Subscription({
                    id: orders.length + 1,
                    region: data.region,
                    subtype: data.subscriptionLength,
                    startDate: orderDate,
                    endDate,
                    orderId: orderReferentie,
                });
                await subscriptionService.createSubscription(product);
                break;
            case '10-Session Card':
                product = new Beurtenkaart({
                    id: orders.length + 1,
                    valid: true,
                    beurten: 10,
                    price: data.price,
                    startDate: orderDate,
                    endDate: orderDate,
                    orderId: orderReferentie,
                });
                await beurtenkaartService.createBeurtenkaart(product);
                break;
            default:
                throw new Error('Invalid product type');
        }
        const order = await createOrder({...data, orderReferentie});  // Reuse the single order creation function
        orders.push(order);
    }
    return orders;
};

const calculateSubscriptionEndDate = (startDate: Date, subscriptionLength: string): Date | null => {
    const endDate = new Date(startDate);

    switch (subscriptionLength) {
        case '1 Month':
            endDate.setMonth(startDate.getMonth() + 1);
            break;
        case '3 Months':
            endDate.setMonth(startDate.getMonth() + 3);
            break;
        case '6 Months':
            endDate.setMonth(startDate.getMonth() + 6);
            break;
        case '1 Year':
            endDate.setFullYear(startDate.getFullYear() + 1);
            break;
        default:
            return null; // Invalid subscription length
    }

    return endDate;
};

//Method to get all orders
const getAllOrders = async(): Promise<Order[]> => {
    return orderRepository.getAllOrders();
};

const getUserOrders = async(userId: number): Promise<Order[]> => {
    return orderRepository.getUserOrders(userId);
};

export default {
    getAllOrders,
    createOrder,
    createMultipleOrders,
    getUserOrders,
    // other order-related methods...
};
