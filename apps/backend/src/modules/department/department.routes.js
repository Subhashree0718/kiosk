import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { listDepartments, createDepartment, updateDepartment } from './department.controller.js';

const departmentRouter = Router();

departmentRouter.get('/', listDepartments); // public
departmentRouter.post('/', authMiddleware, requireRole('ADMIN'), createDepartment);
departmentRouter.patch('/:id', authMiddleware, requireRole('ADMIN'), updateDepartment);

export { departmentRouter };
