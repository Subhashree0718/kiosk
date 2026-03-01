import axios from 'axios';
import { logger } from '../../config/logger.js';

/**
 * Send an SMS via the configured gateway.
 * Falls back to console log in development.
 */
const isDevStub = !process.env.SMS_API_KEY ||
    process.env.SMS_API_KEY.startsWith('your_');

export async function sendSms(mobile, code) {
    if (isDevStub) {
        logger.info(`[DEV SMS] To: +91${mobile} | OTP: ${code}`);
        return { stub: true };
    }
    try {
        const res = await axios.post(process.env.SMS_GATEWAY_URL, {
            variables_values: code,
            route: 'otp',
            numbers: mobile,
        }, {
            headers: {
                authorization: process.env.SMS_API_KEY
            }
        });
        logger.info(`SMS sent to ${mobile} | Status: ${res.status}`);
        return res.data;
    } catch (err) {
        logger.error(`SMS failed for ${mobile}: ${err.message}`);
        // Non-fatal – log and continue
        return null;
    }
}
