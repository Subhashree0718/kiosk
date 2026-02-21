import { createServiceRequestService, listServiceRequestsService } from './serviceRequest.service.js';

export async function createServiceRequest(req, res, next) {
    try {
        const data = await createServiceRequestService({ userId: req.user.id, ...req.body });
        return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
}

export async function listServiceRequests(req, res, next) {
    try {
        const { status, page, limit } = req.query;
        const data = await listServiceRequestsService({ userId: req.user.id, status, page: +page || 1, limit: +limit || 20 });
        return res.json({ success: true, ...data });
    } catch (err) { next(err); }
}
