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
 *           type: number
 *           format: int64
 *         beurten:
 *           type: number
 *           format: int64
 *           description: number of turns left.
 *         price:
 *           type: number
 *           format: int64
 *           description: Price of beurtenkaart.
 *         valid:
 *           type: boolean
 *           description: If the beurtenkaart is still valid.
 *         startDate:
 *           type: date
 *           description: Start date of subscription.
 *         endDate:
 *           type: date
 *           description: Start date of subscription.
 *         Order:
 *           type: object 
 *           description: Order object.
 */
import express, { NextFunction, Request, Response } from 'express';
import beurtenkaartService from '../service/beurtenkaart.service';

const beurtenkaartRouter = express.Router();

/**
 * @swagger
 * /beurtenkaarten:
 *   get:
 *     summary: Get a list of all beurtenkaarten.
 *     description: Returns a JSON array of all beurtenkaarten. Each order object contains an ID, region, subType, startDate, endDate, and Order object.
 *     tags:
 *       - Beurtenkaarten
 *     responses:
 *       200:
 *         description: A list of beurtenkaarten.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Beurtenkaart'
 *       500:
 *         description: Internal server error.
 */
beurtenkaartRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const beurtenkaarten = beurtenkaartService.getAllBeurtenkaarten();
        res.status(200).json(beurtenkaarten);
    } catch (error) {
        next(error);
    }
});

export { beurtenkaartRouter };