import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { sendSms } from '../notification/notification.service.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const OTP_EXPIRES_MINUTES = parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10);

function generateOtp() {
    return String(crypto.randomInt(100000, 999999));
}

export async function sendOtpService(mobile) {
    // 1. Upsert user FIRST — Otp has FK on users.mobile so user must exist before OTP
    await db.user.upsert({ where: { mobile }, update: {}, create: { mobile, role: 'CITIZEN' } });

    // 2. Expire any existing unused OTPs for this mobile
    await db.otp.updateMany({ where: { mobile, used: false }, data: { used: true } });

    // 3. Create new OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60_000);
    await db.otp.create({ data: { mobile, code, expiresAt } });

    const message = `Your SUVIDHA OTP is ${code}. Valid for ${OTP_EXPIRES_MINUTES} minutes. Do not share this.`;
    await sendSms(mobile, message);

    return { message: 'OTP sent successfully.' };
}


export async function verifyOtpService(mobile, code) {
    const otp = await db.otp.findFirst({
        where: { mobile, code, used: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw createError('Invalid or expired OTP.', 400);

    await db.otp.update({ where: { id: otp.id }, data: { used: true } });

    const user = await db.user.findUnique({ where: { mobile } });
    if (!user) throw createError('User not found.', 404);

    const token = jwt.sign(
        { id: user.id, mobile: user.mobile, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token, user: { id: user.id, mobile: user.mobile, name: user.name, role: user.role } };
}
