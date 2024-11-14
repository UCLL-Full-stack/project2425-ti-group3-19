import { Beurtenkaart } from '../model/beurtenkaart';
import { Order } from '../model/order';
import beurtenkaartRepository from '../repository/beurtenkaart.db';


const addBeurtenkaartToOrder = async (beurtenkaartData: {
    price: number;
    startDate: Date;
    endDate: Date;
    order: Order;
}): Promise<Beurtenkaart> => {
    // Create a new Subscription instance
    const beurtenkaart = new Beurtenkaart({
        beurten: 10,
        price: beurtenkaartData.price,
        valid: true,
        startDate: beurtenkaartData.startDate,
        endDate: beurtenkaartData.endDate,
        order: beurtenkaartData.order,
    });

    // Save the subscription through the repository, which handles unique ID assignment
    return await beurtenkaartRepository.saveBeurtenkaart({
        beurten: beurtenkaart.getBeurten(),
        price: beurtenkaart.getPrice(),
        valid: beurtenkaart.isValid(),
        startDate: beurtenkaart.getStartDate(),
        endDate: beurtenkaart.getEndDate(),
        order: beurtenkaart.getOrder(),
    });
};

const getAllBeurtenkaarten = (): Beurtenkaart[] => {
    return beurtenkaartRepository.getAllBeurtenkaarten();
};

export default{
    addBeurtenkaartToOrder,
    getAllBeurtenkaarten,
}