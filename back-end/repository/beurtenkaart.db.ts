import { Beurtenkaart } from '../model/beurtenkaart'; // Assuming you have a Beurtenkaart model
import orderService from '../service/order.service';

const beurtenkaarten: Beurtenkaart[] = [];

// Function to retrieve all beurtenkaarten
const getAllBeurtenkaarten = (): Beurtenkaart[] => {
    return beurtenkaarten;
};

// Function to retrieve a beurtenkaart by ID
const getBeurtenkaartById = (id: number): Beurtenkaart | null => {
    const beurtenkaart = beurtenkaarten.find((bk) => bk.getId() === id);
    return beurtenkaart || null;
};

// Function to save a new beurtenkaart
const saveBeurtenkaart = (beurtenkaart: Beurtenkaart): Beurtenkaart => {
    beurtenkaarten.push(beurtenkaart); // Save the Beurtenkaart instance directly
    return beurtenkaart;
};

const findBeurtenByUserId = async (userId: string): Promise<Beurtenkaart[]> => {
    var userIdN: number = +userId;
    const orders = await orderService.getUserOrders(userIdN);
    console.log(orders);
    const orderIds = orders.map(order => order.getorderReferentie());
    const userBeurten = beurtenkaarten.filter(beurten =>
        orderIds.includes(beurten.getOrderId())
    );
    return userBeurten;
}

// Export the repository functions as an object for easy import
export default {
    getAllBeurtenkaarten,
    getBeurtenkaartById,
    saveBeurtenkaart,
    findBeurtenByUserId,
};