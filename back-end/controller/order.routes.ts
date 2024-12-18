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
 *         User:
 *           type: object
 *           description: User object.
 *         promotions:
 *           type: array
 *           description: Promotions from the order.
 */

import express, { NextFunction, Request, Response } from 'express';
import orderService from '../service/order.service';

const orderRouter = express.Router();

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
orderRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = orderService.getAllOrders();
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

import { AuthenticatedRequest } from '../types/express';
import {authenticateUser} from "../middleware/authenticateUser";

orderRouter.post('/', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
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


orderRouter.get('/user-orders', async (req, res) => {
    console.log("aaaaa");
    const userId = req.query.userId; // Ensure you have userId in the request
    const orders = await orderService.getUserOrders(Number(userId));
    res.json(orders);
});

export { orderRouter };
