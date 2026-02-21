import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { createComplaint, listComplaints, getComplaint } from './complaint.controller.js';

const complaintRouter = Router();
complaintRouter.use(authMiddleware);

complaintRouter.post('/', createComplaint);
complaintRouter.get('/', listComplaints);
complaintRouter.get('/:id', getComplaint);

export { complaintRouter };
