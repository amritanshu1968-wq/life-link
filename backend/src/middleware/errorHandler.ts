import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Express Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Prisma or unknown runtime errors without exposing raw internals
  return res.status(500).json({
    success: false,
    message: 'An internal server error occurred. Please try again later.',
  });
};
