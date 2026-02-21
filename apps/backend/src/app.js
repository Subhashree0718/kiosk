import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env from monorepo root (two levels above apps/backend/)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { router } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { auditLog } from './middleware/auditLog.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { logger } from './config/logger.js';
import { startEscalationEngine } from './modules/escalation/escalation.service.js';

const app = express();
const PORT = process.env.PORT || 4000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// ── Security Middleware ─────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(rateLimiter);

// ── Parsing Middleware ──────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ────────────────────────────────
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(auditLog);

// ── Routes ─────────────────────────────────
app.use(API_PREFIX, router);

// ── Health Check ───────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'SUVIDHA Backend', ts: new Date() }));

// ── Error Handler ──────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────
app.listen(PORT, () => {
    logger.info(`🚀 SUVIDHA Backend running on http://localhost:${PORT}`);
    startEscalationEngine();
});

export default app;
