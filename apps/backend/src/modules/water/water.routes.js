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
    waterCheckRegistration,
    waterGetMyProperties,
    waterGetMyApplications,
    waterGetAccountHistory,
} from './water.controller.js';

import { authRateLimiter } from '../../middleware/rateLimiter.js';

const waterRouter = Router();

waterRouter.post('/otp/send', authRateLimiter, waterSendOtp);
waterRouter.post('/otp/verify', authRateLimiter, waterVerifyOtp);
waterRouter.post('/register', waterRegisterConsumer);
waterRouter.post('/login', waterConsumerLogin);

waterRouter.post('/complaints', waterSubmitComplaint);
waterRouter.get('/complaints/:complaintId', waterGetComplaintStatus);

waterRouter.get('/bill', waterGetBill);
waterRouter.post('/pay', waterQuickPay);

waterRouter.post('/find-property', waterFindProperty);

waterRouter.post('/connections', waterSubmitNewConnection);
waterRouter.get('/connections/:applicationNo', waterGetConnectionStatus);

/* ── Session Identity Routes ─────────────────────────────────── */
waterRouter.get('/check-registration', waterCheckRegistration);
waterRouter.get('/my-properties', waterGetMyProperties);
waterRouter.get('/my-applications', waterGetMyApplications);
waterRouter.get('/account-history', waterGetAccountHistory);

export { waterRouter };


