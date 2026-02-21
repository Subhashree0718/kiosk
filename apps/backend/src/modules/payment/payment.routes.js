import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { fetchBill, processPayment } from './payment.controller.js';

const paymentRouter = Router();
paymentRouter.use(authMiddleware);

paymentRouter.get('/bill', fetchBill);
paymentRouter.post('/pay', processPayment);

export { paymentRouter };
