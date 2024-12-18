import { Router } from 'express';
import beurtenkaartService from '../service/beurtenkaart.service';
import express, { NextFunction, Request, Response } from 'express';

const beurtRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Beurtenkaart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the beurtenkaart.
 *         userId:
 *           type: string
 *           description: The ID of the user.
 *         beurten:
 *           type: integer
 *           description: The number of beurten available.
 * /beurtenkaart/beurtuser:
 *   get:
 *     summary: Get beurtenkaart by user ID.
 *     description: Returns a list of beurtenkaarten associated with a specific user identified by `userId`.
 *     tags:
 *       - Beurtenkaarten
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the user to fetch beurtenkaarten.
 *           example: "123"
 *     responses:
 *       200:
 *         description: A list of beurtenkaarten for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Beurtenkaart'
 *       400:
 *         description: Bad request.
 *       404:
 *         description: No beurtenkaarten found for the given user.
 *       500:
 *         description: Internal server error.
 */
beurtRouter.get('/beurtuser', async (req, res) => {
    try {
        const userId = req.query.userId;
        const tickets = await beurtenkaartService.getBeurtenByUserId(userId as string);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /beurtenkaart/beurtenkaarten:
 *   post:
 *     summary: Create a new beurtenkaart.
 *     description: Creates a new beurtenkaart based on the provided data in the request body.
 *     tags:
 *       - Beurtenkaarten
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Beurtenkaart'
 *     responses:
 *       201:
 *         description: Beurtenkaart created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beurtenkaart'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */
beurtRouter.post('/beurtenkaarten', async (req, res) => {
    try {
        const beurtenkaart = await beurtenkaartService.createBeurtenkaart(req.body);
        res.status(201).json(beurtenkaart);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /beurtenkaart/beurtenkaarten:
 *   get:
 *     summary: Get all beurtenkaarten.
 *     description: Returns a list of all beurtenkaarten.
 *     tags:
 *       - Beurtenkaarten
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all beurtenkaarten.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Beurtenkaart'
 *       500:
 *         description: Internal server error.
 */
beurtRouter.get('/beurtenkaarten', async (req, res) => {
    try {
        const beurtenkaarten = await beurtenkaartService.getAllBeurtenkaarten();
        res.status(200).json(beurtenkaarten);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /beurtenkaart/beurtenkaarten/{id}:
 *   get:
 *     summary: Get a beurtenkaart by ID.
 *     description: Returns a specific beurtenkaart based on the given `id`.
 *     tags:
 *       - Beurtenkaarten
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the beurtenkaart to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: The details of the beurtenkaart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beurtenkaart'
 *       404:
 *         description: Beurtenkaart not found.
 *       500:
 *         description: Internal server error.
 */
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

export { beurtRouter };
