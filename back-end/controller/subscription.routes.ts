/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         region:
 *           type: string
 *           description: Region of subscription.
 *         subType:
 *           type: string
 *           description: Type of subscription.
 *         startDate:
 *           type: date
 *           description: Start date of subscription.
 *         endDate:
 *           type: date
 *           description: End date of subscription.
 *         Order:
 *           type: object 
 *           description: Order object.
 */
import express, { NextFunction, Request, Response } from 'express';
import subscriptionService from '../service/subscription.service';

const subscriptionRouter = express.Router();

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get a list of all subscriptions.
 *     description: Returns a JSON array of all subscriptions. Each order object contains an ID, region, subType, startDate, endDate, and Order object.
 *     tags:
 *       - Subscriptions
 *     responses:
 *       200:
 *         description: A list of subscriptions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Internal server error.
 */
subscriptionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptions = subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        next(error);
    }
});

export { subscriptionRouter };