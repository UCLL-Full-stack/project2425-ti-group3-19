import { Beurtenkaart } from '../model/beurtenkaart';
import { Order } from "../model/order";

const beurtenkaarten: Beurtenkaart[] = [];

// Function to save a new subscription
const saveBeurtenkaart = (beurtenkaartData: {
    beurten: number;
    price: number;
    valid: boolean;
    startDate: Date;
    endDate: Date;
    order: Order;
}): Beurtenkaart => {
    // Create a new subscription instance
    const newBeurtenkaart = new Beurtenkaart({
        id: beurtenkaarten.length + 1, // Generate a unique ID
        beurten: beurtenkaartData.beurten,
        price: beurtenkaartData.price,
        valid: beurtenkaartData.valid,
        startDate: beurtenkaartData.startDate,
        endDate: beurtenkaartData.endDate,
        order: beurtenkaartData.order,
    });

    // Optionally validate the new subscription data (already done in the constructor)
    try {
        newBeurtenkaart.validate({
            id: newBeurtenkaart.getId(),
            beurten: newBeurtenkaart.getBeurten(),
            price: newBeurtenkaart.getPrice(),
            valid: newBeurtenkaart.isValid(),
            startDate: newBeurtenkaart.getStartDate(),
            endDate: newBeurtenkaart.getEndDate(),
            order: newBeurtenkaart.getOrder(),
        });
    } catch (validationError) {
        throw new Error(`Validation error: ${(validationError as Error).message}`);
    }

    // Add the new subscription to the subscriptions array
    beurtenkaarten.push(newBeurtenkaart);

    return newBeurtenkaart;
};

// Function to retrieve a subscription by ID
const getBeurtenkaartById = (id: number): Beurtenkaart | null => {
    const beurtenkaart = beurtenkaarten.find(beurtenkaart => beurtenkaart.getId() === id);
    return beurtenkaart || null;
};

// Function to retrieve all subscriptions
const getAllBeurtenkaarten = (): Beurtenkaart[] => {
    return beurtenkaarten;
};

export default {
    saveBeurtenkaart,
    getBeurtenkaartById,
    getAllBeurtenkaarten,
}