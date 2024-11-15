// src/service/userService.ts
import { User } from '../model/user';
import userRepository from '../repository/user.db';
import { Role } from '../types';
import { Order } from '../model/order';
import orderService from './order.service';
import {v4 as uuidv4} from "uuid";

const getAllUsers = (): User[] => {
    return userRepository.getAllUsers();
};

const getUserById = (id: number): User => {
    const user = userRepository.getUserById(id);
    if (!user) {
        throw new Error(`User with id ${id} does not exist.`);
    }
    return user;
};

const getUserByFirstName = (firstName: string): User => {
    const user = userRepository.getUserByFirstName(firstName);
    if (!user) {
        throw new Error(`User with first name ${firstName} does not exist.`);
    }
    return user;
};

const getUserByLastName = (lastName: string): User => {
    const user = userRepository.getUserByLastName(lastName);
    if (!user) {
        throw new Error(`User with last name ${lastName} does not exist.`);
    }
    return user;
};

const getUserByEmail = (email: string): User | null => {
    const user = userRepository.getUserByEmail(email);
    return user || null; // Return the user if found, otherwise return null
};


const createUser = async (userData: { firstName: string; lastName: string; email: string; password: string; role: Role }): Promise<User> => {
    try {
        const newUser = userRepository.saveUser(userData);

        const orderReferentie = uuidv4();

        const order = new Order({
            orderDate: new Date(),
            product: 'User Registration',
            price: 0,
            user: newUser, // Pass the User object directly
            promotions: [],
            orderReferentie,
        });

        orderService.createOrder({
            orderDate: order.getOrderDate(),
            product: order.getProduct(),
            price: order.getPrice(),
            user: order.getUser(),
            promotions: order.getPromotions(),
            orderReferentie: order.getorderReferentie()
        });

        return newUser; // Return the newly created user
    } catch (error) {
        if ((error as Error).message.includes('already exists')) {
            throw new Error(`User creation failed: ${(error as Error).message}`);
        }
        throw new Error(`Unexpected error occurred: ${(error as Error).message}`);
    }
};

async function verifyUserCredentials(email: string, password: string): Promise<boolean> {
    const user = getUserByEmail(email); // This will now return User or null

    if (user) {
        return user.getPassword() === password; // Direct comparison (not secure for production)
    }

    return false; // User not found
}


export default {
    getAllUsers,
    getUserById,
    getUserByFirstName,
    getUserByLastName,
    getUserByEmail,
    createUser,
    verifyUserCredentials,
};
