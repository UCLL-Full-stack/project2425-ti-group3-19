import { Order } from '../model/order';
import {v4 as uuidv4} from "uuid"; // Import User type
import database from '../util/database';
import { User } from '../model/user';
import { Promotion } from '../model/promotion';

// Function to save a new order
const saveOrder = async (orderData: {
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

    // Create a new order instance
    const createdOrder = await database.order.create({
        data: {
            orderDate: parsedOrderDate,
            product: orderData.product,
            price: orderData.price,
            user: {
                connect: { id: orderData.user.getId() }, 
            },
            orderReferentie: orderData.orderReferentie,
            promotions: {
                connect: orderData.promotions.map((promotion) => ({
                    id: promotion.getId(), 
                })),
            },
        },
        include: {
            user: true, 
            promotions: true, 
        },
    });

    return Order.from({
        ...createdOrder,
        user: createdOrder.user,
        promotions: createdOrder.promotions,
    });
};

// Function to retrieve an order by ID
const getOrderById = async ({ id }: { id: string }): Promise<Order | null> => {
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

// Function to retrieve orders for a specific user
const getUserOrders = async (userId: number): Promise<Order[]> => {
    try {
        const userOrdersPrisma = await database.order.findMany({
            where: { 
                userId: userId 
            },
            include: {
                user: true,
                promotions: true
            }
        });
        return userOrdersPrisma.map((orderPrisma) => Order.from(orderPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


// Export the repository functions as an object for easy import
export default {
    saveOrder,
    getOrderById,
    getAllOrders,
    getUserOrders,
};
