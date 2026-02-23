import { Router } from 'express';
import {
    waterSendOtp,
    waterVerifyOtp,
    waterRegisterConsumer,
    waterConsumerLogin,
    waterGetBill,
    waterQuickPay,
    waterFindProperty,
    waterSubmitComplaint,
    waterGetComplaintStatus,
    waterSubmitNewConnection,
    waterGetConnectionStatus,
} from './water.controller.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const waterRouter = Router();

// ── Auth (public — water portal consumers, no kiosk JWT needed) ───
waterRouter.post('/otp/send', authRateLimiter, waterSendOtp);
waterRouter.post('/otp/verify', authRateLimiter, waterVerifyOtp);
waterRouter.post('/register', waterRegisterConsumer);
waterRouter.post('/login', waterConsumerLogin);

// ── Complaints (public — mobile-verified) ─────────────────────────
waterRouter.post('/complaints', waterSubmitComplaint);
waterRouter.get('/complaints/:complaintId', waterGetComplaintStatus);

// ── Tax / Bill / Payment ──────────────────────────────────────────
waterRouter.get('/bill', waterGetBill);
waterRouter.post('/pay', waterQuickPay);

// ── Property Search ───────────────────────────────────────────────
waterRouter.post('/find-property', waterFindProperty);

// ── New Connection ────────────────────────────────────────────────
waterRouter.post('/connections', waterSubmitNewConnection);
waterRouter.get('/connections/:applicationNo', waterGetConnectionStatus);

export { waterRouter };
