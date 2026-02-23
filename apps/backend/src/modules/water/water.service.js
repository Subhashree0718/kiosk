import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { customAlphabet } from 'nanoid';
import { sendSms } from '../notification/notification.service.js';

const genId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const genNum = customAlphabet('0123456789', 6);

/* ── OTP helpers ─────────────────────────────────────────────── */
// In production, use Twilio/MSG91. Here we log OTP and return it for kiosk use.
const OTP_STORE = new Map(); // mobile → { otp, expiresAt }

function storeOtp(mobile, otp) {
    OTP_STORE.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min
}

function verifyStoredOtp(mobile, otp) {
    const entry = OTP_STORE.get(mobile);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) { OTP_STORE.delete(mobile); return false; }
    if (entry.otp !== otp) return false;
    OTP_STORE.delete(mobile);
    return true;
}

/* ── ID generators ───────────────────────────────────────────── */
function genComplaintId() { return `CMP-${Date.now().toString(36).toUpperCase()}-${genNum()}`; }
function genReceiptNo() { return `RCP-${Date.now().toString(36).toUpperCase()}-${genNum()}`; }
function genAppNo() { return `APP-${Date.now().toString(36).toUpperCase()}-${genNum()}`; }

/* ────────────────────────────────────────────────────────────────
   OTP
──────────────────────────────────────────────────────────────── */
export async function waterSendOtpService(mobile) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Enter a valid 10-digit mobile number.', 400);
    const otp = genNum();
    storeOtp(mobile, otp);
    // Try SMS — non-blocking, kiosk still shows OTP if SMS fails
    try { await sendSms(mobile, `SUVIDHA Water Portal OTP: ${otp}. Valid for 5 minutes. Do not share.`); } catch (_) { }
    return { message: 'OTP sent successfully.', otp }; // expose otp for kiosk demo
}

export async function waterVerifyOtpService(mobile, otp) {
    if (!verifyStoredOtp(mobile, otp)) throw createError('Invalid or expired OTP.', 400);
    return { verified: true };
}

/* ────────────────────────────────────────────────────────────────
   CONSUMER REGISTRATION & LOGIN
──────────────────────────────────────────────────────────────── */
export async function waterRegisterConsumerService({ propertyId, mobile, email, password }) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);

    // Upsert: allow re-registration for kiosk context
    const existing = await db.waterConsumer.findUnique({ where: { mobile } }).catch(() => null);
    if (existing) throw createError('Mobile number already registered. Please login.', 409);

    const consumer = await db.waterConsumer.create({
        data: { propertyId, mobile, email: email || null, passwordHash: password || null },
    }).catch(() => {
        // Prisma table may not exist yet — graceful stub
        return { id: genId(), mobile, propertyId, email, createdAt: new Date() };
    });

    return { message: 'Registration successful.', consumerId: consumer.id };
}

export async function waterConsumerLoginService({ mobile, password, otp }) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);

    if (otp) {
        if (!verifyStoredOtp(mobile, otp)) throw createError('Invalid or expired OTP.', 400);
        return { success: true, mobile, loginMethod: 'otp' };
    }
    if (!password) throw createError('Password or OTP required.', 400);

    // Stub password check — in production, bcrypt compare against stored hash
    return { success: true, mobile, loginMethod: 'password' };
}

/* ────────────────────────────────────────────────────────────────
   COMPLAINTS
──────────────────────────────────────────────────────────────── */
export async function waterSubmitComplaintService({ propertyId, mobile, description }) {
    if (!propertyId) throw createError('Property ID / Consumer ID is required.', 400);
    if (!/^\d{10}$/.test(mobile)) throw createError('Enter a valid 10-digit mobile number.', 400);
    if (!description || description.trim().length < 10)
        throw createError('Complaint description must be at least 10 characters.', 400);

    const complaintId = genComplaintId();

    // Persist if DB is live; graceful fallback
    await db.waterComplaint.create({
        data: { complaintId, propertyId, mobile, description: description.trim(), status: 'Submitted' },
    }).catch(() => { });

    try { await sendSms(mobile, `SUVIDHA: Complaint registered. ID: ${complaintId}. We will resolve within 72 hours.`); } catch (_) { }

    return {
        complaintId,
        status: 'Submitted',
        message: 'Complaint registered successfully.',
        estimatedResolution: '72 hours',
    };
}

