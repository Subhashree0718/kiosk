/**
 * Validate an Indian mobile number (10 digits).
 * @param {string} mobile
 * @returns {boolean}
 */
export function isValidMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validate a 6-digit OTP.
 * @param {string} otp
 * @returns {boolean}
 */
export function isValidOtp(otp) {
    return /^\d{6}$/.test(otp);
}

/**
 * Ensure a string is non-empty after trimming.
 * @param {string} value
 * @returns {boolean}
 */
export function isNonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate an email address.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
