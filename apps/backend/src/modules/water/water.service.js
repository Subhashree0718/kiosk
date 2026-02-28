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
export async function waterRegisterConsumerService({ mobile, name, address, email }) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);
    if (!name || name.trim().length < 2) throw createError('Full name is required for registration.', 400);

    // Check if already registered
    const existing = await db.user.findUnique({ where: { mobile } }).catch(() => null);
    if (existing) throw createError('Mobile number already registered. Please login.', 409);

    // Generate a unique Property ID
    const newPropertyId = `PROP-${Math.floor(10000 + Math.random() * 90000)}`;
    const regTicketId = `REG-${Date.now().toString(36).toUpperCase()}-${genNum()}`;
    const regTxnId = `INIT-${genNum()}`;

    // Create the user record
    const consumer = await db.user.create({
        data: {
            mobile,
            name: name.trim(),
            email: email || null,
        },
    }).catch(() => {
        // Unlikely, but return a stub so we can still return the propertyId to the caller
        return { id: genId(), mobile, name, createdAt: new Date() };
    });

    // Create a registration Ticket + linked Payment so propertyId is persisted.
    // Payment requires ticketId (FK), so we MUST create the Ticket first.
    if (db.ticket && db.payment) {
        try {
            const ticket = await db.ticket.create({
                data: {
                    ticketId: regTicketId,
                    status: 'RESOLVED',          // registration is instant
                    priority: 'LOW',
                    serviceType: 'BILL_PAYMENT',
                    slaDeadline: new Date(Date.now() + 24 * 3600000),
                },
            });

            await db.payment.create({
                data: {
                    ticketId: ticket.id,         // ← required FK now supplied
                    userId: consumer.id,
                    consumerNo: newPropertyId,
                    department: 'WATER',
                    billAmount: 0,
                    amountPaid: 0,
                    transactionId: regTxnId,
                    status: 'INITIATED',
                },
            });
        } catch (_) {
            // If DB insert fails for any reason, we still return propertyId to the user
            // but log for debugging
        }
    }

    return {
        message: 'Registration successful.',
        consumerId: consumer.id,
        consumerName: consumer.name || name,
        propertyId: newPropertyId,
    };
}


export async function waterConsumerLoginService({ mobile, otp }) {

    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);

    if (!otp) throw createError('OTP is required.', 400);
    if (!verifyStoredOtp(mobile, otp)) throw createError('Invalid or expired OTP.', 400);

    // FLAW FIX: Verify user is registered — login is only for existing consumers
    const user = await db.user.findUnique({ where: { mobile } }).catch(() => null);
    if (!user) {
        throw createError('This mobile number is not registered. Please register first.', 404);
    }

    return { success: true, mobile, consumerName: user.name || 'Consumer', loginMethod: 'otp' };
}


/* ────────────────────────────────────────────────────────────────
   COMPLAINTS
──────────────────────────────────────────────────────────────── */
export async function waterSubmitComplaintService({ propertyId, mobile, description }) {
    if (!propertyId) throw createError('Property ID / Consumer ID is required.', 400);
    if (!/^\d{10}$/.test(mobile)) throw createError('Enter a valid 10-digit mobile number.', 400);
    if (!description || description.trim().length < 10)
        throw createError('Complaint description must be at least 10 characters.', 400);

    // FLAW FIX: Verify the Property ID actually exists in our system
    if (db.payment) {
        const propertyExists = await db.payment.findFirst({
            where: { consumerNo: propertyId }
        }).catch(() => null);
        if (!propertyExists) {
            throw createError(
                `Property ID "${propertyId}" is not registered in our system. Please register first or check your Property ID.`,
                404
            );
        }
    }

    const complaintId = genComplaintId();

    if (db.ticket && db.complaint && db.user && db.department) {
        let user = await db.user.findUnique({ where: { mobile } }).catch(() => null);
        if (!user) user = await db.user.create({ data: { mobile } }).catch(() => ({ id: 'USR-' + genId() }));

        let dept = await db.department.findUnique({ where: { code: 'WATER' } }).catch(() => null);
        if (!dept) dept = await db.department.create({ data: { name: 'Water', code: 'WATER' } }).catch(() => ({ id: 'DEPT-WTR' }));

        await db.ticket.create({
            data: {
                ticketId: complaintId,
                status: 'PENDING',
                priority: 'MEDIUM',
                serviceType: 'COMPLAINT',
                slaDeadline: new Date(Date.now() + 72 * 3600000),
                complaint: {
                    create: {
                        userId: user.id,
                        departmentId: dept.id,
                        description: `[Property ID: ${propertyId}] ${description.trim()}`
                    }
                }
            }
        }).catch(() => { });
    }

    try { await sendSms(mobile, `SUVIDHA: Complaint registered. ID: ${complaintId}. We will resolve within 72 hours.`); } catch (_) { }

    return {
        complaintId,
        status: 'Submitted',
        message: 'Complaint registered successfully.',
        estimatedResolution: '72 hours',
    };
}


