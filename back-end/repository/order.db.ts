import { Order } from '../model/order';
import { Promotion } from '../model/promotion';
import { User } from '../model/user'; // Import User type

const orders: Order[] = []; // In-memory storage for orders

// Function to save a new order
const saveOrder = (orderData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User;
    promotions: Promotion[];
}): Order => {
    // Create a new order instance
    const newOrder = new Order({
        id: orders.length + 1,
        orderDate: orderData.orderDate,
        product: orderData.product,
        price: orderData.price,
        user: orderData.user, // Use the full user object passed in
        promotions: orderData.promotions,
    });

    // Optionally validate the new order data
    try {
        newOrder.validate({
            orderDate: orderData.orderDate,
            product: orderData.product,
            price: orderData.price,
            user: orderData.user, // Pass the full user object
            promotions: orderData.promotions,
        });
    } catch (validationError) {
        throw new Error(`Validation error: ${(validationError as Error).message}`);
    }

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

// Export the repository functions as an object for easy import
export default {
    saveOrder,
    getOrderById,
    getAllOrders,
};
