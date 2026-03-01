import { logger } from '../../config/logger.js';
import twilio from 'twilio';

/**
 * Send an SMS via Twilio.
 * Falls back to console log in development or if keys are missing.
 */
const isDevStub = !process.env.TWILIO_ACCOUNT_SID ||
    process.env.TWILIO_ACCOUNT_SID.startsWith('your_');

export async function sendSms(mobile, message) {
    if (isDevStub) {
        logger.info(`[DEV SMS] To: +91${mobile} | ${message}`);
        return { stub: true };
    }
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const res = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobile}`
        });
        logger.info(`SMS sent to ${mobile} | SID: ${res.sid}`);
        return res;
    } catch (err) {
        logger.error(`SMS failed for ${mobile}: ${err.message}`);
        // Non-fatal – log and continue
        return null;
    }
}