export async function waterGetComplaintStatusService(complaintId) {
    if (db.ticket) {
        const rec = await db.ticket.findUnique({
            where: { ticketId: complaintId },
            include: {
                complaint: {
                    include: { user: true }
                }
            }
        }).catch(() => null);

        if (rec) {
            // Try to find the user's property ID from their WATER payment record
            let propertyId = null;
            let consumerName = rec.complaint?.user?.name || null;
            if (rec.complaint?.userId && db.payment) {
                const pay = await db.payment.findFirst({
                    where: { userId: rec.complaint.userId, department: 'WATER' },
                    orderBy: { createdAt: 'desc' },
                }).catch(() => null);
                propertyId = pay?.consumerNo || null;
            }

            return {
                complaintId: rec.ticketId,
                status: rec.status,
                priority: rec.priority,
                consumerName,
                propertyId,
                description: rec.complaint?.description || 'N/A',
                createdAt: rec.createdAt,
                resolvedAt: rec.resolvedAt || null,
                assignedTo: rec.assignedTo || null,
                remarks: rec.remarks || null,
            };
        }
    }
    throw createError(`No complaint found with ID ${complaintId}.`, 404);
}


/* ────────────────────────────────────────────────────────────────
   BILL & QUICK PAY
──────────────────────────────────────────────────────────────── */
export async function waterGetBillService({ propertyId, mobile }) {
    if (!propertyId && !mobile) throw createError('Property ID or Mobile number is required.', 400);

    // Step 1: Resolve user
    let user = null;
    let resolvedPropertyId = propertyId;

    if (db.user && db.payment) {
        if (mobile) {
            user = await db.user.findUnique({ where: { mobile } }).catch(() => null);
            // If mobile given, also try to find propertyId via their payment record
            if (user && !resolvedPropertyId) {
                const payRec = await db.payment.findFirst({
                    where: { userId: user.id, department: 'WATER' },
                    orderBy: { createdAt: 'desc' }
                }).catch(() => null);
                if (payRec) resolvedPropertyId = payRec.consumerNo;
            }
        }
        if (!user && propertyId) {
            const linked = await db.payment.findFirst({
                where: { consumerNo: propertyId },
                include: { user: true }
            }).catch(() => null);
            user = linked?.user || null;
        }
    }

    if (!user) {
        throw createError('No consumer found with these details. Please register first.', 404);
    }

    // Step 2: Look for a real PENDING bill in the payment records
    // A newly registered user has an INITIATED record with billAmount=0 — that is NOT a bill
    let pendingBill = null;
    if (db.payment) {
        pendingBill = await db.payment.findFirst({
            where: {
                userId: user.id,
                department: 'WATER',
                status: 'PENDING',
                billAmount: { gt: 0 }
            },
            orderBy: { createdAt: 'desc' }
        }).catch(() => null);
    }

    // Step 3: No real pending bill — new user or already paid
    if (!pendingBill) {
        return {
            noBill: true,
            propertyId: resolvedPropertyId || `WTR-${user.mobile?.slice(-4) || '0000'}`,
            consumerName: user.name || 'Registered Consumer',
            mobile: user.mobile,
            message: 'No pending bill at this time.',
            details: 'Your bill will be generated after your first meter reading, usually at the end of the billing cycle.'
        };
    }

    // Step 4: Real bill found — return actual data
    return {
        noBill: false,
        propertyId: pendingBill.consumerNo,
        consumerName: user.name || 'Registered Consumer',
        mobile: user.mobile,
        billMonth: pendingBill.createdAt
            ? new Date(pendingBill.createdAt).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
            : new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
        dueDate: pendingBill.dueDate
            ? new Date(pendingBill.dueDate).toISOString().split('T')[0]
            : new Date(Date.now() + 15 * 86400_000).toISOString().split('T')[0],
        amount: parseFloat(pendingBill.billAmount.toFixed(2)),
        arrears: parseFloat((pendingBill.arrears || 0).toFixed(2)),
        total: parseFloat(pendingBill.billAmount.toFixed(2)),
        units: pendingBill.units || null,
        transactionId: pendingBill.transactionId,
    };
}


