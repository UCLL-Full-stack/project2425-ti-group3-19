import promotionService from '../service/promo.service'; // Assuming the service is located here
import promotionRepository from '../repository/promo.db'; // Assuming the repository is located here

// Mock the promotionRepository methods
jest.mock('../repository/promo.db', () => ({
    findPromotionByCode: jest.fn(),
    addPromotion: jest.fn()
}));

describe('promotionService', () => {
  // Test for validatePromotionCode
  describe('validatePromotionCode', () => {
    it('should return a promotion when the code is valid', async () => {
      const mockPromotion = {
        id: 1,
        code: 'DISCOUNT10',
        discount: 10,
        startDate: new Date(),
        endDate: new Date(),
      };

      // Mock the repository method to return a promotion
      (promotionRepository.findPromotionByCode as jest.Mock).mockResolvedValue(mockPromotion);

      const result = await promotionService.validatePromotionCode('DISCOUNT10');

      expect(result).toEqual(mockPromotion);
      expect(promotionRepository.findPromotionByCode).toHaveBeenCalledWith('DISCOUNT10');
    });

    it('should return null if the promotion code is invalid', async () => {
      // Mock the repository method to return null
      (promotionRepository.findPromotionByCode as jest.Mock).mockResolvedValue(null);

      const result = await promotionService.validatePromotionCode('INVALIDCODE');

      expect(result).toBeNull();
      expect(promotionRepository.findPromotionByCode).toHaveBeenCalledWith('INVALIDCODE');
    });
  });

  // Test for addPromotionToDB
  describe('addPromotionToDB', () => {
    it('should add a promotion to the database', async () => {
      const mockPromotionData = {
        code: 'SUMMER20',
        discount: 20,
        startDate: new Date(),
        endDate: new Date(),
      };

      const mockAddedPromotion = {
        id: 1,
        ...mockPromotionData,
      };

      // Mock the repository method to return the added promotion
      (promotionRepository.addPromotion as jest.Mock).mockResolvedValue(mockAddedPromotion);

      const result = await promotionService.addPromotionToDB(mockPromotionData);

      expect(result).toEqual(mockAddedPromotion);
      expect(promotionRepository.addPromotion).toHaveBeenCalledWith(mockPromotionData);
    });
  });
});
