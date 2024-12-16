import { Order } from '../model/order';
import { Promotion } from '../model/promotion';
import { User } from '../model/user';
import {v4 as uuidv4} from "uuid"; // Import User type

const orders: Order[] = []; // In-memory storage for orders

// Function to save a new order
const saveOrder = (orderData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: Promotion[];
    orderReferentie: string;
}): Order => {

    const parsedOrderDate = new Date(orderData.orderDate);

    if (isNaN(parsedOrderDate.getTime())) {
        throw new Error('Invalid order date');
    }

    // Create a new order instance
    const newOrder = new Order({
        orderDate: parsedOrderDate,
        product: orderData.product,
        price: orderData.price,
        user: orderData.user, // Use the full user object passed in
        promotions: orderData.promotions,
        orderReferentie: orderData.orderReferentie,
    });

    // Optionally validate the new order data
    try {
        newOrder.validate({
            orderDate: parsedOrderDate,
            product: orderData.product,
            price: orderData.price,
            user: orderData.user, // Pass the full user object
            promotions: orderData.promotions,
            orderReferentie: orderData.orderReferentie,
        });
    } catch (validationError) {
        throw new Error(`Validation error: ${(validationError as Error).message}`);
    }

    // Assign a unique ID to the order
    newOrder['id'] = orders.length + 1;

    // Add the new order to the orders array
    orders.push(newOrder);

    return newOrder;
};

// Function to retrieve an order by ID
const getOrderById = (id: number): Order | null => {
    const order = orders.find(order => order.getOrderId() === id);
    return order || null;
};

// Function to retrieve all orders
const getAllOrders = (): Order[] => {
    return orders;
};

const getUserOrders = (userId: number): Order[] => {
    return orders.filter(order => order.getUser().getId() === userId);
};


// Export the repository functions as an object for easy import
export default {
    saveOrder,
    getOrderById,
    getAllOrders,
    getUserOrders,
};
