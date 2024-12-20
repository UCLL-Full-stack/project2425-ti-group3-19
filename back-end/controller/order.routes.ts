import express, { NextFunction, Request, Response } from 'express';
import orderService from '../service/order.service';
import { AuthenticatedRequest } from '../types/express';
import { authenticateUser } from "../middleware/authenticateUser";

const orderRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         orderDate:
 *           type: string
 *           format: date
 *           description: Date when the order was placed.
 *         product:
 *           type: string
 *           description: The product.
 *         price:
 *           type: number
 *           format: int64
 *           description: Product price.
 *         user:
 *           type: object
 *           description: User object.
 *         promotions:
 *           type: array
 *           description: Promotions from the order.
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get a list of all orders.
 *     description: Returns a JSON array of all orders. Each order object contains an ID, orderDate, product, price, user, and promotion.
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error.
 */
orderRouter.get('/', authenticateUser, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order.
 *     description: Creates a new order containing one or more products and returns the created order.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */
orderRouter.post('/', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { orders, promotionIds } = req.body;

        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ message: 'Orders array is required and cannot be empty.' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const ordersWithUser = orders.map(order => ({
            ...order,
            user: req.user,
        }));
        console.log(ordersWithUser);
        const createdOrders = await orderService.createMultipleOrders(ordersWithUser, promotionIds);
        res.status(201).json(createdOrders);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /orders/user-orders:
 *   get:
 *     summary: Get all orders of a specific user.
 *     description: Returns a list of orders for a user specified by `userId`.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the user whose orders you want to fetch.
 *           example: 123
 *     responses:
 *       200:
 *         description: List of orders for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing or invalid `userId` parameter.
 *       500:
 *         description: Internal server error.
 */
orderRouter.get('/user-orders', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.query.userId; // Ensure you have userId in the request
    if (!userId) {
        return res.status(400).json({ message: 'UserId is required' });
    }

    try {
        const orders = await orderService.getUserOrders(Number(userId));
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders' });
    }
});

export { orderRouter };
