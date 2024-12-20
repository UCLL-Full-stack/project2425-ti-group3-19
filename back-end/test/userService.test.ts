import userService from '../service/user.service';
import userRepository from '../repository/user.db';
import orderService from '../service/order.service';
import bcrypt from 'bcrypt';
import { User } from '../model/user';
import { Role } from '../types'; // Ensure Role is imported from your types file
import { Order } from '../model/order';

// Mock repository functions
jest.mock('../repository/user.db', () => ({
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  saveUser: jest.fn(),
  updateUserRole: jest.fn(),
  getAllUsers: jest.fn(),
  getUserByFirstName: jest.fn(),
  getUserByLastName: jest.fn(),
}));

// Mock order service functions
jest.mock('../service/order.service', () => ({
  createOrder: jest.fn(),
}));

// Mock bcrypt functions
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('userService', () => {
  // Create mock user instance here
  const mockUser = new (class MockUser {
    constructor(
      public id: number,
      public firstName: string,
      public lastName: string,
      public email: string,
      public role: Role, // Use the Role type instead of string
      public password: string,
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date()
    ) {}

    getId() {
      return this.id;
    }

    getFirstName() {
      return this.firstName;
    }

    getLastName() {
      return this.lastName;
    }

    getEmail() {
      return this.email;
    }

    getRole() {
      return this.role;
    }

    getPassword() {
      return this.password;
    }

    getCreatedAt() {
      return this.createdAt;
    }

    getUpdatedAt() {
      return this.updatedAt;
    }

    validate() {
      return true;
    }

    equals(otherUser: MockUser) {
      return this.id === otherUser.getId();
    }
  })(1, 'John', 'Doe', 'john@example.com', 'user', 'hashedPassword');

  // Mock the repository methods to return the mockUser where needed
  beforeEach(() => {
    (userRepository.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.saveUser as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.updateUserRole as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);
    (userRepository.getUserByFirstName as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.getUserByLastName as jest.Mock).mockResolvedValue(mockUser);
  });

  // Test getAllUsers
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [mockUser];
      
      const users = await userService.getAllUsers();
      expect(users).toEqual(mockUsers);
      expect(userRepository.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  // Test getUserById
  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = await userService.getUserById(1);
      expect(user).toEqual(mockUser);
      expect(userRepository.getUserById).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if user is not found', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue(null);
      
      await expect(userService.getUserById(1)).rejects.toThrow('User with id 1 does not exist.');
    });
  });

  // Test getUserByFirstName
  describe('getUserByFirstName', () => {
    it('should return a user by first name', async () => {
      const user = await userService.getUserByFirstName('John');
      expect(user).toEqual(mockUser);
      expect(userRepository.getUserByFirstName).toHaveBeenCalledWith({ firstName: 'John' });
    });

    it('should throw an error if user is not found', async () => {
      (userRepository.getUserByFirstName as jest.Mock).mockResolvedValue(null);
      
      await expect(userService.getUserByFirstName('Nonexistent')).rejects.toThrow('User with first name Nonexistent does not exist.');
    });
  });

  // Test getUserByLastName
  describe('getUserByLastName', () => {
    it('should return a user by last name', async () => {
      const user = await userService.getUserByLastName('Doe');
      expect(user).toEqual(mockUser);
      expect(userRepository.getUserByLastName).toHaveBeenCalledWith({ lastName: 'Doe' });
    });

    it('should throw an error if user is not found', async () => {
      (userRepository.getUserByLastName as jest.Mock).mockResolvedValue(null);
      
      await expect(userService.getUserByLastName('Nonexistent')).rejects.toThrow('User with last name Nonexistent does not exist.');
    });
  });

  // Test getUserByEmail
  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = await userService.getUserByEmail('john@example.com');
      expect(user).toEqual(mockUser);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should return null if user is not found', async () => {
      (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);
      
      const user = await userService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  // Test createUser
  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const mockUserData = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', password: 'password123', role: 'user' as Role };
      
      (userRepository.saveUser as jest.Mock).mockResolvedValue(mockUser);
      (orderService.createOrder as jest.Mock).mockResolvedValue({});

      const newUser = await userService.createUser(mockUserData);
      expect(newUser).toEqual(mockUser);
      expect(userRepository.saveUser).toHaveBeenCalledWith({
        ...mockUserData,
        password: 'hashedPassword',
      });
      expect(orderService.createOrder).toHaveBeenCalled();
    });

    it('should throw an error if user creation fails', async () => {
      const mockUserData = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', password: 'password123', role: 'user' as Role };
      
      (userRepository.saveUser as jest.Mock).mockRejectedValue(new Error('User creation failed'));

      await expect(userService.createUser(mockUserData)).rejects.toThrow('Unexpected error occurred: User creation failed');
    });
  });

  // Test verifyUserCredentials
  describe('verifyUserCredentials', () => {
    it('should return true if credentials are correct', async () => {
      const isValid = await userService.verifyUserCredentials('john@example.com', 'password123');
      expect(isValid).toBe(true);
    });

    it('should return false if credentials are incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      const isValid = await userService.verifyUserCredentials('john@example.com', 'wrongpassword');
      expect(isValid).toBe(false);
    });

    it('should return false if user not found', async () => {
      (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);
      
      const isValid = await userService.verifyUserCredentials('nonexistent@example.com', 'password123');
      expect(isValid).toBe(false);
    });
  });
});
