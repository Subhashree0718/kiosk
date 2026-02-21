import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { getTicket, updateTicketStatus } from './ticket.controller.js';

const ticketRouter = Router();

// Public: anyone with ticket ID can track
ticketRouter.get('/:ticketId', getTicket);

// Admin/Officer: update status
ticketRouter.patch('/:id/status', authMiddleware, requireRole('OFFICER', 'SUPERVISOR', 'ADMIN'), updateTicketStatus);

export { ticketRouter };
