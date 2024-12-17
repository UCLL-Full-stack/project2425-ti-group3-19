// middleware/authenticateUser.ts
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { User } from '../model/user';
import userService from '../service/user.service';

interface JWTPayload {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'F_wMoWC2jXN2cW2l-aLRtiNNShI9SfVPeEKXg5olAUQ';

const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    console.log('Authenticating request...'); // Log entry point
    console.log('Headers:', req.headers);
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        console.log('Token received:', token.substring(0, 20) + '...');
        const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
        console.log('Decoded token:', decoded);
        console.log('User ID from token:', decoded.id, typeof decoded.id);
        
        const userId = Number(decoded.id);
        console.log('Parsed user ID:', userId, typeof userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID in token' });
        }

        const user = await userService.getUserById(userId);
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export { authenticateUser };