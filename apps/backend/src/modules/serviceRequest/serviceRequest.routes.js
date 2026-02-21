import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { createServiceRequest, listServiceRequests } from './serviceRequest.controller.js';

const serviceRequestRouter = Router();
serviceRequestRouter.use(authMiddleware);
serviceRequestRouter.post('/', createServiceRequest);
serviceRequestRouter.get('/', listServiceRequests);

export { serviceRequestRouter };
