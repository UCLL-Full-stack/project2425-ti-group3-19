import { Subscription } from '../model/subscription'; // Assuming you have a Subscription model
import orderService from '../service/order.service';

const subscriptions: Subscription[] = [];

// Function to retrieve all subscriptions
const getAllSubscriptions = (): Subscription[] => {
    return subscriptions;
};

// Function to retrieve a subscription by ID
const getSubscriptionById = (id: number): Subscription | null => {
    const subscription = subscriptions.find((sub) => sub.getId() === id);
    return subscription || null;
};

// Function to save a new subscription
const saveSubscription = (subscription: Subscription): Subscription => {
    subscriptions.push(subscription); // Save the Subscription instance directly
    return subscription;
};

const getSubscriptionByReferentie = (orderReferentie: string) => {
    return subscriptions.find(subscription => subscription.getOrderId() === orderReferentie);
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