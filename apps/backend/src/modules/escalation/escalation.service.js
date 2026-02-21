import cron from 'node-cron';
import { db } from '../../config/db.js';
import { logger } from '../../config/logger.js';
import { sendSms } from '../notification/notification.service.js';

/**
 * Runs every 30 minutes.
 * Marks tickets as ESCALATED if they're still PENDING or IN_PROGRESS past their SLA deadline.
 */
async function runEscalation() {
    logger.info('[Escalation Engine] Running SLA check...');
    try {
        const overdueTickets = await db.ticket.findMany({
            where: {
                status: { in: ['PENDING', 'IN_PROGRESS'] },
                slaDeadline: { lt: new Date() },
            },
            include: {
                complaint: { include: { user: true } },
            },
        });

        for (const ticket of overdueTickets) {
            await db.ticket.update({ where: { id: ticket.id }, data: { status: 'ESCALATED', escalatedAt: new Date() } });
            await db.ticketStatusHistory.create({
                data: { ticketId: ticket.id, status: 'ESCALATED', note: 'Auto-escalated: SLA deadline exceeded.' },
            });

            const mobile = ticket.complaint?.user?.mobile;
            if (mobile) {
                await sendSms(mobile, `SUVIDHA: Ticket ${ticket.ticketId} has been escalated to a supervisor due to SLA breach. We apologize for the delay.`);
            }

            logger.warn(`[Escalation] Ticket ${ticket.ticketId} escalated.`);
        }
        logger.info(`[Escalation Engine] Escalated ${overdueTickets.length} ticket(s).`);
    } catch (err) {
        logger.error(`[Escalation Engine] Error: ${err.message}`);
    }
}

export function startEscalationEngine() {
    // Run every 30 minutes
    cron.schedule('*/30 * * * *', runEscalation);
    logger.info('[Escalation Engine] Started. Runs every 30 minutes.');
}
