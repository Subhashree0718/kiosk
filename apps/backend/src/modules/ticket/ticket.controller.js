import { getTicketByIdService, updateTicketStatusService } from './ticket.service.js';

export async function getTicket(req, res, next) {
    try {
        const data = await getTicketByIdService(req.params.ticketId);
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function updateTicketStatus(req, res, next) {
    try {
        const { status, note } = req.body;
        const data = await updateTicketStatusService(req.params.id, status, note, req.user?.id);
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}
