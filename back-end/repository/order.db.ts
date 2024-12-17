import { Order } from '../model/order';
import {v4 as uuidv4} from "uuid"; // Import User type
import database from '../util/database';
import { User } from '../model/user';
import { Promotion } from '../model/promotion';
const orders: Order[] = []; // In-memory storage for orders

// Function to save a new order
const saveOrder = async (orderData: {
    orderDate: Date;
    product: string;
    price: number;
    user: User; // Accept the full User object
    promotions: Promotion[]; // Use promotionIds to connect promotions
    orderReferentie: string;
}): Promise<Order> => {
    const parsedOrderDate = new Date(orderData.orderDate);

    if (isNaN(parsedOrderDate.getTime())) {
        throw new Error('Invalid order date');
    }

    // Create a new order instance
    const createdOrder = await database.order.create({
        data: {
            orderDate: parsedOrderDate,
            product: orderData.product,
            price: orderData.price,
            user: {
                connect: { id: orderData.user.getId() }, // Connect using the user's ID
            },
            orderReferentie: orderData.orderReferentie,
            promotions: {
                connect: orderData.promotions.map((promotion) => ({
                    id: promotion.getId(), // Connect using each promotion's ID
                })),
            },
        },
        include: {
            user: true, // Include the user relation in the returned object
            promotions: true, // Include the promotions relation
        },
    });

    return Order.from({
        ...createdOrder,
        user: createdOrder.user,
        promotions: createdOrder.promotions,
    });
};

// Function to retrieve an order by ID
const getOrderById = async ({ id }: { id: number }): Promise<Order | null> => {
    try {
        const orderPrisma = await database.order.findUnique({
            where: { id },
        });

        return orderPrisma ? Order.from(orderPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


// Function to retrieve all orders
const getAllOrders = async ():Promise<Order[]> => {
    try {
        const ordersPrisma = await database.order.findMany({
            include: {user: true, promotions: true,},
        });
        return ordersPrisma.map((ordersPrisma)=> Order.from(ordersPrisma))
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.")
    }

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