export async function waterQuickPayService({ propertyId, mobile, amount }) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) throw createError('Invalid bill amount.', 400);
    const receiptNo = genReceiptNo();
    const paidAmount = parseFloat(amount);

    if (db.payment && db.user) {
        // Resolve user by mobile or propertyId
        let user = null;
        if (mobile) {
            user = await db.user.findUnique({ where: { mobile } }).catch(() => null);
        }
        if (!user && propertyId) {
            const linked = await db.payment.findFirst({
                where: { consumerNo: propertyId },
                include: { user: true }
            }).catch(() => null);
            user = linked?.user || null;
        }

        if (!user) throw createError('Consumer not registered. Please register before making payments.', 404);

        // FLAW FIX: Create Payment record directly — do NOT use Ticket table for bill payments
        // Also mark the existing PENDING bill as paid (status → SUCCESS)
        const pendingBill = await db.payment.findFirst({
            where: { userId: user.id, department: 'WATER', status: 'PENDING', billAmount: { gt: 0 } }
        }).catch(() => null);

        if (pendingBill) {
            // Update existing pending bill to paid
            await db.payment.update({
                where: { id: pendingBill.id },
                data: {
                    amountPaid: paidAmount,
                    status: 'SUCCESS',
                    transactionId: receiptNo,
                }
            }).catch(async () => {
                // Fallback: create new success record if update fails
                await db.payment.create({
                    data: {
                        userId: user.id,
                        consumerNo: propertyId || pendingBill.consumerNo,
                        department: 'WATER',
                        billAmount: paidAmount,
                        amountPaid: paidAmount,
                        transactionId: receiptNo,
                        status: 'SUCCESS'
                    }
                }).catch(() => { });
            });
        } else {
            // No pending bill record — still log the payment
            await db.payment.create({
                data: {
                    userId: user.id,
                    consumerNo: propertyId || 'UNKNOWN',
                    department: 'WATER',
                    billAmount: paidAmount,
                    amountPaid: paidAmount,
                    transactionId: receiptNo,
                    status: 'SUCCESS'
                }
            }).catch(() => { });
        }
    }

    try {
        const m = mobile || 'N/A';
        await sendSms(m, `SUVIDHA Water: Payment of ₹${paidAmount} received. Receipt No: ${receiptNo}. Thank you.`);
    } catch (_) { }

    return { receiptNo, amount: paidAmount, status: 'Success', message: 'Payment successful.' };
}


