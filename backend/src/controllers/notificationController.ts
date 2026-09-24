import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { AuthenticatedRequest } from '../types';

export class NotificationController {
  static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await NotificationService.getUserNotifications(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Notifications retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAsRead(req.params.id, req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'Notification marked as read.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.userId);
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
      });
    } catch (error) {
      next(error);
    }
  }
}
