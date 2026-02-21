import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { generateTicketId } from '@suvidha/utils';
import { sendSms } from '../notification/notification.service.js';

const SLA_HOURS = { LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 4 };

function buildSlaDeadline(priority = 'MEDIUM') {
    const hours = SLA_HOURS[priority] ?? 48;
    return new Date(Date.now() + hours * 3600_000);
}

export async function createComplaintService({ userId, departmentId, description, location, latitude, longitude, attachmentUrl, priority = 'MEDIUM' }) {
    const dept = await db.department.findUnique({ where: { id: departmentId } });
    if (!dept) throw createError('Department not found.', 404);

    const ticketId = generateTicketId();
    const slaDeadline = buildSlaDeadline(priority);

    const ticket = await db.ticket.create({
        data: {
            ticketId,
            status: 'PENDING',
            priority,
            serviceType: 'COMPLAINT',
            slaDeadline,
            statusHistory: { create: { status: 'PENDING', note: 'Complaint registered.' } },
        },
    });

    const complaint = await db.complaint.create({
        data: { ticketId: ticket.id, userId, departmentId, description, location, latitude, longitude, attachmentUrl },
        include: { ticket: true, department: true },
    });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (user?.mobile) {
        const msg = `SUVIDHA: Complaint registered. Ticket ID: ${ticketId}. Track at our kiosk or portal.`;
        await sendSms(user.mobile, msg);
    }

    return complaint;
}

export async function listComplaintsService({ departmentId, status, page = 1, limit = 20 }) {
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (status) where.ticket = { status };

    const [data, total] = await Promise.all([
        db.complaint.findMany({ where, include: { ticket: true, department: true, user: { select: { mobile: true, name: true } } }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
        db.complaint.count({ where }),
    ]);

    return { data, total, page, limit };
}

export async function getComplaintService(id) {
    const c = await db.complaint.findUnique({ where: { id }, include: { ticket: { include: { statusHistory: true } }, department: true, user: { select: { mobile: true, name: true } } } });
    if (!c) throw createError('Complaint not found.', 404);
    return c;
}
