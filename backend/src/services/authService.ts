import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, UserStatus, VerificationStatus, BloodGroup } from '@prisma/client';
import { prisma } from '../config/db';
import { config } from '../config';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors';
import { mapStringToEnum } from '../utils/compatibility';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    // Optional role profiles
    bloodGroup?: string;
    city?: string;
    area?: string;
    postalCode?: string;
    hospitalName?: string;
    address?: string;
    bankName?: string;
  }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      throw new ConflictError('User with this email or phone number already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: data.role,
          status: UserStatus.ACTIVE,
        },
      });

      // Role Profile Initialization
      if (data.role === Role.DONOR) {
        await tx.donorProfile.create({
          data: {
            userId: user.id,
            bloodGroup: mapStringToEnum(data.bloodGroup || 'O+'),
            city: data.city || 'Lucknow',
            area: data.area || 'Central',
            postalCode: data.postalCode || '226001',
            isAvailable: true,
            verificationStatus: VerificationStatus.VERIFIED,
          },
        });
      } else if (data.role === Role.REQUESTER) {
        await tx.patientProfile.create({
          data: {
            userId: user.id,
            city: data.city || 'Lucknow',
            basicInformation: 'Registered Requester',
          },
        });
      } else if (data.role === Role.HOSPITAL) {
        await tx.hospital.create({
          data: {
            userId: user.id,
            hospitalName: data.hospitalName || `${data.name}'s Medical Facility`,
            address: data.address || 'Central Road',
            city: data.city || 'Lucknow',
            area: data.area || 'Central',
            postalCode: data.postalCode || '226001',
            verificationStatus: VerificationStatus.PENDING,
          },
        });
        await tx.verification.create({
          data: {
            userId: user.id,
            entityType: 'HOSPITAL',
            status: VerificationStatus.PENDING,
            remarks: 'Pending administrative verification review',
          },
        });
      } else if (data.role === Role.BLOOD_BANK) {
        await tx.bloodBank.create({
          data: {
            userId: user.id,
            bankName: data.bankName || `${data.name} Blood Bank`,
            address: data.address || 'Central Road',
            city: data.city || 'Lucknow',
            area: data.area || 'Central',
            postalCode: data.postalCode || '226001',
            verificationStatus: VerificationStatus.PENDING,
          },
        });
        await tx.verification.create({
          data: {
            userId: user.id,
            entityType: 'BLOOD_BANK',
            status: VerificationStatus.PENDING,
            remarks: 'Pending administrative verification review',
          },
        });
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          entityType: 'USER',
          entityId: user.id,
          description: `User ${user.name} registered with role ${user.role}.`,
        },
      });

      return user;
    });

    const token = jwt.sign(
      { userId: result.id, role: result.role, email: result.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    return {
      token,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role,
        status: result.status,
      },
    };
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        donorProfile: true,
        hospitalProfile: true,
        bloodBankProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedError('Account is suspended. Please contact administrator.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        donorProfile: user.donorProfile,
        hospitalProfile: user.hospitalProfile,
        bloodBankProfile: user.bloodBankProfile,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        donorProfile: true,
        patientProfile: true,
        hospitalProfile: true,
        bloodBankProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
