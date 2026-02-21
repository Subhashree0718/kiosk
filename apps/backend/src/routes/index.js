import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { departmentRouter } from '../modules/department/department.routes.js';
import { complaintRouter } from '../modules/complaint/complaint.routes.js';
import { serviceRequestRouter } from '../modules/serviceRequest/serviceRequest.routes.js';
import { paymentRouter } from '../modules/payment/payment.routes.js';
import { ticketRouter } from '../modules/ticket/ticket.routes.js';
import { adminRouter } from '../modules/admin/admin.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/departments', departmentRouter);
router.use('/complaints', complaintRouter);
router.use('/service-requests', serviceRequestRouter);
router.use('/payments', paymentRouter);
router.use('/tickets', ticketRouter);
router.use('/admin', adminRouter);