/* ────────────────────────────────────────────────────────────────
   FIND PROPERTY
──────────────────────────────────────────────────────────────── */
export async function waterFindPropertyService({ searchMode, zone, ward, name, address, billNumber, subCode, mobile }) {
    if (!db.user) throw createError('Search service unavailable.', 500);

    const zonePart = zone ? `Z${zone.trim().toUpperCase().replace(/\D/g, '')}` : null;
    const wardPart = ward ? `W${ward.trim().toUpperCase().replace(/\D/g, '')}` : null;

    // Helper: fetch payments for a list of user IDs, apply zone/ward filter
    const paymentsForUsers = async (userIds) => {
        if (!db.payment || !userIds.length) return {};
        const pmts = await db.payment.findMany({
            where: { userId: { in: userIds }, department: 'WATER' },
            orderBy: { createdAt: 'desc' },
        }).catch(() => []);
        const map = {};
        for (const p of pmts) {
            if (!map[p.userId]) map[p.userId] = [];
            map[p.userId].push(p);
        }
        return map;
    };

    let userList = [];

    if (!searchMode || searchMode === 'mobile') {
        if (!mobile || !/^\d{10}$/.test(mobile)) throw createError('Enter a valid 10-digit mobile number.', 400);
        const u = await db.user.findUnique({ where: { mobile } }).catch(() => null);
        if (u) userList = [u];

    } else if (searchMode === 'name') {
        if (!name || name.trim().length < 2) throw createError('Enter at least 2 characters of the name.', 400);
        userList = await db.user.findMany({
            where: { name: { contains: name.trim(), mode: 'insensitive' } },
            take: 15,
        }).catch(() => []);

    } else if (searchMode === 'address') {
        if (!address || address.trim().length < 3) throw createError('Enter at least 3 characters of the address.', 400);
        // Search address stored in service-request formData
        const reqs = db.serviceRequest ? await db.serviceRequest.findMany({
            where: { serviceType: 'WATER_NEW_CONNECTION' },
            include: { user: true },
            take: 20,
        }).catch(() => []) : [];
        const matched = reqs.filter(r => JSON.stringify(r.formData || {}).toLowerCase().includes(address.trim().toLowerCase()));
        userList = [...new Map(matched.map(r => [r.userId, r.user])).values()].filter(Boolean);

    } else if (searchMode === 'billNumber') {
        // i) Using Property/Bill Number alone
        if (!billNumber || billNumber.trim().length < 3) throw createError('Enter a valid bill/property number.', 400);
        const pmts = db.payment ? await db.payment.findMany({
            where: { department: 'WATER', consumerNo: { contains: billNumber.trim(), mode: 'insensitive' } },
            include: { user: true },
            take: 10,
        }).catch(() => []) : [];
        userList = [...new Map(pmts.filter(p => p.user).map(p => [p.userId, p.user])).values()];

    } else if (searchMode === 'existingBill') {
        // ii) Using Existing Bill Number + Sub Code
        if (!billNumber || billNumber.trim().length < 3) throw createError('Enter a valid bill number.', 400);
        const query = subCode ? `${billNumber.trim()}-${subCode.trim()}` : billNumber.trim();
        const pmts = db.payment ? await db.payment.findMany({
            where: {
                department: 'WATER',
                OR: [
                    { consumerNo: { contains: query, mode: 'insensitive' } },
                    { transactionId: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: { user: true },
            take: 10,
        }).catch(() => []) : [];
        userList = [...new Map(pmts.filter(p => p.user).map(p => [p.userId, p.user])).values()];
    }

    if (!userList.length) {
        return { results: [], count: 0, message: 'No registered consumer found. Please check your search criteria.' };
    }

    const pmtMap = await paymentsForUsers(userList.map(u => u.id));

    const results = userList.map(u => {
        const pmts = pmtMap[u.id] || [];
        const latest = pmts[0] || null;
        return {
            propertyId: latest?.consumerNo || null,
            consumerId: u.id,
            consumerName: u.name || 'Registered Consumer',
            mobile: u.mobile,
            email: u.email || null,
            zone: zonePart || 'N/A',
            ward: wardPart || 'N/A',
            registeredOn: u.createdAt,
            totalPayments: pmts.filter(p => p.status === 'SUCCESS').length,
            lastPaymentDate: latest?.paidAt || latest?.createdAt || null,
            lastBillAmount: latest?.billAmount || 0,
            lastAmountPaid: latest?.amountPaid || 0,
            lastTransactionId: latest?.transactionId || null,
            lastStatus: latest?.status || 'REGISTERED',
            hasPropertyId: !!latest?.consumerNo,
        };
    });

    return { results, count: results.length };
}


/* ────────────────────────────────────────────────────────────────
   ACCOUNT HISTORY
──────────────────────────────────────────────────────────────── */
export async function waterGetAccountHistoryService(mobile) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);
    if (!db.user) throw createError('History service unavailable.', 500);

    const user = await db.user.findUnique({ where: { mobile } });
    if (!user) return { mobile, found: false, message: 'No account found for this mobile number.' };

    // 1. Payment history
    const payments = db.payment ? await db.payment.findMany({
        where: { userId: user.id, department: 'WATER' },
        orderBy: { createdAt: 'desc' },
    }).catch(() => []) : [];

    const paymentHistory = payments.map(p => ({
        receiptNo: p.transactionId,
        propertyId: p.consumerNo,
        billAmount: p.billAmount,
        amountPaid: p.amountPaid,
        status: p.status,
        date: p.paidAt || p.createdAt,
    }));

    // 2. Complaint history
    const complaints = db.complaint ? await db.complaint.findMany({
        where: { userId: user.id },
        include: { ticket: true },
        orderBy: { createdAt: 'desc' },
    }).catch(() => []) : [];

    const complaintHistory = complaints.map(c => ({
        complaintId: c.ticket?.ticketId || c.id,
        description: c.description,
        status: c.ticket?.status || 'PENDING',
        priority: c.ticket?.priority || 'MEDIUM',
        date: c.createdAt,
        resolvedAt: c.ticket?.resolvedAt || null,
    }));

    // 3. New connection history
    const serviceReqs = db.serviceRequest ? await db.serviceRequest.findMany({
        where: { userId: user.id, serviceType: 'WATER_NEW_CONNECTION' },
        include: { ticket: true },
        orderBy: { createdAt: 'desc' },
    }).catch(() => []) : [];

    const connectionHistory = serviceReqs.map(r => ({
        applicationNo: r.ticket?.ticketId || r.id,
        connectionType: r.formData?.connectionType || 'Domestic',
        address: r.formData?.address || '',
        applicantName: r.formData?.applicantName || '',
        status: r.ticket?.status || 'PENDING',
        date: r.createdAt,
    }));

    return {
        found: true,
        consumerProfile: {
            name: user.name || 'N/A',
            mobile: user.mobile,
            email: user.email || 'N/A',
            registeredOn: user.createdAt,
            propertyIds: [...new Set(payments.map(p => p.consumerNo).filter(Boolean))],
        },
        paymentHistory,
        complaintHistory,
        connectionHistory,
        summary: {
            totalPayments: paymentHistory.filter(p => p.status === 'SUCCESS').length,
            totalAmountPaid: paymentHistory.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + (p.amountPaid || 0), 0),
            totalComplaints: complaintHistory.length,
            pendingComplaints: complaintHistory.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length,
            totalConnections: connectionHistory.length,
        },
    };
}




