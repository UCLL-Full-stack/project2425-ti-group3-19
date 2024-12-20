import { Router } from 'express';
import promotionService from '../service/promo.service'; // Adjust the import path as necessary
import express, { NextFunction, Request, Response } from 'express';
import {authenticateUser} from '../middleware/authenticateUser';
import { AuthenticatedRequest } from '../types/express';

const promoRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Promotion:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: The promotion code.
 *         discount:
 *           type: number
 *           description: The discount amount.
 *         isActive:
 *           type: boolean
 *           description: Whether the promotion is active.
 *   tags:
 *     - Promotions
 * /promocodes/validate:
 *   post:
 *     summary: Validate a promotion code
 *     description: Validates a promotion code and returns the discount and status of the promotion.
 *     tags:
 *       - Promotions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The promotion code to validate.
 *                 example: "PROMO123"
 *     responses:
 *       200:
 *         description: Promotion code is valid and active, with the discount amount returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discount:
 *                   type: number
 *                   description: The discount amount provided by the promotion.
 *                   example: 15.5
 *                 isActive:
 *                   type: boolean
 *                   description: Whether the promotion is currently active.
 *                   example: true
 *       400:
 *         description: Invalid or inactive promotion code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or inactive promotion code."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
promoRouter.post('/validate', authenticateUser, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { code } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const promotion = await promotionService.validatePromotionCode(code);

        if (promotion) {
            res.json({ discount: promotion.getDiscountAmount(), isActive: promotion.getIsActive() });
        } else {
            res.status(400).json({ message: 'Invalid or inactive promotion code.' });
        }
    } catch (error) {
        console.error('Error validating promotion code:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export { promoRouter };
