import { Router } from 'express';
import subscriptionService from '../service/subscription.service';
import express, { NextFunction, Request, Response } from 'express';

const subRouter = express.Router();

subRouter.get('/subsuser', async (req, res) => {
    console.log("anwezf");
    try {
        const userId = req.query.userId;
        console.log(userId);
        const subscriptions = await subscriptionService.getSubscriptionsByUserId(userId as string);
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to create a new subscription
subRouter.post('/subscriptions', async (req, res) => {
    try {
        const subscription = await subscriptionService.createSubscription(req.body);
        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to get all subscriptions
subRouter.get('/', async (req, res) => {
    console.log("aaaaaddddddd");
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

subRouter.get('/:orderReferentie', async (req, res, next) => {
    try {
        const { orderReferentie } = req.params;
        const subscription = await subscriptionService.getSubscriptionByReferentie(orderReferentie);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(subscription);
    } catch (error) {
        next(error);
    }
});

// Route to get a subscription by ID
subRouter.get('/subscriptions/:id', async (req, res) => {
    try {
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

export { subRouter};