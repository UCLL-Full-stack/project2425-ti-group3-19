import promotionRepository from '../repository/promo.db';

const validatePromotionCode = async (code: string) => {
    return await promotionRepository.findPromotionByCode(code);
};

const addPromotionToDB = async (promotionData: any) => {
    return await promotionRepository.addPromotion(promotionData);
};

export default {
    validatePromotionCode, addPromotionToDB
};
