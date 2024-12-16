import { Router } from 'express';
import ticketService from '../service/ticket.service'; // Adjust the import path as necessary
import express, { NextFunction, Request, Response } from 'express';

const ticketRouter = express.Router();

// Route to create a new ticket
ticketRouter.post('/', async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to get all tickets
ticketRouter.get('/', async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Route to get a ticket by ID
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

export { ticketRouter};