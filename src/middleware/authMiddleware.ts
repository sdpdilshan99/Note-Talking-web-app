import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        
            try {
                token = req.headers.authorization.split(' ')[1];

                const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

                req.user = await User.findById(decoded.id).select('-password');

                next();
            } catch (error) {
                console.error(error);
                res.status(401).json({ message: 'Not authorized, token failed' });
            }
    }

    if(!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
    
}