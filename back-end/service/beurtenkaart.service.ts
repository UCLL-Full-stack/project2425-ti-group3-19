import { Beurtenkaart } from '../model/beurtenkaart'; // Assuming you have a Beurtenkaart model
import beurtenkaartRepository from '../repository/beurtenkaart.db';

const createBeurtenkaart = async (beurtenkaart: Beurtenkaart): Promise<Beurtenkaart> => {
    return beurtenkaartRepository.saveBeurtenkaart(beurtenkaart); // Save the Beurtenkaart instance directly
};

const getAllBeurtenkaarten = async (): Promise<Beurtenkaart[]> => {
    return beurtenkaartRepository.getAllBeurtenkaarten();
};

const getBeurtenkaartById = async (id: number): Promise<Beurtenkaart | null> => {
    return beurtenkaartRepository.getBeurtenkaartById(id);
};

export default {
    createBeurtenkaart,
    getAllBeurtenkaarten,
    getBeurtenkaartById,
};