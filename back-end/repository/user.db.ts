import { Role } from '@prisma/client';
import { User } from '../model/user';
//import { Role } from '../types';
import database from '../util/database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((usersPrisma) => User.from(usersPrisma))
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

// Function to retrieve a user by ID
const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }

};

// Function to retrieve a user by firstname
const getUserByFirstName = async ({ firstName }: { firstName: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { firstName },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }
};
// Function to retrieve a user by lastname
const getUserByLastName = async ({ lastName }: { lastName: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { lastName },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }
};
// Function to retrieve a user by email
const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { email },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error)
        throw new Error("Database error. See server log for details.");
    }
};

// Function to save a new user
const saveUser = async (userData: { firstName: string; lastName: string; email: string; password: string; role: Role }): Promise<User> => {
    try {
        const existingUser = await database.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new Error(`User with email ${userData.email} already exists.`);
        }

        // Save the new user in the database
        const userPrisma = await database.user.create({
            data: userData,
        });

        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const updateUserRole = async (userId: number, roleString: Role): Promise<User> => {
    // Validate the role
    const validRoles: Role[] = ['admin', 'user', 'moderator'];
    if (!validRoles.includes(roleString)) {
        throw new Error('Invalid role.');
    }

    let role: Role | null = null; // Declare and initialize the role variable
    if (roleString === 'user') {
        role = Role.user;
    } else if (roleString === 'moderator') {
        role = Role.moderator;
    } else if (roleString === 'admin') {
        role = Role.admin;
    } else {
        throw new Error('Invalid role.');
    }
    
    try {
        // Update the role in the database using Prisma
        const updatedUserPrisma = await database.user.update({
            where: { id: userId },
            data: { role },
        });

        // Return the updated user as a User class instance
        return User.from(updatedUserPrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};



// Export the repository functions as an object for easy import
export default {
    getAllUsers,
    getUserById,
    getUserByFirstName,
    getUserByLastName,
    getUserByEmail,
    saveUser,
    updateUserRole,
};
