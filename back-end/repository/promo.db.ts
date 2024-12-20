import { PrismaClient } from '@prisma/client';
import { Promotion } from '../model/promotion';

const prisma = new PrismaClient();

const findPromotionByCode = async (code: string): Promise<Promotion | null> => {
    const promotion = await prisma.promotion.findFirst({
        where: { Code: code, IsActive: true },
        include: { orders: true },
    });

    return promotion ? Promotion.from(promotion) : null;
};

const getPromotionsByIds = async (ids: number[]): Promise<Promotion[]> => {
    const promotions = await prisma.promotion.findMany({
        where: {
            id: { in: ids }, // Filter promotions by the provided IDs
            IsActive: true, // Optionally, ensure they are active
        },
        include: { orders: true }, // Include related orders if necessary
    });

    return promotions.map(promotion => Promotion.from(promotion)); // Map to your Promotion model
};

const addPromotion = async (promotionData: any) => {
    return await prisma.promotion.create({ data: promotionData });
};

export default {
    findPromotionByCode,
    getPromotionsByIds,
    addPromotion,
};