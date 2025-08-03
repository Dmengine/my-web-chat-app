import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).send({
        message: 'No token provided',
        success: false
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded:any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = { _id: decoded._id || decoded.id };


    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send({
      message: 'Unauthorized',
      success: false
    });
  }
};
