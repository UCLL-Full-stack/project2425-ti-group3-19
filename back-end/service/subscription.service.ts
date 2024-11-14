import { Order } from "../model/order";
import { Subscription } from '../model/subscription';
import subscriptionRepository from '../repository/subscription.db'; // Adjusted to point to the right repository
import orderService from "./order.service";

const addSubscriptionToOrder = async (subscriptionData: {
    region: string;
    product: string; // This is the subtype of the subscription
    startDate: Date;
    endDate: Date;
    order: Order;
}): Promise<Subscription> => {
    // Create a new Subscription instance
    const subscription = new Subscription({
        region: subscriptionData.region,
        subtype: subscriptionData.product, // Map `product` to `subtype`
        startDate: subscriptionData.startDate,
        endDate: subscriptionData.endDate,
        order: subscriptionData.order,
    });

    // Save the subscription through the repository, which handles unique ID assignment
    return await subscriptionRepository.saveSubscription({
        region: subscription.getRegion(),
        subtype: subscription.getSubtype(),
        startDate: subscription.getStartDate(),
        endDate: subscription.getEndDate(),
        order: subscription.getOrder(), 
    });
};

//Method to get all subscriptions
const getAllSubscriptions = (): Subscription[] => {
    return subscriptionRepository.getAllSubscriptions();
};

export default {
    addSubscriptionToOrder,
    getAllSubscriptions,
};
