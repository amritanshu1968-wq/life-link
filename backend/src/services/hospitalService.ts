import { prisma } from '../config/db';
import { NotFoundError } from '../errors';

export class HospitalService {
  static async getProfile(userId: string) {
    const hospital = await prisma.hospital.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    if (!hospital) {
      throw new NotFoundError('Hospital profile not found.');
    }

    return hospital;
  }

  /**
   * Get all active and historical blood requests associated with this hospital facility or user.
   */
  static async getHospitalRequests(userId: string) {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });

    // Match requests where hospitalId equals hospital.id OR requesterId equals userId
    const whereClause = hospital
      ? { OR: [{ hospitalId: hospital.id }, { requesterId: userId }] }
      : { requesterId: userId };

    const requests = await prisma.bloodRequest.findMany({
      where: whereClause,
      include: {
        requester: { select: { id: true, name: true, phone: true } },
        hospital: true,
        donorResponses: {
          include: {
            donor: {
              include: { user: { select: { id: true, name: true, phone: true } } },
            },
          },
          orderBy: { respondedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((req) => ({
      ...req,
      requestCode: req.requestCode || `LL-${req.id.slice(0, 8)}`,
    }));
  }

  /**
   * Get public listing of all registered hospitals.
   */
  static async getAllHospitals() {
    const hospitals = await prisma.hospital.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { hospitalName: 'asc' },
    });

    return hospitals.map((h) => ({
      id: h.id,
      name: h.hospitalName,
      address: h.address,
      city: h.city,
      area: h.area,
      postalCode: h.postalCode,
      status: h.verificationStatus,
    }));
  }
}
