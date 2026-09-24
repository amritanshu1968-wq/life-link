import { Request, Response, NextFunction } from 'express';
import { HospitalService } from '../services/hospitalService';
import { AuthenticatedRequest } from '../types';

export class HospitalController {
  static async getAllHospitals(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HospitalService.getAllHospitals();
      return res.status(200).json({
        success: true,
        message: 'Registered hospitals retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await HospitalService.getProfile(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Hospital profile retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHospitalRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await HospitalService.getHospitalRequests(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Hospital requests retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
