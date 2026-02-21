import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';

export async function getTicketByIdService(ticketId) {
    const ticket = await db.ticket.findFirst({
        where: { ticketId },
        include: {
            statusHistory: { orderBy: { changedAt: 'asc' } },
            complaint: { include: { department: true } },
            serviceRequest: { include: { department: true } },
            payment: true,
        },
    });
    if (!ticket) throw createError(`Ticket ${ticketId} not found.`, 404);
    return ticket;
}

export async function updateTicketStatusService(id, status, note, changedBy) {
    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) throw createError('Ticket not found.', 404);

    const updates = { status };
    if (status === 'RESOLVED') updates.resolvedAt = new Date();
    if (status === 'CLOSED') updates.closedAt = new Date();
    if (status === 'ESCALATED') updates.escalatedAt = new Date();

    const [updated] = await Promise.all([
        db.ticket.update({ where: { id }, data: updates }),
        db.ticketStatusHistory.create({ data: { ticketId: id, status, note, changedBy } }),
    ]);
    return updated;
}
