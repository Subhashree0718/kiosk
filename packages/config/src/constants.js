/** Application-wide constants */
export const APP_NAME = 'SUVIDHA';
export const APP_VERSION = '1.0.0';

/** SLA resolution thresholds (hours) by priority */
export const SLA = {
    LOW: 72,       // 3 days
    MEDIUM: 48,    // 2 days
    HIGH: 24,      // 1 day
    CRITICAL: 4,   // 4 hours
};

/** Supported languages */
export const LANGUAGES = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
    { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

/** Civic department list */
export const DEPARTMENTS = [
    { id: 'water', label: 'Water Supply' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'sanitation', label: 'Sanitation' },
    { id: 'roads', label: 'Roads & Drainage' },
    { id: 'property', label: 'Property Tax' },
    { id: 'health', label: 'Public Health' },
];

/** Ticket status list */
export const TICKET_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    ESCALATED: 'ESCALATED',
    CLOSED: 'CLOSED',
};

/** Session inactivity timeout (ms) */
export const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/** OTP expiry (minutes) */
export const OTP_EXPIRES_MINUTES = 5;
