import { db } from '../config/db.js';

export async function auditLog(req, res, next) {
    res.on('finish', async () => {
        try {
            if (req.method !== 'GET') {
                await db.auditLog.create({
                    data: {
                        userId: req.user?.id ?? null,
                        action: `${req.method} ${req.path}`,
                        entity: req.path.split('/')[1] ?? 'unknown',
                        entityId: req.params?.id ?? null,
                        ipAddress: req.ip,
                        meta: { statusCode: res.statusCode, body: req.body ?? null },
                    },
                });
            }
        } catch {
            // Audit log failure must never crash the request
        }
    });
    next();
}
