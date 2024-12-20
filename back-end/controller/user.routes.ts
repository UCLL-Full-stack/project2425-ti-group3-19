/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         firstName:
 *           type: string
 *           description: User's first name.
 *         lastName:
 *           type: string
 *           description: User's last name.
 *         email:
 *           type: string
 *           description: User's email.
 *         password:
 *           type: string
 *           description: User's password.
 *         role:
 *           type: string
 *           description: User role.
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import jwt from 'jsonwebtoken';
import {authenticateUser} from '../middleware/authenticateUser';
import { AuthenticatedRequest } from '../types/express';

const userRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'F_wMoWC2jXN2cW2l-aLRtiNNShI9SfVPeEKXg5olAUQ';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users.
 *     description: Returns a JSON array of all users. Each user object contains an ID, name, and role.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
userRouter.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID.
 *     description: Returns a JSON object of the user with the specified ID. If the user does not exist, an error is thrown.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: number
 *           format: int64
 *     responses:
 *       200:
 *         description: The user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(Number(id));
        res.status(200).json(user);
    } catch (error) {
        if ((error as Error).message.includes('does not exist')) {
            return res.status(404).json({ message: (error as Error).message });
        }
        next(error); // For other errors
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user.
 *     description: Creates a new user with the provided data.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User first name.
 *               lastName:
 *                 type: string
 *                 description: User last name.
 *               email:
 *                 type: string
 *                 description: User email.
 *               password:
 *                 type: string
 *                 description: User password.
 *               role:
 *                 type: string
 *                 description: User role.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
userRouter.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Create a user using the service
        const newUser = await userService.createUser({ firstName, lastName, email, password, role });

        // Respond with the newly created user
        return res.status(201).json(newUser);
    } catch (error) {
        // Handle specific error types
        if ((error as Error).message.includes('already exists')) {
            return res.status(409).json({ message: 'User already exists.' });// Conflict error for duplicate users
        } else if ((error as Error).message.includes('required')) {
            return res.status(400).json({ message: (error as Error).message }); // Bad request for validation issues
        } else if ((error as Error).message.includes('Validation error')) {
            return res.status(422).json({ message: (error as Error).message }); // Unprocessable entity for validation errors
        }

        // For any other unexpected error, pass it to the next middleware
        console.error('Unexpected error:', error);
        return next(error);
    }
});


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user.
 *     description: Logs in a user with their email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const isValidUser = await userService.verifyUserCredentials(email, password);

        if (isValidUser) {
            const user = await userService.getUserByEmail(email);
            if(!user) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }
            console.log('User at login:', user); // Add this log
            console.log('User ID at login:', user.getId()); // Add this log
            const token = jwt.sign({ id: user.getId(), email: email }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful.', token });
        }

        return res.status(401).json({ message: 'Invalid email or password.' });
    } catch (error) {
        console.error('Error logging in:', error);
        next(error); // Pass to the next error handler
    }
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the logged-in user's profile.
 *     description: Returns the profile of the currently logged-in user based on the JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user profile object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized if token is invalid or missing.
 *       500:
 *         description: Internal server error.
 */
userRouter.get('/profile', authenticateUser, async (
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
    ) => {
    console.log("test");
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        console.log('User from request:', req.user);
        const user = req.user;
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
});

/**
 * @swagger
 * /users/current-user:
 *   get:
 *     summary: Get the current user's ID.
 *     description: Returns the ID of the currently logged-in user based on the JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Indicates the need for JWT authentication
 *     responses:
 *       200:
 *         description: The user's ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: The user's unique identifier.
 *       401:
 *         description: Unauthorized if token is invalid or missing.
 *       500:
 *         description: Internal server error.
 */
userRouter.get('/current-user', authenticateUser, async (
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.getId();  // Assuming getId() returns the user's unique ID
    res.status(200).json({ id: userId });
});

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Update a user's role.
 *     description: This endpoint allows an admin to update the role of a user. Only users with admin permissions can perform this action.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user whose role needs to be updated.
 *         schema:
 *           type: integer
 *           format: int64
 *       - in: body
 *         name: role
 *         required: true
 *         description: The new role to assign to the user.
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *               enum: [admin, moderator, user]
 *               description: The new role of the user.
 *     security:
 *       - bearerAuth: []  # Requires authentication via JWT
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request if the role is invalid or missing.
 *       404:
 *         description: User not found.
 *       403:
 *         description: Forbidden if the user does not have the correct permissions.
 *       500:
 *         description: Internal server error.
 */
userRouter.put('/:id/role', authenticateUser, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // Check if the user is an admin (or have similar permissions)
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to update user roles.' });
        }

        // Validate the role
        if (!['admin', 'moderator', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        // Update the user's role in the database
        const updatedUser = await userService.updateUserRole(Number(id), role);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the updated user information
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});




export { userRouter };
