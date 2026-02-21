import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { generateTicketId } from '@suvidha/utils';
import { sendSms } from '../notification/notification.service.js';

export async function createServiceRequestService({ userId, departmentId, serviceType, formData, documentUrl, priority = 'MEDIUM' }) {
    const SLA = { LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 4 };
    const ticketId = generateTicketId();
    const slaDeadline = new Date(Date.now() + (SLA[priority] ?? 48) * 3600_000);

    const ticket = await db.ticket.create({
        data: {
            ticketId,
            status: 'PENDING',
            priority,
            serviceType: 'SERVICE_REQUEST',
            slaDeadline,
            statusHistory: { create: { status: 'PENDING', note: 'Service request submitted.' } },
        },
    });

    const request = await db.serviceRequest.create({
        data: { ticketId: ticket.id, userId, departmentId, serviceType, formData, documentUrl },
        include: { ticket: true, department: true },
    });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (user?.mobile) {
        await sendSms(user.mobile, `SUVIDHA: Service request submitted. Ticket: ${ticketId}. We will update you on progress.`);
    }

    return request;
}

export async function listServiceRequestsService({ userId, status, page = 1, limit = 20 }) {
    const where = {};
    if (userId) where.userId = userId;
    if (status) where.ticket = { status };

    const [data, total] = await Promise.all([
        db.serviceRequest.findMany({ where, include: { ticket: true, department: true }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
        db.serviceRequest.count({ where }),
    ]);
    return { data, total, page, limit };
}