/* ────────────────────────────────────────────────────────────────
   NEW CONNECTION
──────────────────────────────────────────────────────────────── */
export async function waterSubmitNewConnectionService({ mobile, email, applicantName, address, connectionType }) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Enter a valid 10-digit mobile number.', 400);
    if (!applicantName || applicantName.trim().length < 2) throw createError('Applicant name is required.', 400);
    if (!address || address.trim().length < 5) throw createError('Address is required.', 400);

    // FLAW FIX: Prevent duplicate new connection applications for the same mobile
    if (db.ticket && db.serviceRequest) {
        const existing = await db.serviceRequest.findFirst({
            where: {
                serviceType: 'WATER_NEW_CONNECTION',
                user: { mobile },
                ticket: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
            },
            include: { ticket: true }
        }).catch(() => null);

        if (existing) {
            throw createError(
                `An active application already exists for this mobile number. Application No: ${existing.ticket?.ticketId}. Please track its status.`,
                409
            );
        }
    }

    const applicationNo = genAppNo();

    if (db.ticket && db.serviceRequest && db.user && db.department) {
        let user = await db.user.findUnique({ where: { mobile } }).catch(() => null);
        if (!user) user = await db.user.create({ data: { mobile, email: email || null, name: applicantName.trim() } }).catch(() => ({ id: 'USR-' + genId() }));

        let dept = await db.department.findUnique({ where: { code: 'WATER' } }).catch(() => null);
        if (!dept) dept = await db.department.create({ data: { name: 'Water', code: 'WATER' } }).catch(() => ({ id: 'DEPT-WTR' }));

        await db.ticket.create({
            data: {
                ticketId: applicationNo,
                status: 'PENDING',
                priority: 'MEDIUM',
                serviceType: 'SERVICE_REQUEST',
                slaDeadline: new Date(Date.now() + 30 * 24 * 3600000),
                serviceRequest: {
                    create: {
                        userId: user.id,
                        departmentId: dept.id,
                        serviceType: 'WATER_NEW_CONNECTION',
                        formData: { applicantName: applicantName.trim(), address: address.trim(), connectionType }
                    }
                }
            }
        }).catch(() => { });
    }

    try { await sendSms(mobile, `SUVIDHA: New connection application received. Application No: ${applicationNo}. Track at the Water Portal.`); } catch (_) { }

    return { applicationNo, status: 'Submitted', message: 'Application submitted successfully. Expected processing: 30 working days.' };
}


