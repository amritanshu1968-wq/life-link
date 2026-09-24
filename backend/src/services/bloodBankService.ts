import { InventoryStatus } from '@prisma/client';
import { prisma } from '../config/db';
import { NotFoundError } from '../errors';
import { mapStringToEnum } from '../utils/compatibility';

export class BloodBankService {
  static async getProfile(userId: string) {
    const bank = await prisma.bloodBank.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    if (!bank) throw new NotFoundError('Blood Bank profile not found.');
    return bank;
  }

  static async getInventory(bankId: string) {
    const inventory = await prisma.bloodInventory.findMany({
      where: { bloodBankId: bankId },
      orderBy: { bloodGroup: 'asc' },
    });

    return {
      disclaimer: 'Inventory stock levels represent recorded updates. Availability should be confirmed before dispatch.',
      inventory,
    };
  }

  static async updateInventory(userId: string, data: {
    bloodGroup: string;
    unitsAvailable: number;
    location?: string;
  }) {
    const bank = await prisma.bloodBank.findUnique({ where: { userId } });
    if (!bank) throw new NotFoundError('Blood bank profile not found.');

    const enumGroup = mapStringToEnum(data.bloodGroup);
    const units = Number(data.unitsAvailable) || 0;

    let status: InventoryStatus = InventoryStatus.AVAILABLE;
    if (units === 0) status = InventoryStatus.OUT_OF_STOCK;
    else if (units <= 3) status = InventoryStatus.LOW;

    const existingItem = await prisma.bloodInventory.findFirst({
      where: {
        bloodBankId: bank.id,
        bloodGroup: enumGroup,
      },
    });

    const now = new Date();

    let updatedItem;
    if (existingItem) {
      updatedItem = await prisma.bloodInventory.update({
        where: { id: existingItem.id },
        data: {
          unitsAvailable: units,
          status,
          location: data.location || existingItem.location,
          lastUpdated: now,
        },
      });
    } else {
      updatedItem = await prisma.bloodInventory.create({
        data: {
          bloodBankId: bank.id,
          bloodGroup: enumGroup,
          unitsAvailable: units,
          location: data.location || 'Storage Unit 1',
          status,
          lastUpdated: now,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'INVENTORY_UPDATED',
        entityType: 'BLOOD_INVENTORY',
        entityId: updatedItem.id,
        description: `Updated inventory for ${data.bloodGroup} to ${units} units.`,
      },
    });

    return updatedItem;
  }
}
