import orderService from '../service/order.service';
import orderRepository from '../repository/order.db';
import promoRepository from '../repository/promo.db';
import ticketService from '../service/ticket.service';
import subscriptionService from '../service/subscription.service';
import beurtenkaartService from '../service/beurtenkaart.service';
import { Order } from '../model/order';
import { User } from '../model/user';
import { Promotion } from '../model/promotion';
import { Ticket } from '../model/ticket';
import { Subscription } from '../model/subscription';
import { Beurtenkaart } from '../model/beurtenkaart';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../types';

// Mock dependencies
jest.mock('../repository/order.db', () => ({
  saveOrder: jest.fn(),
  getAllOrders: jest.fn(),
  getUserOrders: jest.fn(),
}));

jest.mock('../repository/promo.db', () => ({
  getPromotionsByIds: jest.fn(), // Mocking the function directly
}));

jest.mock('../service/ticket.service', () => ({
  createTicket: jest.fn(),
}));

jest.mock('../service/subscription.service', () => ({
  createSubscription: jest.fn(),
}));

jest.mock('../service/beurtenkaart.service', () => ({
  createBeurtenkaart: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('some-unique-id'),
}));

describe('orderService', () => {
  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    getId: function (): number | undefined {
      return this.id;
    },
    getFirstName: function (): string {
      return this.firstName;
    },
    getLastName: function (): string {
      return this.lastName;
    },
    getEmail: function (): string {
      return this.email;
    },
    getPassword: function (): string {
      return this.password;
    },
    getRole: function (): Role {
      return this.role;
    },
    getCreatedAt: function (): Date | undefined {
      return this.createdAt;
    },
    getUpdatedAt: function (): Date | undefined {
      return this.updatedAt;
    },
    validate: function (user: { firstName: string; lastName: string; email: string; password: string; }): void { },
    equals: function (user: User): boolean {
      return this.id === user.id;
    }
  };

  const mockPromotion: Promotion = {
    id: 1,
    Code: 'PROMO1',
    DiscountAmount: 10,
    IsActive: true,
    orders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    getId: function (): number | undefined {
      return this.id;
    },
    getCode: function (): string {
      return this.Code;
    },
    getIsActive: function (): boolean {
      return this.IsActive;
    },
    getDiscountAmount: function (): number {
      return this.DiscountAmount;
    },
    getOrders: function (): Order[] {
      return this.orders;
    },
    validate: function (promotion: { Code: string; IsActive: boolean; DiscountAmount: number; orders: Order[]; }): void { },
    equals: function (promotion: Promotion): boolean {
      return this.id === promotion.id;
    }
  };

  const mockOrderData = {
    orderDate: new Date("2024-12-20T17:16:55+01:00"),
    product: 'Ticket',
    price: 100,
    user: mockUser,
    promotions: [1],
    orderReferentie: 'ORD123',
  };

  const mockOrder = new Order({
    orderDate: mockOrderData.orderDate,
    product: mockOrderData.product,
    price: mockOrderData.price,
    user: mockOrderData.user,
    promotions: [mockPromotion],
    orderReferentie: mockOrderData.orderReferentie,
  });

  beforeEach(() => {
    // Ensure that the repository methods are mocked properly as jest.Mock
    (promoRepository.getPromotionsByIds as jest.Mock).mockResolvedValue([mockPromotion]);  // Mock resolved value
    (orderRepository.saveOrder as jest.Mock).mockResolvedValue([mockOrder]);
    (ticketService.createTicket as jest.Mock).mockResolvedValue(new Ticket({ id: 1, date: new Date(), price: 50, startStation: 'A', desStation: 'B', orderId: 'some-unique-id' }));
    (orderRepository.getAllOrders as jest.Mock).mockResolvedValue([mockOrder]);
    (orderRepository.getUserOrders as jest.Mock).mockResolvedValue([mockOrder]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test createOrder function
  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      (promoRepository.getPromotionsByIds as jest.Mock).mockResolvedValue([mockPromotion]);
      (orderRepository.saveOrder as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(mockOrderData);

      expect(result).toEqual(mockOrder);
      expect(orderRepository.saveOrder).toHaveBeenCalledWith({
        orderDate: mockOrder.getOrderDate(),
        product: mockOrder.getProduct(),
        price: mockOrder.getPrice(),
        user: mockOrder.getUser(),
        promotions: mockOrder.getPromotions(),
        orderReferentie: mockOrder.getorderReferentie(),
      });
    });
  });

  // Test createMultipleOrders function
  describe('createMultipleOrders', () => {
    const mockMultipleOrderData = [
      {
        orderDate: new Date(),
        product: 'Ticket',
        price: 50,
        user: mockUser,
        promotions: [1],
        region: 'Region 1',
        beginStation: 'Station A',
        endStation: 'Station B',
        subscriptionLength: '',
      },
    ];

    it('should create multiple orders successfully', async () => {
      (promoRepository.getPromotionsByIds as jest.Mock).mockResolvedValue([mockPromotion]);
      (ticketService.createTicket as jest.Mock).mockResolvedValue(new Ticket({ id: 1, date: new Date(), price: 50, startStation: 'A', desStation: 'B', orderId: 'some-unique-id' }));
      (orderRepository.saveOrder as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.createMultipleOrders(mockMultipleOrderData, [1]);

      expect(result.length).toBe(1);
      expect(ticketService.createTicket).toHaveBeenCalledWith(expect.any(Ticket));
      expect(orderRepository.saveOrder).toHaveBeenCalled();
    });

    it('should throw an error if the product type is invalid', async () => {
      const invalidOrderData = [
        {
          orderDate: new Date(),
          product: 'InvalidProduct',
          price: 100,
          user: mockUser,
          promotions: [1],
          region: 'Region 1',
          beginStation: 'Station A',
          endStation: 'Station B',
          subscriptionLength: '1 Month',
        },
      ];

      await expect(orderService.createMultipleOrders(invalidOrderData, [1])).rejects.toThrow('Invalid product type');
    });

    it('should throw an error if subscription length is invalid', async () => {
      const invalidSubscriptionOrderData = [
        {
          orderDate: new Date(),
          product: 'Subscription',
          price: 100,
          user: mockUser,
          promotions: [1],
          region: 'Region 1',
          beginStation: 'Station A',
          endStation: 'Station B',
          subscriptionLength: 'InvalidLength',
        },
      ];

      await expect(orderService.createMultipleOrders(invalidSubscriptionOrderData, [1])).rejects.toThrow('Invalid subscription length');
    });
  });

  // Test getAllOrders function
  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      (orderRepository.getAllOrders as jest.Mock).mockResolvedValue([mockOrder]);

      const result = await orderService.getAllOrders();

      expect(result).toEqual([mockOrder]);
      expect(orderRepository.getAllOrders).toHaveBeenCalled();
    });
  });

  // Test getUserOrders function
  describe('getUserOrders', () => {
    it('should return orders for a specific user', async () => {
      (orderRepository.getUserOrders as jest.Mock).mockResolvedValue([mockOrder]);
      
      // Call the service function
      const userId = mockUser.id;
      if (userId !== undefined) {
        const result = await orderService.getUserOrders(userId);
        expect(result).toEqual([mockOrder]);
      }

      // Ensure it's called with mockUser.id
      expect(orderRepository.getUserOrders).toHaveBeenCalledWith(userId);
    });
  });
});
