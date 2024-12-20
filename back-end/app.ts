import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { orderRouter } from './controller/order.routes';
import { subRouter } from './controller/subscription.routes';
import { beurtRouter } from './controller/beurtenkaart.routes';
import { ticketRouter } from './controller/ticket.routes';
import { promoRouter } from './controller/promo.routes';
import helmet from 'helmet';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'], // Add both frontend and backend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());

app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/subscriptions', subRouter);
app.use('/beurtenkaarten', beurtRouter);
app.use('/tickets', ticketRouter);
app.use('/promocodes', promoRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'CoursesError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});