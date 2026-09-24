import { Router } from 'express';
import authRoutes from './authRoutes';
import donorRoutes from './donorRoutes';
import requestRoutes from './requestRoutes';
import hospitalRoutes from './hospitalRoutes';
import bloodBankRoutes from './bloodBankRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/blood-requests', requestRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/blood-banks', bloodBankRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
