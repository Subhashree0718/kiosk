import { Router } from 'express';
import { sendOtp, verifyOtp } from './auth.controller.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const authRouter = Router();

authRouter.post('/send-otp', authRateLimiter, sendOtp);
authRouter.post('/verify-otp', authRateLimiter, verifyOtp);

export { authRouter };
