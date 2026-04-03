import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization") || (req.headers["authorization"] as string);

  if (!authHeader) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(400).json({ message: "Invalid Token" });
  }
};
