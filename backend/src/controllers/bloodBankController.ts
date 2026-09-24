import { Response, NextFunction } from 'express';
import { BloodBankService } from '../services/bloodBankService';
import { AuthenticatedRequest } from '../types';

export class BloodBankController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await BloodBankService.getProfile(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Blood bank profile retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const bank = await BloodBankService.getProfile(req.user!.userId);
      const data = await BloodBankService.getInventory(bank.id);
      return res.status(200).json({
        success: true,
        message: 'Inventory stock list retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateInventory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await BloodBankService.updateInventory(req.user!.userId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Blood bank inventory stock updated successfully.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
