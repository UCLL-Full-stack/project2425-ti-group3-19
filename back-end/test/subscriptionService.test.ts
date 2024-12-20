import subscriptionService from '../service/subscription.service'; // Import the service
import subscriptionRepository from '../repository/subscription.db'; // Import the mocked repository
import { Subscription } from '../model/subscription'; // Import the Subscription model
import { id } from 'date-fns/locale';

// Mock repository functions
jest.mock('../repository/subscription.db', () => ({
  saveSubscription: jest.fn(),
  getAllSubscriptions: jest.fn(),
  getSubscriptionById: jest.fn(),
  getSubscriptionByReferentie: jest.fn(),
  findSubscriptionsByUserId: jest.fn(),
}));

describe('subscriptionService', () => {
  // Corrected mockSubscriptionData
  const mockSubscriptionData = {
    id: 1,
    region: 'North',
    subtype: 'Premium',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    orderId: 'order-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Creating an instance of Subscription with the mock data
  const mockSubscription = new Subscription(mockSubscriptionData);

  // Mock repository methods
  beforeEach(() => {
    (subscriptionRepository.saveSubscription as jest.Mock).mockResolvedValue(mockSubscription);
    (subscriptionRepository.getAllSubscriptions as jest.Mock).mockResolvedValue([mockSubscription]);
    (subscriptionRepository.getSubscriptionById as jest.Mock).mockResolvedValue(mockSubscription);
    (subscriptionRepository.getSubscriptionByReferentie as jest.Mock).mockResolvedValue(mockSubscription);
    (subscriptionRepository.findSubscriptionsByUserId as jest.Mock).mockResolvedValue([mockSubscription]);
  });

  // Test createSubscription
  describe('createSubscription', () => {
    it('should create a new subscription and return it', async () => {
      const subscriptionData = {
        id: 1,
        region: 'North',
        subtype: 'Premium',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        orderId: 'order-123',
      };

      const createdSubscription = await subscriptionService.createSubscription(new Subscription(subscriptionData));

      expect(createdSubscription).toEqual(mockSubscription);
      expect(subscriptionRepository.saveSubscription).toHaveBeenCalledWith(expect.objectContaining(subscriptionData));
    });
  });

  // Test getAllSubscriptions
  describe('getAllSubscriptions', () => {
    it('should return an array of subscriptions', async () => {
      const subscriptions = await subscriptionService.getAllSubscriptions();

      expect(subscriptions).toEqual([mockSubscription]);
      expect(subscriptionRepository.getAllSubscriptions).toHaveBeenCalledTimes(1);
    });
  });

  // Test getSubscriptionById
  describe('getSubscriptionById', () => {
    it('should return the subscription if it exists', async () => {
      const subscription = await subscriptionService.getSubscriptionById(1);

      expect(subscription).toEqual(mockSubscription);
      expect(subscriptionRepository.getSubscriptionById).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // Test getSubscriptionByReferentie
  describe('getSubscriptionByReferentie', () => {
    it('should return the subscription by orderReferentie', async () => {
      const orderReferentie = 'order-123';
      const subscription = await subscriptionService.getSubscriptionByReferentie(orderReferentie);

      expect(subscription).toEqual(mockSubscription);
      expect(subscriptionRepository.getSubscriptionByReferentie).toHaveBeenCalledWith(orderReferentie);
    });
  });

  // Test getSubscriptionsByUserId
  describe('getSubscriptionsByUserId', () => {
    it('should return an array of subscriptions for a user', async () => {
      const userId = 'user-1';
      const subscriptions = await subscriptionService.getSubscriptionsByUserId(userId);

      expect(subscriptions).toEqual([mockSubscription]);
      expect(subscriptionRepository.findSubscriptionsByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
