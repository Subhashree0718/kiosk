import { db } from '../../config/db.js';

export async function listDepartmentsService() {
    return db.department.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
}

export async function createDepartmentService({ name, code, description }) {
    return db.department.create({ data: { name, code, description } });
}

export async function updateDepartmentService(id, data) {
    return db.department.update({ where: { id }, data });
}
