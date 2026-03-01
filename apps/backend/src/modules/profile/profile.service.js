import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';

/* ── Helpers ────────────────────────────────────────────── */
const fmt = (d) => d ? new Date(d).toISOString() : null;
const safe = (n) => n || 0;

/* ── Main profile aggregator ────────────────────────────── */
export async function getFullProfileService(mobile) {
    if (!mobile) throw createError('Mobile number required.', 400);

    /* 1. Core user record */
    const user = await db.user.findUnique({
        where: { mobile },
        select: {
            id: true, name: true, mobile: true, email: true,
            createdAt: true, updatedAt: true, role: true,
        },
    });

    /* 2. Water consumer record (Property ID resolution) */
    const waterPaymentRec = await db.payment.findFirst({
        where: { userId: user?.id || undefined, department: 'WATER' },
        orderBy: { createdAt: 'desc' },
    }).catch(() => null);

    const waterConsumer = {
        name: user?.name,
        email: user?.email,
        mobile: mobile,
        propertyId: waterPaymentRec?.consumerNo || null,
        consumerId: user?.id || null,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
    };

    /* 3. Water bill payments */
    const waterPayments = await db.payment.findMany({
        where: { userId: user?.id || undefined, department: 'WATER' },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
            id: true, consumerNo: true, billAmount: true, amountPaid: true,
            transactionId: true, status: true, createdAt: true,
        },
    }).catch(() => []);

    /* 4. Water complaints */
    const waterComplaints = await db.complaint.findMany({
        where: { userId: user?.id || undefined, department: { code: 'WATER' } },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            ticket: { select: { ticketId: true, status: true, priority: true, createdAt: true, resolvedAt: true } }
        },
    }).catch(() => []);

    /* 5. Water new connections */
    const waterConnections = await db.serviceRequest.findMany({
        where: { userId: user?.id || undefined, serviceType: 'WATER_NEW_CONNECTION' },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
            ticket: { select: { ticketId: true, status: true, createdAt: true, updatedAt: true } }
        }
    }).catch(() => []);

    /* 6. General complaints (cross-department tickets) */
    const generalComplaints = user ? await db.complaint.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
            ticket: { select: { ticketId: true, status: true, priority: true, createdAt: true, resolvedAt: true } },
            department: { select: { name: true } },
        },
    }).catch(() => []) : [];

    /* 7. General bill payments (cross-department) */
    const generalPayments = user ? await db.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
            ticket: { select: { ticketId: true, status: true } },
        },
    }).catch(() => []) : [];

    /* 8. Service requests */
    const serviceRequests = user ? await db.serviceRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
            ticket: { select: { ticketId: true, status: true, priority: true, createdAt: true } },
            department: { select: { name: true } },
        },
    }).catch(() => []) : [];

    /* 9. Profile change history — track user updatedAt + waterConsumer updates */
    const changeLog = [];
    if (user?.createdAt) changeLog.push({ type: 'ACCOUNT_CREATED', date: fmt(user.createdAt), note: 'Account registered on SUVIDHA portal' });
    if (waterConsumer?.createdAt) changeLog.push({ type: 'WATER_REGISTERED', date: fmt(waterConsumer.createdAt), note: 'Registered for Water Services' });
    if (waterConsumer?.updatedAt && waterConsumer.updatedAt !== waterConsumer.createdAt)
        changeLog.push({ type: 'WATER_PROFILE_UPDATED', date: fmt(waterConsumer.updatedAt), note: 'Water profile information updated' });

    /* 10. Summary counters */
    const summary = {
        totalWaterPayments: waterPayments.length,
        totalWaterAmountPaid: waterPayments.reduce((s, p) => s + safe(p.amountPaid), 0),
        totalWaterComplaints: waterComplaints.length,
        pendingWaterComplaints: waterComplaints.filter(c => c.ticket?.status !== 'RESOLVED' && c.ticket?.status !== 'CLOSED').length,
        totalWaterConnections: waterConnections.length,
        totalGeneralComplaints: generalComplaints.length,
        totalGeneralPayments: generalPayments.length,
        totalServiceRequests: serviceRequests.length,
    };

    return {
        found: !!(user || waterConsumer),
        profile: {
            name: waterConsumer?.name || user?.name || null,
            mobile,
            email: waterConsumer?.email || user?.email || null,
            address: waterConsumer?.address || null,
            propertyId: waterConsumer?.propertyId || null,
            consumerId: waterConsumer?.consumerId || null,
            role: user?.role || 'CITIZEN',
            memberSince: fmt(user?.createdAt || waterConsumer?.createdAt),
        },
        summary,
        history: {
            waterPayments: waterPayments.map(p => ({
                id: p.id, propertyId: p.consumerNo, billAmount: p.billAmount,
                amountPaid: p.amountPaid, transactionId: p.transactionId,
                status: p.status, createdAt: fmt(p.createdAt)
            })),
            waterComplaints: waterComplaints.map(c => ({
                id: c.id, complaintId: c.ticket?.ticketId, description: c.description,
                status: c.ticket?.status, priority: c.ticket?.priority,
                createdAt: fmt(c.ticket?.createdAt), resolvedAt: fmt(c.ticket?.resolvedAt)
            })),
            waterConnections: waterConnections.map(c => ({
                id: c.id, applicationNo: c.ticket?.ticketId,
                connectionType: c.formData?.connectionType || 'Domestic',
                status: c.ticket?.status, createdAt: fmt(c.ticket?.createdAt),
                updatedAt: fmt(c.ticket?.updatedAt)
            })),
            generalComplaints: generalComplaints.map(c => ({
                id: c.id, description: c.description, location: c.location,
                department: c.department?.name, ticketId: c.ticket?.ticketId,
                status: c.ticket?.status, priority: c.ticket?.priority,
                date: fmt(c.createdAt), resolvedAt: fmt(c.ticket?.resolvedAt),
            })),
            generalPayments: generalPayments.map(p => ({
                id: p.id, consumerNo: p.consumerNo, department: p.department,
                billAmount: p.billAmount, amountPaid: p.amountPaid,
                transactionId: p.transactionId, status: p.status,
                ticketId: p.ticket?.ticketId, date: fmt(p.createdAt),
            })),
            serviceRequests: serviceRequests.map(r => ({
                id: r.id, serviceType: r.serviceType, description: r.description,
                department: r.department?.name, ticketId: r.ticket?.ticketId,
                status: r.ticket?.status, priority: r.ticket?.priority,
                date: fmt(r.ticket?.createdAt),
            })),
            changeLog: changeLog.sort((a, b) => new Date(b.date) - new Date(a.date)),
        },
    };
}
