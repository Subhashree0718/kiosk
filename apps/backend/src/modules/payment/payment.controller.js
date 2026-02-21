import { fetchBillService, processPaymentService } from './payment.service.js';

export async function fetchBill(req, res, next) {
    try {
        const { consumerNo, department } = req.query;
        if (!consumerNo || !department) return res.status(400).json({ success: false, message: 'consumerNo and department are required.' });
        const data = await fetchBillService({ consumerNo, department });
        return res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function processPayment(req, res, next) {
    try {
        const { consumerNo, department, billAmount } = req.body;
        if (!consumerNo || !department || !billAmount) return res.status(400).json({ success: false, message: 'consumerNo, department, and billAmount are required.' });
        const data = await processPaymentService({ userId: req.user.id, consumerNo, department, billAmount });
        return res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
}
