// src/service/userService.ts
import { User } from '../model/user';
import userRepository from '../repository/user.db';
import { Role } from '../types';
import { Order } from '../model/order';
import orderService from './order.service';
import {v4 as uuidv4} from "uuid";
import bcrypt from 'bcrypt';

const getAllUsers = async(): Promise<User[]> => {
    return userRepository.getAllUsers();
};

const getUserById = async (id: number): Promise<User> => {
    const user = await userRepository.getUserById({ id });
    if (!user) {
        throw new Error(`User with id ${id} does not exist.`);
    }
    return user;
};

const getUserByFirstName = async (firstName: string): Promise<User> => {
    const user = await userRepository.getUserByFirstName({ firstName });
    if (!user) {
        throw new Error(`User with first name ${firstName} does not exist.`);
    }
    return user;
};

const getUserByLastName = async (lastName: string): Promise<User> => {
    const user = await userRepository.getUserByLastName({ lastName });
    if (!user) {
        throw new Error(`User with last name ${lastName} does not exist.`);
    }
    return user;
};


const getUserByEmail = async (email: string): Promise<User | null> => {
    return await userRepository.getUserByEmail({ email });
};


const createUser = async (userData: { firstName: string; lastName: string; email: string; password: string; role: Role }): Promise<User> => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUser = await userRepository.saveUser({...userData, password: hashedPassword});

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
            promotions: order.getPromotions().map(promo => promo.id),
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

const verifyUserCredentials = async (email: string, password: string): Promise<boolean> => {
    const user = await getUserByEmail(email); // This will now return User or null
    const hashedPassword = await bcrypt.hash(password, 12);
    if (user) {
        return user.getPassword() === hashedPassword; // Direct comparison (not secure for production)
    }

    return false; // User not found
};

const updateUserRole = async (userId: number, role: Role): Promise<User> => {
    // Call the repository to update the user's role
    return await userRepository.updateUserRole(userId, role);
};

export default {
    getAllUsers,
    getUserById,
    getUserByFirstName,
    getUserByLastName,
    getUserByEmail,
    createUser,
    verifyUserCredentials,
    updateUserRole,
};
