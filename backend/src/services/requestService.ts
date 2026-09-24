import { RequestStatus, Urgency, ResponseStatus, NotificationType } from '@prisma/client';
import { prisma } from '../config/db';
import { BadRequestError, NotFoundError, ForbiddenError, ConflictError } from '../errors';
import { mapStringToEnum, COMPATIBILITY_MEDICAL_DISCLAIMER } from '../utils/compatibility';
import { BloodMatchingService } from './matchingService';
import { NotificationService } from './notificationService';
import { generateUniqueRequestCode } from '../utils/requestCode';

export class RequestService {
  /**
   * Helper DTO Sanitizer enforcing Privacy Rules on Request Codes & Personal Data.
   */
  static sanitizeRequestForUser(request: any, userPayload?: { userId: string; role: string }) {
    if (!request) return null;

    let canSeeRequestCode = false;

    if (userPayload) {
      // 1. Admin can see request code
      if (userPayload.role === 'ADMIN') {
        canSeeRequestCode = true;
      }
      // 2. Creator (Requester) can see request code
      else if (request.requesterId === userPayload.userId) {
        canSeeRequestCode = true;
      }
      // 3. Hospital handling the request can see request code
      else if (request.hospital?.userId === userPayload.userId) {
        canSeeRequestCode = true;
      }
      // 4. Donor who ACCEPTED this request can see request code
      else if (userPayload.role === 'DONOR') {
        const donorResponse = request.donorResponses?.find(
          (r: any) => (r.donor?.userId === userPayload.userId || r.donorId === userPayload.userId) && r.responseStatus === ResponseStatus.ACCEPTED
        );
        if (donorResponse) {
          canSeeRequestCode = true;
        }
      }
    }

    // Build public vs private sanitized object
    const sanitized = {
      ...request,
      requestCode: canSeeRequestCode ? (request.requestCode || `LL-${request.id.slice(0, 8)}`) : null,
    };

    return sanitized;
  }

  /**
   * Create a new blood request ticket and initiate donor matching.
   */
  static async createRequest(data: {
    requesterId: string;
    hospitalId?: string;
    bloodGroup: string;
    unitsRequired: number;
    urgency: Urgency;
    city: string;
    area: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    requiredDateTime: Date | string;
    reason?: string;
  }) {
    const enumGroup = mapStringToEnum(data.bloodGroup);
    const requestCode = await generateUniqueRequestCode();

    const bloodRequest = await prisma.$transaction(async (tx) => {
      const request = await tx.bloodRequest.create({
        data: {
          requestCode,
          requesterId: data.requesterId,
          hospitalId: data.hospitalId || null,
          bloodGroup: enumGroup,
          unitsRequired: Number(data.unitsRequired) || 1,
          urgency: data.urgency || Urgency.NORMAL,
          city: data.city,
          area: data.area,
          postalCode: data.postalCode,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          requiredDateTime: new Date(data.requiredDateTime),
          reason: data.reason || 'Medical emergency request',
          status: RequestStatus.OPEN,
        },
      });

      // Audit Log Creation
      await tx.auditLog.create({
        data: {
          userId: data.requesterId,
          action: 'BLOOD_REQUEST_CREATED',
          entityType: 'BLOOD_REQUEST',
          entityId: request.id,
          description: `Created ${request.urgency} blood request (${request.requestCode}) for ${request.unitsRequired} units of ${request.bloodGroup} in ${request.city}.`,
        },
      });

      return request;
    });

    // Initiate matching and notifications asynchronously
    const matchingResult = await BloodMatchingService.findMatchingDonors({
      bloodGroup: data.bloodGroup,
      city: data.city,
      area: data.area,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    // Auto-update request status to MATCHING if candidate donors exist
    if (matchingResult.matchingDonorsCount > 0) {
      await prisma.bloodRequest.update({
        where: { id: bloodRequest.id },
        data: { status: RequestStatus.MATCHING },
      });

      // Dispatch notifications to compatible nearby donors
      for (const candidate of matchingResult.donors) {
        await NotificationService.createNotification({
          userId: candidate.donorId,
          type: data.urgency === Urgency.EMERGENCY ? NotificationType.EMERGENCY_ESCALATION : NotificationType.MATCHING_REQUEST,
          title: data.urgency === Urgency.EMERGENCY ? '🚨 EMERGENCY Blood Request Nearby' : 'Matching Blood Request',
          message: `Potentially compatible request for ${data.unitsRequired} unit(s) of ${data.bloodGroup} in ${data.city} (${candidate.approximateDistanceKm} km away).`,
        });
      }
    }

    return {
      request: RequestService.sanitizeRequestForUser(bloodRequest, { userId: data.requesterId, role: 'REQUESTER' }),
      matchingSummary: matchingResult,
      medicalDisclaimer: COMPATIBILITY_MEDICAL_DISCLAIMER,
    };
  }

  /**
   * List blood requests with optional status, city, blood group filters.
   * Note: Excludes FULFILLED, CANCELLED, and EXPIRED requests from public active listings by default.
   */
  static async getRequests(filters: {
    status?: RequestStatus;
    city?: string;
    bloodGroup?: string;
    urgency?: Urgency;
    includeFulfilled?: boolean;
    user?: { userId: string; role: string };
  }) {
    const whereClause: any = {};

    if (filters.status) {
      whereClause.status = filters.status;
    } else if (!filters.includeFulfilled) {
      // Exclude FULFILLED, CANCELLED, EXPIRED from active requests
      whereClause.status = {
        in: [
          RequestStatus.OPEN,
          RequestStatus.MATCHING,
          RequestStatus.RESPONSES_RECEIVED,
          RequestStatus.DONOR_CONFIRMED,
          RequestStatus.PARTIALLY_FULFILLED,
        ],
      };
    }

    if (filters.city) whereClause.city = filters.city;
    if (filters.urgency) whereClause.urgency = filters.urgency;
    if (filters.bloodGroup) whereClause.bloodGroup = mapStringToEnum(filters.bloodGroup);

    const requests = await prisma.bloodRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: { id: true, name: true, phone: true, email: true },
        },
        hospital: true,
        donorResponses: {
          include: {
            donor: {
              include: { user: { select: { id: true, name: true } } },
            },
          },
        },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    });