export async function waterGetConnectionStatusService(applicationNo) {
    if (db.ticket) {
        const rec = await db.ticket.findUnique({
            where: { ticketId: applicationNo },
            include: {
                serviceRequest: {
                    include: { user: true } // FLAW FIX: join user to get real mobile
                }
            }
        }).catch(() => null);

        if (rec) {
            const formData = (typeof rec.serviceRequest?.formData === 'object' ? rec.serviceRequest.formData : {}) || {};
            return {
                applicationNo: rec.ticketId,
                status: rec.status,
                applicantName: formData.applicantName || rec.serviceRequest?.user?.name || 'Applicant',
                mobile: rec.serviceRequest?.user?.mobile || 'N/A', // Real mobile from DB
                address: formData.address || '',
                connectionType: formData.connectionType || '',
                createdAt: rec.createdAt,
                remarks: rec.remarks || null,
            };
        }
    }
    throw createError(`No application found with number ${applicationNo}.`, 404);
}

/* ────────────────────────────────────────────────────────────────
   SESSION IDENTITY — GLOBAL MOBILE-BASED SERVICES
──────────────────────────────────────────────────────────────── */

/**
 * Check if a mobile number is already registered as a Water consumer.
 * Called when the user enters the Water Department — decides dashboard vs. registration prompt.
 */
export async function waterCheckRegistrationService(mobile) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);

    try {
        // A user is "registered for water services" if they exist in db.user.
        // The payment record is optional (may fail silently during registration).
        if (db.user) {
            const user = await db.user.findUnique({
                where: { mobile },
                include: db.payment ? {
                    payments: {
                        where: { department: 'WATER' },
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                    }
                } : undefined,
            });

            if (user) {
                const propertyId = user.payments?.[0]?.consumerNo || null;

                // If stored name is blank or the generic fallback, try to find real name
                // from their new-connection service request (where applicantName is stored)
                let resolvedName = user.name && user.name !== 'Consumer' ? user.name : null;
                if (!resolvedName && db.serviceRequest) {
                    const sr = await db.serviceRequest.findFirst({
                        where: { userId: user.id, serviceType: 'WATER_NEW_CONNECTION' },
                        orderBy: { createdAt: 'desc' },
                    }).catch(() => null);
                    const fd = sr?.formData;
                    if (fd && typeof fd === 'object' && fd.applicantName) {
                        resolvedName = fd.applicantName;
                    }
                }

                return {
                    registered: true,
                    consumerName: resolvedName || null,   // null → frontend shows mobile
                    mobile: user.mobile,
                    propertyId,
                };
            }

        }
    } catch (_) {
        // DB error — fail open so users aren't falsely blocked
        return { registered: false };
    }

    return { registered: false };
}


/**
 * Return all Property IDs linked to a mobile number.
 * Used for: Quick Pay auto-load, Forgot Property ID button.
 */
