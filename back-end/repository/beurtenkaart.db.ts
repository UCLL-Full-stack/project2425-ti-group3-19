import { Beurtenkaart } from '../model/beurtenkaart'; // Assuming you have a Beurtenkaart model

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

// Export the repository functions as an object for easy import
export default {
    getAllBeurtenkaarten,
    getBeurtenkaartById,
    saveBeurtenkaart,
};