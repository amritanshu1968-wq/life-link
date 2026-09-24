import { PrismaClient, Role, UserStatus, BloodGroup, Urgency, RequestStatus, VerificationStatus, InventoryStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LIFE-LINK realistic database seed...');

  // Hash default passwords
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Clear existing data
  await prisma.aIAnalysis.deleteMany();
  await prisma.donorResponse.deleteMany();
  await prisma.donationRecord.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.bloodInventory.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.donorProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.bloodBank.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@lifelink.org',
      phone: '+919876543210',
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // 3. Create Donors
  const donor1User = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+919812345678',
      passwordHash,
      role: Role.DONOR,
      status: UserStatus.ACTIVE,
      donorProfile: {
        create: {
          bloodGroup: BloodGroup.O_POSITIVE,
          city: 'Lucknow',
          area: 'Hazratganj',
          postalCode: '226001',
          latitude: 26.8467,
          longitude: 80.9462,
          isAvailable: true,
          verificationStatus: VerificationStatus.VERIFIED,
          notificationPreference: 'IN_APP',
        },
      },
    },
    include: { donorProfile: true },
  });

  const donor2User = await prisma.user.create({
    data: {
      name: 'Priya Verma',
      email: 'priya.verma@gmail.com',
      phone: '+919823456789',
      passwordHash,
      role: Role.DONOR,
      status: UserStatus.ACTIVE,
      donorProfile: {
        create: {
          bloodGroup: BloodGroup.A_NEGATIVE,
          city: 'Lucknow',
          area: 'Gomti Nagar',
          postalCode: '226010',
          latitude: 26.8500,
          longitude: 80.9999,
          isAvailable: true,
          verificationStatus: VerificationStatus.VERIFIED,
          notificationPreference: 'IN_APP',
        },
      },
    },
    include: { donorProfile: true },
  });

  const donor3User = await prisma.user.create({
    data: {
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      phone: '+919834567890',
      passwordHash,
      role: Role.DONOR,
      status: UserStatus.ACTIVE,
      donorProfile: {
        create: {
          bloodGroup: BloodGroup.B_POSITIVE,
          city: 'Kanpur',
          area: 'Civil Lines',
          postalCode: '208001',
          latitude: 26.4499,
          longitude: 80.3319,
          isAvailable: true,
          verificationStatus: VerificationStatus.VERIFIED,
          notificationPreference: 'IN_APP',
        },
      },
    },
    include: { donorProfile: true },
  });

  // 4. Create Requester User
  const requesterUser = await prisma.user.create({
    data: {
      name: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      phone: '+919845678901',
      passwordHash,
      role: Role.REQUESTER,
      status: UserStatus.ACTIVE,
      patientProfile: {
        create: {
          basicInformation: 'Emergency trauma relative requester',
          city: 'Lucknow',
        },
      },
    },
  });

  // 5. Create Hospital User
  const hospitalUser = await prisma.user.create({
    data: {
      name: 'Dr. Sunita Mehta',
      email: 'hospital.admin@apexhealth.org',
      phone: '+919856789012',
      passwordHash,
      role: Role.HOSPITAL,
      status: UserStatus.ACTIVE,
      hospitalProfile: {
        create: {
          hospitalName: 'Apex Super Speciality Hospital',
          address: 'Plot 12, Sector 4, Gomti Nagar Phase 2',
          city: 'Lucknow',
          area: 'Gomti Nagar',
          postalCode: '226010',
          latitude: 26.8520,
          longitude: 81.0020,
          verificationStatus: VerificationStatus.VERIFIED,
        },
      },
    },
    include: { hospitalProfile: true },
  });

  // 6. Create Blood Bank User
  const bloodBankUser = await prisma.user.create({
    data: {
      name: 'City Blood Bank Admin',
      email: 'inventory@citybloodbank.org',
      phone: '+919867890123',
      passwordHash,
      role: Role.BLOOD_BANK,
      status: UserStatus.ACTIVE,
      bloodBankProfile: {
        create: {
          bankName: 'Regional City Blood Bank & Reserve',
          address: 'Building B, MG Marg, Hazratganj',
          city: 'Lucknow',
          area: 'Hazratganj',
          postalCode: '226001',
          latitude: 26.8480,
          longitude: 80.9480,
          verificationStatus: VerificationStatus.VERIFIED,
        },
      },
    },
    include: { bloodBankProfile: true },
  });

  console.log('👤 Seeded 5 Roles (Admin, Donors, Requester, Hospital, Blood Bank).');

  // 7. Seed Initial Blood Requests
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const request1 = await prisma.bloodRequest.create({
    data: {
      requestCode: `LL-${todayStr}-0001`,
      requesterId: requesterUser.id,
      hospitalId: hospitalUser.hospitalProfile!.id,
      bloodGroup: BloodGroup.O_POSITIVE,
      unitsRequired: 3,
      urgency: Urgency.EMERGENCY,
      city: 'Lucknow',
      area: 'Hazratganj',
      postalCode: '226001',
      latitude: 26.8467,
      longitude: 80.9462,
      requiredDateTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      reason: 'Accident trauma surgery requiring urgent O+ units',
      status: RequestStatus.OPEN,
    },
  });

  const request2 = await prisma.bloodRequest.create({
    data: {
      requestCode: `LL-${todayStr}-0002`,
      requesterId: hospitalUser.id,
      hospitalId: hospitalUser.hospitalProfile!.id,
      bloodGroup: BloodGroup.A_NEGATIVE,
      unitsRequired: 2,
      urgency: Urgency.URGENT,
      city: 'Lucknow',
      area: 'Gomti Nagar',
      postalCode: '226010',
      latitude: 26.8500,
      longitude: 80.9999,
      requiredDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      reason: 'Scheduled cardiovascular procedure',
      status: RequestStatus.MATCHING,
    },
  });

  console.log('🩸 Seeded Blood Requests.');

  // 8. Seed Donor Response to Request 1
  if (donor1User.donorProfile) {
    await prisma.donorResponse.create({
      data: {
        bloodRequestId: request1.id,
        donorId: donor1User.donorProfile.id,
        responseStatus: 'ACCEPTED',
        notes: 'Can reach hospital within 45 minutes.',
      },
    });
  }

  // 9. Seed Blood Bank Inventory (All 8 Blood Groups)
  const bloodGroupsList = Object.values(BloodGroup);
  const stockUnits = [12, 5, 8, 2, 6, 1, 15, 4];

  for (let i = 0; i < bloodGroupsList.length; i++) {
    const bg = bloodGroupsList[i];
    const units = stockUnits[i];
    const status = units > 5 ? InventoryStatus.AVAILABLE : units > 0 ? InventoryStatus.LOW : InventoryStatus.OUT_OF_STOCK;

    await prisma.bloodInventory.create({
      data: {
        bloodBankId: bloodBankUser.bloodBankProfile!.id,
        bloodGroup: bg,
        unitsAvailable: units,
        location: 'Cold Storage Room 2',
        status: status,
      },
    });
  }

  console.log('🏥 Seeded Blood Bank Inventory across all 8 ABO/Rh groups.');

  // 10. Seed Initial Notifications
  await prisma.notification.create({
    data: {
      userId: donor1User.id,
      type: NotificationType.EMERGENCY_ESCALATION,
      title: '🚨 EMERGENCY Blood Request Nearby',
      message: 'Urgent 3 units of O+ blood needed at Apex Super Speciality Hospital (approx 2 km away).',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: requesterUser.id,
      type: NotificationType.DONOR_ACCEPTED,
      title: 'Donor Accepted Your Request',
      message: 'Rahul Sharma (O+) has accepted your blood request REQ-1001.',
      isRead: true,
    },
  });

  // 11. Seed Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'SYSTEM',
      entityId: 'SYS_001',
      description: 'LIFE-LINK database seeded successfully with initial test profiles and live inventory.',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
