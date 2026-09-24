import { Router } from 'express';
import { DonorController } from '../controllers/donorController';
import { requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth, requireRole(Role.DONOR, Role.ADMIN));

router.get('/me', DonorController.getProfile);
router.put('/availability', DonorController.updateAvailability);
router.get('/requests', DonorController.getMatchingRequests);
router.get('/responses', DonorController.getResponses);
router.get('/donations', DonorController.getDonations);

export default router;
