import { getDashboardStatsService, getComplaintsMapService, getAllTicketsService } from './admin.service.js';

export async function getDashboardStats(req, res, next) {
    try {
        const data = await getDashboardStatsService();
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function getComplaintsMap(req, res, next) {
    try {
        const data = await getComplaintsMapService();
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function getAllTickets(req, res, next) {
    try {
        const { status, departmentId, priority, page, limit } = req.query;
        const data = await getAllTicketsService({ status, departmentId, priority, page: +page || 1, limit: +limit || 25 });
        return res.json({ success: true, ...data });
    } catch (err) { next(err); }
}
