import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { getDashboardStats, getComplaintsMap, getAllTickets } from './admin.controller.js';

const adminRouter = Router();
adminRouter.use(authMiddleware, requireRole('ADMIN', 'SUPERVISOR', 'OFFICER'));

adminRouter.get('/stats', getDashboardStats);
adminRouter.get('/map', getComplaintsMap);
adminRouter.get('/tickets', getAllTickets);

export { adminRouter };
