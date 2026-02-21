import { createComplaintService, listComplaintsService, getComplaintService } from './complaint.service.js';

export async function createComplaint(req, res, next) {
    try {
        const data = await createComplaintService({ userId: req.user.id, ...req.body });
        return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
}

export async function listComplaints(req, res, next) {
    try {
        const { departmentId, status, page, limit } = req.query;
        const data = await listComplaintsService({ departmentId, status, page: +page || 1, limit: +limit || 20 });
        return res.json({ success: true, ...data });
    } catch (err) { next(err); }
}

export async function getComplaint(req, res, next) {
    try {
        const data = await getComplaintService(req.params.id);
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}
