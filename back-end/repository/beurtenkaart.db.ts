import { Beurtenkaart } from '../model/beurtenkaart'; // Assuming you have a Beurtenkaart model
import orderService from '../service/order.service';
import database from '../util/database';

const beurtenkaarten: Beurtenkaart[] = [];

// Function to retrieve all beurtenkaarten
const getAllBeurtenkaarten = async(): Promise<Beurtenkaart[]> => {
    try {
        const beurtenPrisma = await database.beurtenkaart.findMany();
        return beurtenPrisma.map((beurtenPrisma) => Beurtenkaart.from(beurtenPrisma))
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

// Function to retrieve a beurtenkaart by ID
const getBeurtenkaartById = async(id: number): Promise<Beurtenkaart | null> => {
    try {
        const beurtenPrisma = await database.beurtenkaart.findUnique({
            where: { id },
        });
        return beurtenPrisma ? Beurtenkaart.from(beurtenPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }
};

// Function to save a new beurtenkaart
const saveBeurtenkaart = async(beurtenkaart: Beurtenkaart): Promise<Beurtenkaart> => {
    const beurtenPrisma = await database.beurtenkaart.create({
        data: {
            id: beurtenkaart.getId(),
            beurten: beurtenkaart.getBeurten(),
            price: beurtenkaart.getPrice(),
            valid: beurtenkaart.isValid(),
            startDate: beurtenkaart.getStartDate(),
            endDate: beurtenkaart.getEndDate(),
            orderId: beurtenkaart.getOrderId(),
        },
    });
    return Beurtenkaart.from(beurtenPrisma);
};

const findBeurtenByUserId = async (userId: string): Promise<Beurtenkaart[]> => {
    const userIdN: number = +userId; // Convert userId to number if needed

    const ordersPrisma = await database.order.findMany({
        where: {
            userId: userIdN, 
        },
        select: {
            id: true, 
        },
    });

    const orderIds = ordersPrisma.map(order => order.id);

    const beurtenPrisma = await database.beurtenkaart.findMany({
        where: {
            orderId: { in: orderIds },
        },
    });

    return beurtenPrisma.map(beurtenkaart => Beurtenkaart.from(beurtenkaart));
};

// Export the repository functions as an object for easy import
export default {
    getAllBeurtenkaarten,
    getBeurtenkaartById,
    saveBeurtenkaart,
    findBeurtenByUserId,
};