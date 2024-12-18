import { Router } from 'express';
import promotionService from '../service/promo.service';// Adjust the import path as necessary
import express, { NextFunction, Request, Response } from 'express';


const promoRouter = express.Router();

promoRouter.post('/validate', async (req, res) => {
    const { code } = req.body;

    try {
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

export { promoRouter};