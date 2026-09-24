import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));

router.get('/statistics', AdminController.getStatistics);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.get('/verifications', AdminController.getVerifications);
router.put('/verifications/:id', AdminController.updateVerificationStatus);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
