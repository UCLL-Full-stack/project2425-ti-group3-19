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


export { orderRouter };
