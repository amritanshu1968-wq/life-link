import { Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { AuthenticatedRequest } from '../types';
import { UserStatus, VerificationStatus } from '@prisma/client';

export class AdminController {
  static async getStatistics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getStatistics();
      return res.status(200).json({
        success: true,
        message: 'System statistics retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getUsers();
      return res.status(200).json({
        success: true,
        message: 'User account list retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const adminUserId = req.user!.userId;
      const targetUserId = req.params.id;
      const { status } = req.body;

      const data = await AdminService.updateUserStatus(adminUserId, targetUserId, status as UserStatus);
      return res.status(200).json({
        success: true,
        message: 'User account status updated.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVerifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getVerifications();
      return res.status(200).json({
        success: true,
        message: 'Verification requests retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateVerificationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const adminUserId = req.user!.userId;
      const verificationId = req.params.id;
      const { status, remarks } = req.body;

      const data = await AdminService.updateVerificationStatus(
        adminUserId,
        verificationId,
        status as VerificationStatus,
        remarks
      );

      return res.status(200).json({
        success: true,
        message: 'Verification status updated successfully.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getAuditLogs();
      return res.status(200).json({
        success: true,
        message: 'System audit logs retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
