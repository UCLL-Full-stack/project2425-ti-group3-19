import { Subscription } from '../model/subscription'; // Assuming you have a Subscription model
import orderService from '../service/order.service';
import database from '../util/database';

const subscriptions: Subscription[] = [];

// Function to retrieve all subscriptions
const getAllSubscriptions = async (): Promise<Subscription[]> => {
    try {
        const subPrisma = await database.subscription.findMany();
        return subPrisma.map((subPrisma) => Subscription.from(subPrisma))
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

// Function to retrieve a subscription by ID
const getSubscriptionById = async ({ id }: { id: number }): Promise<Subscription | null> => {
    try {
        const subPrisma = await database.subscription.findUnique({
            where: { id },
        });
        return subPrisma ? Subscription.from(subPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }
};

// Function to save a new subscription
const saveSubscription = async (subscription: Subscription): Promise<Subscription> => {
    const subPrisma = await database.subscription.create({
        data: {
            id: subscription.getId(),
            region: subscription.getRegion(),
            subtype: subscription.getSubtype(),
            startDate: subscription.getStartDate(), 
            endDate: subscription.getEndDate(),
            orderId: subscription.getOrderId(),
        },
    });
    return Subscription.from(subPrisma);
};

const getSubscriptionByReferentie = async (orderReferentie: string) => {
    try {
        const subscription = await database.subscription.findFirst({
            where: {
                orderId: orderReferentie,
            },
        });

        return subscription ? Subscription.from(subscription) : null; 
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const findSubscriptionsByUserId = async (userId: string): Promise<Subscription[]> => {
    var userIdN: number = +userId;
    const orders = await orderService.getUserOrders(userIdN);
    console.log(orders);
    const orderIds = orders.map(order => order.getorderReferentie());
    const userSubscriptions = subscriptions.filter(subscription =>
        orderIds.includes(subscription.getOrderId())
    );
    return userSubscriptions;
}

// Export the repository functions as an object for easy import
export default {
    getAllSubscriptions,
    getSubscriptionById,
    saveSubscription,
    getSubscriptionByReferentie,
    findSubscriptionsByUserId,
};