import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'F_wMoWC2jXN2cW2l-aLRtiNNShI9SfVPeEKXg5olAUQ';

export const getUserIdFromToken = (token: string): number | null => {
    console.log(token);
    console.log('JWT_SECRET in getUserIdFromToken:', JWT_SECRET);
    if (!token) return null;

    try {
        console.log('Token received:', token.substring(0, 20) + '...');
        const decoded = jwtDecode<JWTPayload>(token);
        console.log('Decoded token:', decoded);
        console.log('User ID from token:', decoded.id, typeof decoded.id);
        return decoded.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};