import { Router } from 'express';
import beurtenkaartService from '../service/beurtenkaart.service';
import express, { NextFunction, Request, Response } from 'express';

const beurtRouter = express.Router();

beurtRouter.get('/beurtuser', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const tickets = await beurtenkaartService.getBeurtenByUserId(userId as string);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to create a new beurtenkaart
beurtRouter.post('/beurtenkaarten', async (req, res) => {
    try {
        const beurtenkaart = await beurtenkaartService.createBeurtenkaart(req.body);
        res.status(201).json(beurtenkaart);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to get all beurtenkaarten
beurtRouter.get('/beurtenkaarten', async (req, res) => {
    try {
        const beurtenkaarten = await beurtenkaartService.getAllBeurtenkaarten();
        res.status(200).json(beurtenkaarten);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to get a beurtenkaart by ID
beurtRouter.get('/beurtenkaarten/:id', async (req, res) => {
    try {
        const beurtenkaart = await beurtenkaartService.getBeurtenkaartById(parseInt(req.params.id));
        if (beurtenkaart) {
            res.status(200).json(beurtenkaart);
        } else {
            res.status(404).json({ message: 'Beurtenkaart not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

export { beurtRouter};