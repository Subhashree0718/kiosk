import { sendOtpService, verifyOtpService } from './auth.service.js';

export async function sendOtp(req, res, next) {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ success: false, message: 'Mobile number is required.' });
        const data = await sendOtpService(mobile);
        return res.json({ success: true, ...data });
    } catch (err) { next(err); }
}

export async function verifyOtp(req, res, next) {
    try {
        const { mobile, code } = req.body;
        if (!mobile || !code) return res.status(400).json({ success: false, message: 'Mobile and OTP are required.' });
        const data = await verifyOtpService(mobile, code);
        return res.json({ success: true, ...data });
    } catch (err) { next(err); }
}
