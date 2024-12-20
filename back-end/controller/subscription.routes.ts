import { Router } from 'express';
import subscriptionService from '../service/subscription.service';
import express, { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { authenticateUser } from "../middleware/authenticateUser";

const subRouter = express.Router();

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
 *           type: integer
 *         userId:
 *           type: string
 *         plan:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *   tags:
 *     - Subscriptions
 * /subscriptions/subsuser:
 *   get:
 *     summary: Get subscriptions by user ID
 *     description: Retrieve subscriptions associated with a specific user based on their userId.
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to retrieve subscriptions for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of subscriptions associated with the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
subRouter.get('/subsuser', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    console.log("anwezf");
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.query.userId;
        console.log(userId);
        const subscriptions = await subscriptionService.getSubscriptionsByUserId(userId as string);
        console.log(subscriptions);
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /subscriptions/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     description: Create a new subscription with the provided data.
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       201:
 *         description: Subscription created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
subRouter.post('/subscriptions', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const subscription = await subscriptionService.createSubscription(req.body);
        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     description: Retrieve a list of all subscriptions in the system.
 *     tags:
 *       - Subscriptions
 *     responses:
 *       200:
 *         description: A list of all subscriptions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
subRouter.get('/', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    console.log("aaaaaddddddd");
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /subscriptions/{orderReferentie}:
 *   get:
 *     summary: Get a subscription by order reference
 *     description: Retrieve a specific subscription based on the order reference.
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - name: orderReferentie
 *         in: path
 *         description: The order reference of the subscription to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single subscription associated with the provided order reference.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found.
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
subRouter.get('/:orderReferentie', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { orderReferentie } = req.params;
        console.log(orderReferentie, "here");
        const subscription = await subscriptionService.getSubscriptionByReferentie(orderReferentie);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(subscription);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /subscriptions/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     description: Retrieve a specific subscription based on the subscription ID.
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the subscription to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single subscription associated with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found.
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
subRouter.get('/subscriptions/:id', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const subscription = await subscriptionService.getSubscriptionById(parseInt(req.params.id));
        if (subscription) {
            res.status(200).json(subscription);
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

export { subRouter };