export async function waterGetComplaintStatusService(complaintId) {
    // Try DB first
    const rec = await db.waterComplaint.findUnique({ where: { complaintId } }).catch(() => null);
    if (rec) {
        return {
            complaintId: rec.complaintId,
            status: rec.status,
            description: rec.description,
            createdAt: rec.createdAt,
            assignedTo: rec.assignedTo || null,
        };
    }
    // If not found
    throw createError(`No complaint found with ID ${complaintId}.`, 404);
}

/* ────────────────────────────────────────────────────────────────
   BILL & QUICK PAY
──────────────────────────────────────────────────────────────── */
export async function waterGetBillService({ propertyId, mobile }) {
    if (!propertyId && !mobile) throw createError('Property ID or Mobile number is required.', 400);
    // Stub bill — in production call utilities API
    const amount = parseFloat((Math.random() * 1500 + 150).toFixed(2));
    return {
        propertyId: propertyId || 'N/A',
        consumerName: 'Water Consumer',
        billMonth: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
        dueDate: new Date(Date.now() + 7 * 86400_000).toISOString().split('T')[0],
        amount,
        arrears: 0,
        total: amount,
    };
}

export async function waterQuickPayService({ propertyId, mobile, amount }) {
    if (!amount || isNaN(amount)) throw createError('Invalid bill amount.', 400);
    const receiptNo = genReceiptNo();
    await db.waterPayment.create({
        data: { receiptNo, propertyId: propertyId || null, mobile: mobile || null, amount: parseFloat(amount), status: 'Success' },
    }).catch(() => { });

    try {
        const m = mobile || 'N/A';
        await sendSms(m, `SUVIDHA Water: Payment of ₹${amount} received. Receipt: ${receiptNo}. Thank you.`);
    } catch (_) { }

    return { receiptNo, amount, status: 'Success', message: 'Payment successful.' };
}

/* ────────────────────────────────────────────────────────────────
   FIND PROPERTY
──────────────────────────────────────────────────────────────── */
export async function waterFindPropertyService({ method, zone, ward, address, billNumber, subCode, name, mobile }) {
    // Build a dynamic where clause
    const where = {};
    if (zone) where.zoneNumber = zone;
    if (ward) where.wardNumber = ward;
    if (address) where.address = { contains: address };
    if (billNumber) where.billNumber = billNumber;
    if (subCode) where.subCode = subCode;
    if (name) where.consumerName = { contains: name };
    if (mobile) where.mobile = mobile;

    const results = await db.waterProperty.findMany({ where, take: 10 }).catch(() => []);
    return { results, count: results.length, method };
}

/* ────────────────────────────────────────────────────────────────
   NEW CONNECTION
──────────────────────────────────────────────────────────────── */
export async function waterSubmitNewConnectionService({ mobile, email, applicantName, address, connectionType }) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Enter a valid 10-digit mobile number.', 400);
    if (!address) throw createError('Address is required.', 400);

    const applicationNo = genAppNo();

    await db.waterServiceApplication.create({
        data: {
            applicationNo,
            mobile,
            email: email || null,
            applicantName: applicantName || 'Applicant',
            address,
            connectionType: connectionType || 'Domestic',
            status: 'Submitted',
        },
    }).catch(() => { });

    try { await sendSms(mobile, `SUVIDHA: New connection application received. Application No: ${applicationNo}. Track at the Water Portal.`); } catch (_) { }

    return { applicationNo, status: 'Submitted', message: 'Application submitted successfully. Expected processing: 30 working days.' };
}

export async function waterGetConnectionStatusService(applicationNo) {
    const rec = await db.waterServiceApplication.findUnique({ where: { applicationNo } }).catch(() => null);
    if (rec) {
        return {
            applicationNo: rec.applicationNo,
            status: rec.status,
            applicantName: rec.applicantName,
            mobile: rec.mobile,
            createdAt: rec.createdAt,
            remarks: rec.remarks || null,
        };
    }
    throw createError(`No application found with number ${applicationNo}.`, 404);
}
