import { Router } from 'express';
import { BloodBankController } from '../controllers/bloodBankController';
import { requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Inventory route can be viewed by authenticated users
router.get('/inventory', requireAuth, BloodBankController.getInventory);

// Admin / Blood Bank specific management
router.get('/me', requireAuth, requireRole(Role.BLOOD_BANK, Role.ADMIN), BloodBankController.getProfile);
router.post('/inventory', requireAuth, requireRole(Role.BLOOD_BANK, Role.ADMIN), BloodBankController.updateInventory);
router.put('/inventory/:id', requireAuth, requireRole(Role.BLOOD_BANK, Role.ADMIN), BloodBankController.updateInventory);

export default router;
