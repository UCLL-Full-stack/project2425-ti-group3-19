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
    console.log(orderReferentie, "test hier");
    try {
        const subscription = await database.subscription.findFirst({
            where: {
                orderId: orderReferentie,
            },
        });

        console.log(subscription);

        return subscription ? Subscription.from(subscription) : null; 
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const findSubscriptionsByUserId = async (userId: string): Promise<Subscription[]> => {
    const userIdN: number = +userId; // Convert userId to number if needed

    const ordersPrisma = await database.order.findMany({
        where: {
            userId: userIdN, 
        },
        select: {
            orderReferentie: true, 
        },
    });

    console.log("Orders fetched for userId:", userIdN, ordersPrisma);

    const orderReferenties = ordersPrisma.map(order => order.orderReferentie);

    if (orderReferenties.length === 0) {
        console.log("No orders found for userId:", userIdN);
    }

    const subPrisma = await database.subscription.findMany({
        where: {
            orderId: { in: orderReferenties },
        },
    });

    console.log("Subscriptions fetched for orderIds:", orderReferenties, subPrisma);

    console.log("Subscriptions found for userId:", subPrisma.map(subscription => Subscription.from(subscription)));

    return subPrisma.map(subscription => Subscription.from(subscription));
};

// Export the repository functions as an object for easy import
export default {
    getAllSubscriptions,
    getSubscriptionById,
    saveSubscription,
    getSubscriptionByReferentie,
    findSubscriptionsByUserId,
};