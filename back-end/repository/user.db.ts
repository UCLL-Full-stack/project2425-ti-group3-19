import { User } from '../model/user';
import { Role } from '../types';
import database from '../util/database';

// const users: User[] = [];

// const user_wiebe = new User({
//     id: 1,
//     firstName: 'Wiebe',
//     lastName: 'Delvaux',
//     email: 'wiebe.delvaux@gmail.com',
//     password: 'test1',
//     role: 'admin'
// });

// users.push(user_wiebe);

// Function to retrieve all users
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
        // Check for existing user with the same email
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



// Export the repository functions as an object for easy import
export default {
    getAllUsers,
    getUserById,
    getUserByFirstName,
    getUserByLastName,
    getUserByEmail,
    saveUser,
};
