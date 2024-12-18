import { Subscription } from '../model/subscription'; // Assuming you have a Subscription model
import subscriptionRepository from '../repository/subscription.db';

const createSubscription = async (subscription: Subscription): Promise<Subscription> => {
    return subscriptionRepository.saveSubscription(subscription); // Save the Subscription instance directly
};

const getAllSubscriptions = async (): Promise<Subscription[]> => {
    return subscriptionRepository.getAllSubscriptions();
};

const getSubscriptionById = async (id: number): Promise<Subscription | null> => {
    const subscription = subscriptionRepository.getSubscriptionById({ id });
    if (!subscription) {
        throw new Error(`Subscription with id ${id} does not exist.`);
    }
    return subscription
};

const getSubscriptionByReferentie = async (orderReferentie: string) => {
    return await subscriptionRepository.getSubscriptionByReferentie(orderReferentie);
};

const getSubscriptionsByUserId = async (userId: string): Promise<Subscription[]> => {
    return await subscriptionRepository.findSubscriptionsByUserId(userId);
}

export default {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    getSubscriptionByReferentie,
    getSubscriptionsByUserId,
};