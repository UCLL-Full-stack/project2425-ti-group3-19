// src/repository/user.db.ts
import { User } from '../model/user';
import { Role } from '../types';

const users: User[] = [];

// Hardcoded user Wiebe
const user_wiebe = new User({
    id: 1,
    firstName: 'Wiebe',
    lastName: 'Delvaux',
    email: 'wiebe.delvaux@gmail.com',
    password: 'test1',
    role: 'admin'
});

// Add the hardcoded user to the users array
users.push(user_wiebe);

// Function to retrieve all users
const getAllUsers = (): User[] => {
    return users;
};

// Function to retrieve a user by ID
const getUserById = (id: number): User | null => {
    const user = users.find((user) => user.getId() === id);
    return user || null;
};

// Function to retrieve a user by firstname
const getUserByFirstName = (firstName: string): User | null => {
    const user = users.find((user) => user.getFirstName() === firstName);
    return user || null;
};
// Function to retrieve a user by lastname
const getUserByLastName = (lastName: string): User | null => {
    const user = users.find((user) => user.getLastName() === lastName);
    return user || null;
};
// Function to retrieve a user by email
const getUserByEmail = (email: string): User | null => {
    const user = users.find((user) => user.getEmail() === email);
    return user || null;
};

// Function to save a new user
const saveUser = (userData: { firstName: string; lastName: string; email: string; password: string; role: Role }): User => {
    // Check for existing user with the same email
    const existingUser = users.find(user => user.getEmail() === userData.email);
    if (existingUser) {
        throw new Error(`User with email ${userData.email} already exists.`);
    }

    // Create a new user instance
    const newUser = new User({ id: users.length + 1, ...userData });

    // Optionally validate the new user data (you could have a separate validation method)
    try {
        newUser.validate({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
        });
    } catch (validationError) {
        throw new Error(`Validation error: ${(validationError as Error).message}`);
    }

    // Add the new user to the users array
    users.push(newUser);

    return newUser;
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
