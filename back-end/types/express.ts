// types/express.ts
import { Request } from 'express';
import { User } from '../model/user';

export interface AuthenticatedRequest extends Request {
    user?: User;
}