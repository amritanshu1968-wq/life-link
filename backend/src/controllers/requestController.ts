import { Response, NextFunction } from 'express';
import { RequestService } from '../services/requestService';
import { AuthenticatedRequest } from '../types';
import { RequestStatus, Urgency } from '@prisma/client';

export class RequestController {
  static async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const requesterId = req.user!.userId;
      const data = await RequestService.createRequest({
        requesterId,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: 'Blood request ticket created successfully and nearby donors notified.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, city, bloodGroup, urgency, includeFulfilled } = req.query;
      const data = await RequestService.getRequests({
        status: status as RequestStatus,
        city: city as string,
        bloodGroup: bloodGroup as string,
        urgency: urgency as Urgency,
        includeFulfilled: includeFulfilled === 'true',
        user: req.user,
      });

      return res.status(200).json({
        success: true,
        message: 'Blood requests retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRequestById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await RequestService.getRequestById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        message: 'Blood request details retrieved.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async respondToRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const donorUserId = req.user!.userId;
      const bloodRequestId = req.params.id;
      const { responseStatus, notes } = req.body;

      const data = await RequestService.respondToRequest({
        bloodRequestId,
        donorUserId,
        responseStatus,
        notes,
      });

      return res.status(200).json({
        success: true,
        message: `Response submitted successfully with status ${responseStatus}.`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async withdrawResponse(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const donorUserId = req.user!.userId;
      const bloodRequestId = req.params.id;
      const { withdrawalReason, notes } = req.body;

      const data = await RequestService.withdrawResponse({
        bloodRequestId,
        donorUserId,
        withdrawalReason: withdrawalReason || 'NO_LONGER_AVAILABLE',
        notes,
      });

      return res.status(200).json({
        success: true,
        message: 'Donor response withdrawn successfully. Hospital notified.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fulfillRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = await RequestService.fulfillRequest(req.params.id, userId);

      return res.status(200).json({
        success: true,
        message: 'Blood request ticket marked as FULFILLED.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = await RequestService.cancelRequest(req.params.id, userId);

      return res.status(200).json({
        success: true,
        message: 'Blood request ticket cancelled.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
