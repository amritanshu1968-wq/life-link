import { Response, NextFunction } from 'express';
import { DonorService } from '../services/donorService';
import { AuthenticatedRequest } from '../types';

export class DonorController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await DonorService.getProfile(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Donor profile retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { isAvailable } = req.body;
      const data = await DonorService.updateAvailability(req.user!.userId, Boolean(isAvailable));
      return res.status(200).json({
        success: true,
        message: `Donor availability updated to ${isAvailable ? 'Available' : 'Unavailable'}.`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMatchingRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await DonorService.getMatchingRequests(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Matching blood requests retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getResponses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await DonorService.getResponses(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Donor response history retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDonations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await DonorService.getDonations(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Donation history retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
