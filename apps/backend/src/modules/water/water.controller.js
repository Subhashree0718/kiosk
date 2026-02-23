import {
    waterSendOtpService,
    waterVerifyOtpService,
    waterRegisterConsumerService,
    waterConsumerLoginService,
    waterGetBillService,
    waterQuickPayService,
    waterFindPropertyService,
    waterSubmitComplaintService,
    waterGetComplaintStatusService,
    waterSubmitNewConnectionService,
    waterGetConnectionStatusService,
} from './water.service.js';

const ok = (res, data, status = 200) => res.status(status).json({ success: true, ...data });
const fail = (res, message, status = 400) => res.status(status).json({ success: false, message });

/* ── OTP ─────────────────────────────────────────────────────── */
export async function waterSendOtp(req, res, next) {
    try {
        const { mobile } = req.body;
        if (!mobile) return fail(res, 'mobile is required.');
        const data = await waterSendOtpService(mobile);
        return ok(res, data);
    } catch (err) { next(err); }
}

export async function waterVerifyOtp(req, res, next) {
    try {
        const { mobile, otp } = req.body;
        if (!mobile || !otp) return fail(res, 'mobile and otp are required.');
        const data = await waterVerifyOtpService(mobile, otp);
        return ok(res, data);
    } catch (err) { next(err); }
}

/* ── Consumer ────────────────────────────────────────────────── */
export async function waterRegisterConsumer(req, res, next) {
    try {
        const { propertyId, mobile, email, password } = req.body;
        if (!propertyId || !mobile) return fail(res, 'propertyId and mobile are required.');
        const data = await waterRegisterConsumerService({ propertyId, mobile, email, password });
        return ok(res, data, 201);
    } catch (err) { next(err); }
}

export async function waterConsumerLogin(req, res, next) {
    try {
        const { mobile, password, otp } = req.body;
        if (!mobile) return fail(res, 'mobile is required.');
        const data = await waterConsumerLoginService({ mobile, password, otp });
        return ok(res, data);
    } catch (err) { next(err); }
}

/* ── Complaints ──────────────────────────────────────────────── */
export async function waterSubmitComplaint(req, res, next) {
    try {
        const { propertyId, mobile, description } = req.body;
        const data = await waterSubmitComplaintService({ propertyId, mobile, description });
        return ok(res, data, 201);
    } catch (err) { next(err); }
}

export async function waterGetComplaintStatus(req, res, next) {
    try {
        const { complaintId } = req.params;
        const data = await waterGetComplaintStatusService(complaintId);
        return ok(res, { data });
    } catch (err) { next(err); }
}

/* ── Bill & Pay ──────────────────────────────────────────────── */
export async function waterGetBill(req, res, next) {
    try {
        const { propertyId, mobile } = req.query;
        const data = await waterGetBillService({ propertyId, mobile });
        return ok(res, { data });
    } catch (err) { next(err); }
}

export async function waterQuickPay(req, res, next) {
    try {
        const { propertyId, mobile, amount } = req.body;
        const data = await waterQuickPayService({ propertyId, mobile, amount });
        return ok(res, data, 201);
    } catch (err) { next(err); }
}

/* ── Property Search ─────────────────────────────────────────── */
export async function waterFindProperty(req, res, next) {
    try {
        const data = await waterFindPropertyService(req.body);
        return ok(res, data);
    } catch (err) { next(err); }
}

/* ── New Connection ──────────────────────────────────────────── */
export async function waterSubmitNewConnection(req, res, next) {
    try {
        const { mobile, email, applicantName, address, connectionType } = req.body;
        const data = await waterSubmitNewConnectionService({ mobile, email, applicantName, address, connectionType });
        return ok(res, data, 201);
    } catch (err) { next(err); }
}

export async function waterGetConnectionStatus(req, res, next) {
    try {
        const { applicationNo } = req.params;
        const data = await waterGetConnectionStatusService(applicationNo);
        return ok(res, { data });
    } catch (err) { next(err); }
}
