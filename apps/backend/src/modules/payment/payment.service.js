import { db } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { generateTicketId } from '@suvidha/utils';
import { sendSms } from '../notification/notification.service.js';
import { customAlphabet } from 'nanoid';

const txnId = customAlphabet('0123456789', 12);

export async function fetchBillService({ consumerNo, department }) {
    // Stub: in production, call external utility API
    return {
        consumerNo,
        department,
        customerName: 'Citizen User',
        billMonth: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
        dueDate: new Date(Date.now() + 7 * 86400_000).toISOString().split('T')[0],
        amount: parseFloat((Math.random() * 2000 + 200).toFixed(2)),
    };
}

export async function processPaymentService({ userId, consumerNo, department, billAmount }) {
    const ticketId = generateTicketId();

    const ticket = await db.ticket.create({
        data: {
            ticketId,
            status: 'RESOLVED',
            priority: 'LOW',
            serviceType: 'BILL_PAYMENT',
            slaDeadline: new Date(),
            resolvedAt: new Date(),
            statusHistory: { create: { status: 'RESOLVED', note: 'Payment processed.' } },
        },
    });

    const transactionRef = txnId();
    const payment = await db.payment.create({
        data: {
            ticketId: ticket.id,
            userId,
            consumerNo,
            department,
            billAmount,
            amountPaid: billAmount,
            transactionId: `TXN${transactionRef}`,
            gatewayRef: `GW${transactionRef}`,
            status: 'SUCCESS',
        },
        include: { ticket: true },
    });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (user?.mobile) {
        const msg = `SUVIDHA: Payment of ₹${billAmount} for ${department} (Consumer: ${consumerNo}) successful. Txn ID: TXN${transactionRef}. Ticket: ${ticketId}.`;
        await sendSms(user.mobile, msg);
    }

    return payment;
}
