import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
    ],
});

db.$on('error', (e) => logger.error(`Prisma error: ${e.message}`));

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
}