    return requests.map((req) => RequestService.sanitizeRequestForUser(req, filters.user));
  }

  /**
   * Get single blood request details with full responses and matching summary.
   */
  static async getRequestById(id: string, userPayload?: { userId: string; role: string }) {
    const request = await prisma.bloodRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: { id: true, name: true, phone: true, email: true },
        },
        hospital: true,
        donorResponses: {
          include: {
            donor: {
              include: {
                user: { select: { id: true, name: true, phone: true } },
              },
            },
          },
        },
        aiAnalyses: true,
      },
    });

    if (!request) {
      throw new NotFoundError('Blood request ticket not found.');
    }

    const sanitized = RequestService.sanitizeRequestForUser(request, userPayload);

    return {
      ...sanitized,
      medicalDisclaimer: COMPATIBILITY_MEDICAL_DISCLAIMER,
    };
  }

  /**
   * Process Donor Response to a Request (Accept/Decline) with Concurrency Lock via MySQL Transaction.
   */
  static async respondToRequest(data: {
    bloodRequestId: string;
    donorUserId: string;
    responseStatus: ResponseStatus;
    notes?: string;
  }) {
    // 1. Fetch donor profile
    const donorProfile = await prisma.donorProfile.findUnique({
      where: { userId: data.donorUserId },
    });

    if (!donorProfile) {
      throw new NotFoundError('Donor profile not found for this account.');
    }

    // 2. MySQL Transaction for Concurrency Safety
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.bloodRequest.findUnique({
        where: { id: data.bloodRequestId },
        include: { donorResponses: true },
      });

      if (!request) {
        throw new NotFoundError('Blood request not found.');
      }

      if (['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(request.status)) {
        throw new BadRequestError(`Cannot respond to a request with status ${request.status}.`);
      }

      // Check existing response
      const existingResponse = await tx.donorResponse.findUnique({
        where: {
          bloodRequestId_donorId: {
            bloodRequestId: data.bloodRequestId,
            donorId: donorProfile.id,
          },
        },
      });

      if (existingResponse && existingResponse.responseStatus === ResponseStatus.ACCEPTED && data.responseStatus === ResponseStatus.ACCEPTED) {
        throw new ConflictError('You have already accepted this blood request.');
      }

      // Check remaining required units
      const acceptedResponses = request.donorResponses.filter(
        (r) => r.responseStatus === ResponseStatus.ACCEPTED
      );

      if (data.responseStatus === ResponseStatus.ACCEPTED && acceptedResponses.length >= request.unitsRequired) {
        throw new BadRequestError('This blood request has already reached its required donor response quota.');
      }

      let newResponse;
      if (existingResponse) {
        newResponse = await tx.donorResponse.update({
          where: { id: existingResponse.id },
          data: {
            previousStatus: existingResponse.responseStatus,
            responseStatus: data.responseStatus,
            notes: data.notes || existingResponse.notes,
            respondedAt: new Date(),
          },
        });
      } else {
        newResponse = await tx.donorResponse.create({
          data: {
            bloodRequestId: data.bloodRequestId,
            donorId: donorProfile.id,
            responseStatus: data.responseStatus,
            notes: data.notes || '',
          },
        });
      }

      // Evaluate new state progression
      let nextStatus: RequestStatus = request.status;
      if (data.responseStatus === ResponseStatus.ACCEPTED) {
        const newAcceptedCount = acceptedResponses.length + (existingResponse ? 0 : 1);
        if (newAcceptedCount >= request.unitsRequired) {
          nextStatus = RequestStatus.DONOR_CONFIRMED;
        } else {
          nextStatus = RequestStatus.RESPONSES_RECEIVED;
        }
      }

      if (nextStatus !== request.status) {
        await tx.bloodRequest.update({
          where: { id: request.id },
          data: { status: nextStatus },
        });
      }

      // Create Notification for Requester
      await tx.notification.create({
        data: {
          userId: request.requesterId,
          type: NotificationType.DONOR_ACCEPTED,
          title: 'Donor Responded to Blood Request',
          message: `A donor (${donorProfile.bloodGroup}) has set response status to ${data.responseStatus} for Request #${request.requestCode || request.id.slice(0, 8)}.`,
        },
      });

      // Also notify Hospital if linked
      if (request.hospitalId) {
        const hosp = await tx.hospital.findUnique({ where: { id: request.hospitalId } });
        if (hosp) {
          await tx.notification.create({
            data: {
              userId: hosp.userId,
              type: NotificationType.DONOR_ACCEPTED,
              title: 'Donor Responded to Blood Request',
              message: `A donor (${donorProfile.bloodGroup}) accepted Request #${request.requestCode || request.id.slice(0, 8)}.`,
            },
          });
        }
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: data.donorUserId,
          action: 'DONOR_RESPONDED',
          entityType: 'BLOOD_REQUEST',
          entityId: request.id,
          description: `Donor accepted blood request #${request.requestCode || request.id.slice(0, 8)} with status ${data.responseStatus}.`,
        },
      });

      return { response: newResponse, updatedRequestStatus: nextStatus };
    });

    return result;
  }

  /**
   * Post-Acceptance Donor Withdrawal ("Unable to Donate").
   * PRESERVES request.urgency (does NOT change NORMAL -> EMERGENCY).
   * Recalculates outstanding unit requirements & updates request status.
   */
  static async withdrawResponse(data: {
    bloodRequestId: string;
    donorUserId: string;
    withdrawalReason: string;
    notes?: string;
  }) {
    const donorProfile = await prisma.donorProfile.findUnique({
      where: { userId: data.donorUserId },
    });

    if (!donorProfile) {
      throw new NotFoundError('Donor profile not found.');
    }

    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.bloodRequest.findUnique({
        where: { id: data.bloodRequestId },
        include: { donorResponses: true, hospital: true },
      });

      if (!request) {
        throw new NotFoundError('Blood request ticket not found.');
      }

      // Find existing donor response
      const existingResponse = await tx.donorResponse.findUnique({
        where: {
          bloodRequestId_donorId: {
            bloodRequestId: data.bloodRequestId,
            donorId: donorProfile.id,
          },
        },
      });

      if (!existingResponse) {
        throw new NotFoundError('No existing response found to withdraw.');
      }

      // Authorization Check: Only donor who owns the response can withdraw it
      if (existingResponse.donorId !== donorProfile.id) {
        throw new ForbiddenError('You are not authorized to withdraw this response.');
      }

      if (existingResponse.responseStatus === ResponseStatus.WITHDRAWN) {
        throw new ConflictError('You have already withdrawn your response for this blood request.');
      }

      const previousStatus = existingResponse.responseStatus;

      // Update response status to WITHDRAWN and preserve previous status & withdrawal reason
      const updatedResponse = await tx.donorResponse.update({
        where: { id: existingResponse.id },
        data: {
          previousStatus,
          responseStatus: ResponseStatus.WITHDRAWN,
          withdrawalReason: data.withdrawalReason || 'NO_LONGER_AVAILABLE',
          notes: data.notes || existingResponse.notes,
        },
      });

      // Recalculate remaining accepted responses for the blood request
      const remainingAccepted = request.donorResponses.filter(
        (r) => r.id !== existingResponse.id && r.responseStatus === ResponseStatus.ACCEPTED
      );

      let nextStatus = request.status;
      if (request.status !== RequestStatus.FULFILLED && request.status !== RequestStatus.CANCELLED) {
        if (remainingAccepted.length === 0) {
          nextStatus = RequestStatus.MATCHING;
        } else if (remainingAccepted.length < request.unitsRequired) {
          nextStatus = RequestStatus.RESPONSES_RECEIVED;
        }
      }

      // Update request status without modifying URGENCY
      if (nextStatus !== request.status) {
        await tx.bloodRequest.update({
          where: { id: request.id },
          data: {
            status: nextStatus,
            // CRITICAL: Request urgency MUST remain unchanged!
            urgency: request.urgency,
          },
        });
      }

      const reqCode = request.requestCode || `LL-${request.id.slice(0, 8)}`;

      // Notify Requester
      await tx.notification.create({
        data: {
          userId: request.requesterId,
          type: NotificationType.DONOR_WITHDREW,
          title: 'Donor Withdrawal Notification',
          message: `A previously accepted donor is no longer available for Request #${reqCode} (Reason: ${data.withdrawalReason.replace(/_/g, ' ')}).`,
        },
      });

      // Notify Hospital if linked
      if (request.hospital?.userId) {
        await tx.notification.create({
          data: {
            userId: request.hospital.userId,
            type: NotificationType.DONOR_WITHDREW,
            title: 'Donor Withdrawal Alert',
            message: `Donor withdrawn for Request #${reqCode}. Remaining confirmed donors: ${remainingAccepted.length}/${request.unitsRequired}.`,
          },
        });
      }

      // Audit Trail
      await tx.auditLog.create({
        data: {
          userId: data.donorUserId,
          action: 'DONOR_WITHDREW',
          entityType: 'BLOOD_REQUEST',
          entityId: request.id,
          description: `Donor withdrew response for Request #${reqCode}. Previous Status: ${previousStatus}, Reason: ${data.withdrawalReason}.`,
        },
      });

      return {
        response: updatedResponse,
        updatedRequestStatus: nextStatus,
        remainingConfirmed: remainingAccepted.length,
        requestUrgency: request.urgency, // Preserved
      };
    });

    return result;
  }

  /**
   * Confirm fulfillment of a blood request.
   */
  static async fulfillRequest(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.bloodRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new NotFoundError('Request not found.');
      }

      const updated = await tx.bloodRequest.update({
        where: { id },
        data: { status: RequestStatus.FULFILLED },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'REQUEST_FULFILLED',
          entityType: 'BLOOD_REQUEST',
          entityId: id,
          description: `Blood request #${request.requestCode || id.slice(0, 8)} was marked as FULFILLED.`,
        },
      });

      await tx.notification.create({
        data: {
          userId: request.requesterId,
          type: NotificationType.REQUEST_FULFILLED,
          title: 'Request Fulfilled',
          message: `Your blood request #${request.requestCode || id.slice(0, 8)} has been successfully fulfilled. Thank you to all donors!`,
        },
      });

      return updated;
    });
  }

  /**
   * Cancel a blood request.
   */
  static async cancelRequest(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.bloodRequest.findUnique({ where: { id } });
      if (!request) throw new NotFoundError('Request not found.');

      const updated = await tx.bloodRequest.update({
        where: { id },
        data: { status: RequestStatus.CANCELLED },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'REQUEST_CANCELLED',
          entityType: 'BLOOD_REQUEST',
          entityId: id,
          description: `Blood request #${request.requestCode || id.slice(0, 8)} was cancelled by user.`,
        },
      });

      return updated;
    });
  }
}
