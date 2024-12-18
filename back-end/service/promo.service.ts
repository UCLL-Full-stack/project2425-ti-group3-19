import promotionRepository from '../repository/promo.db';

const validatePromotionCode = async (code: string) => {
    return await promotionRepository.findPromotionByCode(code);
};

export default {
    validatePromotionCode,
};
