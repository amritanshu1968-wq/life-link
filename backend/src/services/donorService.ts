import { ResponseStatus, RequestStatus } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../errors';
import { BloodMatchingService } from './matchingService';
import { COMPATIBILITY_MEDICAL_DISCLAIMER } from '../utils/compatibility';

export class DonorService {
  /**
   * Get Donor Profile & Availability.
   */
  static async getProfile(userId: string) {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!profile) {
      throw new NotFoundError('Donor profile not found.');
    }

    return {
      ...profile,
      medicalDisclaimer: COMPATIBILITY_MEDICAL_DISCLAIMER,
    };
  }

  /**
   * Update Availability (ON/OFF toggle).
   */
  static async updateAvailability(userId: string, isAvailable: boolean) {
    const profile = await prisma.donorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Donor profile not found.');

    const updated = await prisma.donorProfile.update({
      where: { userId },
      data: { isAvailable },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DONOR_AVAILABILITY_UPDATED',
        entityType: 'DONOR_PROFILE',
        entityId: profile.id,
        description: `Donor availability updated to ${isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}.`,
      },
    });

    return updated;
  }

  /**
   * Get Nearby Matching Requests for this Donor.
   */
  static async getMatchingRequests(userId: string) {
    const profile = await prisma.donorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Donor profile not found.');

    // Find requests matching donor's city and compatible blood group
    const requests = await prisma.bloodRequest.findMany({
      where: {
        city: profile.city,
        status: { in: [RequestStatus.OPEN, RequestStatus.MATCHING, RequestStatus.RESPONSES_RECEIVED] },
      },
      include: {
        requester: { select: { name: true, phone: true } },
        hospital: true,
        donorResponses: {
          where: { donorId: profile.id },
        },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      medicalDisclaimer: COMPATIBILITY_MEDICAL_DISCLAIMER,
      requests: requests.map((r) => ({
        ...r,
        hasResponded: r.donorResponses.length > 0,
        donorResponse: r.donorResponses[0] || null,
      })),
    };
  }

  /**
   * Get Donor Response History.
   */
  static async getResponses(userId: string) {
    const profile = await prisma.donorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Donor profile not found.');

    return prisma.donorResponse.findMany({
      where: { donorId: profile.id },
      include: {
        bloodRequest: {
          include: { hospital: true, requester: { select: { name: true, phone: true } } },
        },
      },
      orderBy: { respondedAt: 'desc' },
    });
  }

  /**
   * Get Donation Records for Donor.
   */
  static async getDonations(userId: string) {
    const profile = await prisma.donorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Donor profile not found.');

    return prisma.donationRecord.findMany({
      where: { donorId: profile.id },
      include: { hospital: true, bloodRequest: true },
      orderBy: { donationDate: 'desc' },
    });
  }
}
