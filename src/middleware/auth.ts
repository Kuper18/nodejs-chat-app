import 'express';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).send({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.sub = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Access denied. Invalid token provided.' });
  }
}
