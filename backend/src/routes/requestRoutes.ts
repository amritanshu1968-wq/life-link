import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public / Optional Auth routes to view requests
router.get('/', optionalAuth, RequestController.getRequests);
router.get('/:id', optionalAuth, RequestController.getRequestById);

// Authenticated routes
router.post('/', requireAuth, RequestController.createRequest);
router.post('/:id/respond', requireAuth, requireRole(Role.DONOR), RequestController.respondToRequest);
router.post('/:id/withdraw', requireAuth, requireRole(Role.DONOR), RequestController.withdrawResponse);
router.post('/:id/fulfill', requireAuth, RequestController.fulfillRequest);
router.post('/:id/cancel', requireAuth, RequestController.cancelRequest);

export default router;
