import { db } from '../../config/db.js';

export async function getDashboardStatsService() {
    const [totalTickets, pending, inProgress, resolved, escalated, totalComplaints, totalPayments] = await Promise.all([
        db.ticket.count(),
        db.ticket.count({ where: { status: 'PENDING' } }),
        db.ticket.count({ where: { status: 'IN_PROGRESS' } }),
        db.ticket.count({ where: { status: 'RESOLVED' } }),
        db.ticket.count({ where: { status: 'ESCALATED' } }),
        db.complaint.count(),
        db.payment.count(),
    ]);

    return { totalTickets, pending, inProgress, resolved, escalated, totalComplaints, totalPayments };
}

export async function getComplaintsMapService() {
    const complaints = await db.complaint.findMany({
        where: { latitude: { not: null }, longitude: { not: null } },
        select: { id: true, latitude: true, longitude: true, description: true, createdAt: true, department: { select: { name: true } }, ticket: { select: { status: true, ticketId: true } } },
    });
    return complaints;
}

export async function getAllTicketsService({ status, departmentId, priority, page = 1, limit = 25 }) {
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [data, total] = await Promise.all([
        db.ticket.findMany({
            where,
            include: {
                complaint: { include: { department: true, user: { select: { mobile: true, name: true } } } },
                serviceRequest: { include: { department: true } },
                payment: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        db.ticket.count({ where }),
    ]);
    return { data, total, page, limit };
}
