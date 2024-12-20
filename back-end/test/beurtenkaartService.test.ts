// src/service/beurtenkaart.service.test.ts
import beurtenkaartService from '../service/beurtenkaart.service';
import beurtenkaartRepository from '../repository/beurtenkaart.db';
import { Beurtenkaart } from '../model/beurtenkaart';

// Mock the repository functions
jest.mock('../repository/beurtenkaart.db', () => ({
    saveBeurtenkaart: jest.fn(),
    getAllBeurtenkaarten: jest.fn(),
    getBeurtenkaartById: jest.fn(),
    findBeurtenByUserId: jest.fn(),
}));

// Mock the Beurtenkaart class
jest.mock('../model/beurtenkaart', () => {
    return {
        Beurtenkaart: jest.fn().mockImplementation((data) => ({
            getId: jest.fn().mockReturnValue(data.id),
            getBeurten: jest.fn().mockReturnValue(data.beurten),
            getPrice: jest.fn().mockReturnValue(data.price),
            isValid: jest.fn().mockReturnValue(data.valid),
            getStartDate: jest.fn().mockReturnValue(data.startDate),
            getEndDate: jest.fn().mockReturnValue(data.endDate),
            getOrderId: jest.fn().mockReturnValue(data.orderId),
        }))
    };
});

describe('beurtenkaartService', () => {
    const mockBeurtenkaart = new Beurtenkaart({
        id: 1,
        valid: true,
        beurten: 10,
        price: 50,
        startDate: new Date(),
        endDate: new Date(),
        orderId: 'ORD123456',
    });

    beforeEach(() => {
        // Ensure that the repository methods are mocked properly as jest.Mock
        (beurtenkaartRepository.saveBeurtenkaart as jest.Mock).mockResolvedValue(mockBeurtenkaart);
        (beurtenkaartRepository.getAllBeurtenkaarten as jest.Mock).mockResolvedValue([mockBeurtenkaart]);
        (beurtenkaartRepository.getBeurtenkaartById as jest.Mock).mockResolvedValue(mockBeurtenkaart);
        (beurtenkaartRepository.findBeurtenByUserId as jest.Mock).mockResolvedValue([mockBeurtenkaart]);
    });

    // Test for createBeurtenkaart
    describe('createBeurtenkaart', () => {
        it('should successfully create a beurtenkaart', async () => {
            const result = await beurtenkaartService.createBeurtenkaart(mockBeurtenkaart);

            expect(result).toEqual(mockBeurtenkaart);
            expect(beurtenkaartRepository.saveBeurtenkaart).toHaveBeenCalledWith(mockBeurtenkaart);
        });

        it('should throw an error if beurtenkaart creation fails', async () => {
            // Mocking the saveBeurtenkaart function to throw an error
            (beurtenkaartRepository.saveBeurtenkaart as jest.Mock).mockRejectedValue(new Error('Error saving beurtenkaart'));

            await expect(beurtenkaartService.createBeurtenkaart(mockBeurtenkaart))
                .rejects
                .toThrow('Error saving beurtenkaart');
        });
    });

    // Test for getAllBeurtenkaarten
    describe('getAllBeurtenkaarten', () => {
        it('should return all beurtenkaarten', async () => {
            const result = await beurtenkaartService.getAllBeurtenkaarten();

            expect(result).toEqual([mockBeurtenkaart]);
            expect(beurtenkaartRepository.getAllBeurtenkaarten).toHaveBeenCalled();
        });

        it('should return an empty array if no beurtenkaarten are found', async () => {
            // Mocking the getAllBeurtenkaarten function to return a resolved promise with an empty array
            (beurtenkaartRepository.getAllBeurtenkaarten as jest.Mock).mockResolvedValue([]);

            const result = await beurtenkaartService.getAllBeurtenkaarten();

            expect(result).toEqual([]);
        });
    });

    // Test for getBeurtenkaartById
    describe('getBeurtenkaartById', () => {
        it('should return a beurtenkaart by ID', async () => {
            const result = await beurtenkaartService.getBeurtenkaartById(1);

            expect(result).toEqual(mockBeurtenkaart);
            expect(beurtenkaartRepository.getBeurtenkaartById).toHaveBeenCalledWith(1);
        });

        it('should return null if beurtenkaart not found', async () => {
            // Mocking the getBeurtenkaartById function to return null
            (beurtenkaartRepository.getBeurtenkaartById as jest.Mock).mockResolvedValue(null);

            const result = await beurtenkaartService.getBeurtenkaartById(1);

            expect(result).toBeNull();
        });
    });

    // Test for getBeurtenByUserId
    describe('getBeurtenByUserId', () => {
        it('should return beurtenkaarten by user ID', async () => {
            const mockUserId = 'user123';
            const mockBeurtenkaarten: Beurtenkaart[] = [mockBeurtenkaart];
            // Mocking the findBeurtenByUserId function to return a resolved promise with mockBeurtenkaarten
            (beurtenkaartRepository.findBeurtenByUserId as jest.Mock).mockResolvedValue(mockBeurtenkaarten);

            const result = await beurtenkaartService.getBeurtenByUserId(mockUserId);

            expect(result).toEqual(mockBeurtenkaarten);
            expect(beurtenkaartRepository.findBeurtenByUserId).toHaveBeenCalledWith(mockUserId);
        });

        it('should return an empty array if no beurtenkaarten are found for the user', async () => {
            // Mocking the findBeurtenByUserId function to return a resolved promise with an empty array
            (beurtenkaartRepository.findBeurtenByUserId as jest.Mock).mockResolvedValue([]);

            const result = await beurtenkaartService.getBeurtenByUserId('user123');

            expect(result).toEqual([]);
        });
    });
});
