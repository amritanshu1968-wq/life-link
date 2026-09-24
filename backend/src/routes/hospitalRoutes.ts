import { Router } from 'express';
import { HospitalController } from '../controllers/hospitalController';
import { requireAuth, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public route for hospital directory listing
router.get('/', HospitalController.getAllHospitals);

// Authenticated hospital portal routes
router.get('/me', requireAuth, requireRole(Role.HOSPITAL, Role.ADMIN), HospitalController.getProfile);
router.get('/requests', requireAuth, requireRole(Role.HOSPITAL, Role.ADMIN), HospitalController.getHospitalRequests);

export default router;
