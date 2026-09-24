import { VerificationStatus, UserStatus, RequestStatus, Role, Urgency } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../errors';

export class AdminService {
  static async getStatistics() {
    const totalUsers = await prisma.user.count();
    const activeDonors = await prisma.donorProfile.count({
      where: { isAvailable: true, verificationStatus: VerificationStatus.VERIFIED },
    });
    const openRequests = await prisma.bloodRequest.count({
      where: { status: { in: [RequestStatus.OPEN, RequestStatus.MATCHING] } },
    });
    const emergencyRequests = await prisma.bloodRequest.count({
      where: { urgency: Urgency.EMERGENCY, status: { notIn: [RequestStatus.FULFILLED, RequestStatus.CANCELLED] } },
    });
    const verifiedHospitals = await prisma.hospital.count({
      where: { verificationStatus: VerificationStatus.VERIFIED },
    });
    const verifiedBloodBanks = await prisma.bloodBank.count({
      where: { verificationStatus: VerificationStatus.VERIFIED },
    });
    const fulfilledRequests = await prisma.bloodRequest.count({
      where: { status: RequestStatus.FULFILLED },
    });

    return {
      totalUsers,
      activeDonors,
      openRequests,
      emergencyRequests,
      verifiedHospitals,
      verifiedBloodBanks,
      fulfilledRequests,
    };
  }

  static async getUsers() {
    const users = await prisma.user.findMany({
      include: {
        donorProfile: true,
        hospitalProfile: true,
        bloodBankProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => {
      const { passwordHash, ...rest } = u;
      return rest;
    });
  }

  static async updateUserStatus(adminUserId: string, targetUserId: string, status: UserStatus) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundError('User not found.');

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'USER_STATUS_UPDATED',
        entityType: 'USER',
        entityId: targetUserId,
        description: `User ${user.email} status changed to ${status}.`,
      },
    });

    return updated;
  }

  static async getVerifications() {
    // 1. Auto-sync missing hospital verification records
    const hospitals = await prisma.hospital.findMany();
    for (const h of hospitals) {
      const existing = await prisma.verification.findFirst({
        where: { userId: h.userId, entityType: 'HOSPITAL' },
      });
      if (!existing) {
        await prisma.verification.create({
          data: {
            userId: h.userId,
            entityType: 'HOSPITAL',
            status: h.verificationStatus,
            remarks: h.verificationStatus === 'VERIFIED' ? 'Pre-verified facility' : 'Pending administrative verification review',
          },
        });
      }
    }

    // 2. Auto-sync missing blood bank verification records
    const bloodBanks = await prisma.bloodBank.findMany();
    for (const b of bloodBanks) {
      const existing = await prisma.verification.findFirst({
        where: { userId: b.userId, entityType: 'BLOOD_BANK' },
      });
      if (!existing) {
        await prisma.verification.create({
          data: {
            userId: b.userId,
            entityType: 'BLOOD_BANK',
            status: b.verificationStatus,
            remarks: b.verificationStatus === 'VERIFIED' ? 'Pre-verified facility' : 'Pending administrative verification review',
          },
        });
      }
    }

    // 3. Fetch all verifications with associated user and facility details
    return prisma.verification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            hospitalProfile: { select: { hospitalName: true } },
            bloodBankProfile: { select: { bankName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateVerificationStatus(
    adminUserId: string,
    verificationId: string,
    status: VerificationStatus,
    remarks?: string
  ) {
    const verification = await prisma.verification.findUnique({ where: { id: verificationId } });
    if (!verification) throw new NotFoundError('Verification record not found.');

    const updated = await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status,
        remarks: remarks || '',
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
      },
    });

    // Also update target profile verification status
    if (verification.entityType === 'HOSPITAL') {
      await prisma.hospital.updateMany({
        where: { userId: verification.userId },
        data: { verificationStatus: status },
      });
    } else if (verification.entityType === 'BLOOD_BANK') {
      await prisma.bloodBank.updateMany({
        where: { userId: verification.userId },
        data: { verificationStatus: status },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'VERIFICATION_UPDATED',
        entityType: 'VERIFICATION',
        entityId: verificationId,
        description: `Verification status for user ${verification.userId} updated to ${status}.`,
      },
    });

    return updated;
  }

  static async getAuditLogs() {
    return prisma.auditLog.findMany({
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
