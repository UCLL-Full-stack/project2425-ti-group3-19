import { Beurtenkaart } from '../model/beurtenkaart'; // Assuming you have a Beurtenkaart model
import orderService from '../service/order.service';
import database from '../util/database';

const beurtenkaarten: Beurtenkaart[] = [];

// Function to retrieve all beurtenkaarten
const getAllBeurtenkaarten = async (): Promise<Beurtenkaart[]> => {
    try {
        const beurtenPrisma = await database.beurtenkaart.findMany();
        return beurtenPrisma.map((beurtenPrisma) => Beurtenkaart.from(beurtenPrisma))
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

// Function to retrieve a beurtenkaart by ID
const getBeurtenkaartById = async (id: number): Promise<Beurtenkaart | null> => {
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
const saveBeurtenkaart = async ({ id,beurten,price,valid,startDate, endDate, orderId }: Beurtenkaart): Promise<Beurtenkaart> => {
    try {
        const beurtenPrisma = await database.beurtenkaart.create({
            data: {
                beurten,
                price,
                valid,
                startDate,
                endDate,
                orderId,
            },
        });
        return Beurtenkaart.from(beurtenPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const findBeurtenByUserId = async (userId: string): Promise<Beurtenkaart[]> => {
    const userIdN: number = +userId; // Convert userId to number if needed

    const ordersPrisma = await database.order.findMany({
        where: {
            userId: userIdN,
        },
        select: {
            orderReferentie: true, 
        },
    });

    const orderReferenties = ordersPrisma.map(order => order.orderReferentie);

    const beurtenPrisma = await database.beurtenkaart.findMany({
        where: {
            orderId: { in: orderReferenties },
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