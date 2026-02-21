import { listDepartmentsService, createDepartmentService, updateDepartmentService } from './department.service.js';

export async function listDepartments(req, res, next) {
    try {
        const data = await listDepartmentsService();
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function createDepartment(req, res, next) {
    try {
        const data = await createDepartmentService(req.body);
        return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
}

export async function updateDepartment(req, res, next) {
    try {
        const data = await updateDepartmentService(req.params.id, req.body);
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}
