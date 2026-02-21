import app from './app.js';
import { startEscalationEngine } from './modules/escalation/escalation.service.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    logger.info(`🚀 SUVIDHA Backend running on port ${PORT}`);
    startEscalationEngine();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => process.exit(0));
});
