import { Subscription } from '../model/subscription'; // Assuming the Subscription class is in the model directory
import { Order } from '../model/order';
import orderRepository from '../repository/order.db'; // Assuming this file is in the same directory

const subscriptions: Subscription[] = []; // In-memory storage for subscriptions

// Function to save a new subscription
const saveSubscription = (subscriptionData: {
    region: string;
    subtype: string;
    startDate: Date;
    endDate: Date;
    order: Order;
}): Subscription => {
    // Create a new subscription instance
    const newSubscription = new Subscription({
        id: subscriptions.length + 1, // Generate a unique ID
        region: subscriptionData.region,
        subtype: subscriptionData.subtype,
        startDate: subscriptionData.startDate,
        endDate: subscriptionData.endDate,
        order: subscriptionData.order,
    });

    // Optionally validate the new subscription data (already done in the constructor)
    try {
        newSubscription.validate({
            id: newSubscription.getId(),
            region: newSubscription.getRegion(),
            subtype: newSubscription.getSubtype(),
            startDate: newSubscription.getStartDate(),
            endDate: newSubscription.getEndDate(),
            order: newSubscription.getOrder(),
        });
    } catch (validationError) {
        throw new Error(`Validation error: ${(validationError as Error).message}`);
    }

    // Add the new subscription to the subscriptions array
    subscriptions.push(newSubscription);

    return newSubscription;
};

// Function to retrieve a subscription by ID
const getSubscriptionById = (id: number): Subscription | null => {
    const subscription = subscriptions.find(subscription => subscription.getId() === id);
    return subscription || null;
};

// Function to retrieve all subscriptions
const getAllSubscriptions = (): Subscription[] => {
    return subscriptions;
};

// Export the repository functions as an object for easy import
export default {
    saveSubscription,
    getSubscriptionById,
    getAllSubscriptions,
};
