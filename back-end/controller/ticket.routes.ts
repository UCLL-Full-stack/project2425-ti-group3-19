import { Router } from 'express';
import ticketService from '../service/ticket.service'; // Adjust the import path as necessary
import express, { NextFunction, Request, Response } from 'express';

const ticketRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *   tags:
 *     - Tickets
 * /tickets/ticketuser:
 *   get:
 *     summary: Get tickets by user ID
 *     description: Retrieve tickets associated with a specific user based on their userId.
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to retrieve tickets for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tickets associated with the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
ticketRouter.get('/ticketuser', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const tickets = await ticketService.getTicketsByUserId(userId as string);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     description: Create a new support ticket with the provided data.
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
ticketRouter.post('/', async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Retrieve a list of all tickets in the system.
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
ticketRouter.get('/', async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     description: Retrieve a specific ticket based on the ticket ID.
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ticket to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single ticket associated with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found.
 *       400:
 *         description: Bad request. Error message is provided in the response.
 */
ticketRouter.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(parseInt(req.params.id));
        if (ticket) {
            res.status(200).json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

export { ticketRouter };