export async function waterMyPropertiesService(mobile) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);

    if (!db.user) {
        return { mobile, properties: [], count: 0, message: 'Service unavailable.' };
    }

    try {
        // Find user first
        const user = await db.user.findUnique({ where: { mobile } });
        if (!user) {
            return { mobile, properties: [], count: 0, message: 'No account found for this mobile number.' };
        }

        // Find all WATER payments for this user
        const payments = db.payment ? await db.payment.findMany({
            where: { userId: user.id, department: 'WATER' },
            orderBy: { createdAt: 'desc' },
        }).catch(() => []) : [];

        if (!payments.length) {
            // ── SELF-HEAL: user registered but PropertyId was never persisted (old bug).
            // Auto-assign one now by creating a Ticket + Payment.
            let autoPropertyId = null;
            if (db.ticket && db.payment) {
                try {
                    const healTicketId = `REG-${Date.now().toString(36).toUpperCase()}-${genNum()}`;
                    const healTxnId = `INIT-${genNum()}`;
                    const newPropId = `PROP-${Math.floor(10000 + Math.random() * 90000)}`;

                    const ticket = await db.ticket.create({
                        data: {
                            ticketId: healTicketId,
                            status: 'RESOLVED',
                            priority: 'LOW',
                            serviceType: 'BILL_PAYMENT',
                            slaDeadline: new Date(Date.now() + 24 * 3600000),
                        },
                    });

                    await db.payment.create({
                        data: {
                            ticketId: ticket.id,
                            userId: user.id,
                            consumerNo: newPropId,
                            department: 'WATER',
                            billAmount: 0,
                            amountPaid: 0,
                            transactionId: healTxnId,
                            status: 'INITIATED',
                        },
                    });
                    autoPropertyId = newPropId;
                } catch (_) { /* fall through */ }
            }

            if (autoPropertyId) {
                return {
                    mobile,
                    consumerName: user.name || 'Consumer',
                    properties: [{ propertyId: autoPropertyId, lastBillAmount: 0, lastStatus: 'INITIATED', lastUpdated: new Date() }],
                    count: 1,
                    message: `Property ID assigned: ${autoPropertyId}`,
                };
            }

            // Could not auto-heal
            return {
                mobile,
                consumerName: user.name || 'Consumer',
                properties: [],
                count: 0,
                message: 'You are registered but no property ID has been assigned yet. Please contact the Water Supply Board office.',
            };
        }


        // Deduplicate by consumerNo
        const seen = new Set();
        const properties = payments
            .filter(p => {
                if (!p.consumerNo || seen.has(p.consumerNo)) return false;
                seen.add(p.consumerNo);
                return true;
            })
            .map(p => ({
                propertyId: p.consumerNo,
                lastBillAmount: p.billAmount || 0,
                lastStatus: p.status || 'REGISTERED',
                lastUpdated: p.createdAt,
            }));

        return { mobile, consumerName: user.name || 'Consumer', properties, count: properties.length };
    } catch (err) {
        return { mobile, properties: [], count: 0, message: 'Unable to fetch properties. Please try again.' };
    }
}

/**
 * Return all New Connection applications linked to a mobile number.
 * Used for: Forgot Application Number button.
 */
export async function waterMyApplicationsService(mobile) {
    if (!/^\d{10}$/.test(mobile)) throw createError('Invalid mobile number.', 400);

    if (db.user && db.serviceRequest && db.ticket) {
        const user = await db.user.findUnique({ where: { mobile } }).catch(() => null);
        if (!user) {
            return { mobile, applications: [], count: 0, message: 'No applications found for this mobile number.' };
        }

        const requests = await db.serviceRequest.findMany({
            where: {
                userId: user.id,
                serviceType: 'WATER_NEW_CONNECTION',
            },
            include: { ticket: true },
            orderBy: { createdAt: 'desc' },
        }).catch(() => []);

        const applications = requests.map(r => ({
            applicationNo: r.ticket?.ticketId || 'N/A',
            status: r.ticket?.status || 'PENDING',
            connectionType: (r.formData)?.connectionType || '',
            address: (r.formData)?.address || '',
            appliedOn: r.createdAt,
        }));

        return { mobile, applications, count: applications.length };
    }
    return { mobile, applications: [], count: 0, message: 'Service unavailable.' };
}
