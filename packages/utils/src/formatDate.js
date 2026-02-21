/**
 * Format a date to a human-readable string.
 * @param {string|Date} date
 * @param {string} locale - e.g. 'en-IN'
 * @returns {string}
 */
export function formatDate(date, locale = 'en-IN') {
    return new Intl.DateTimeFormat(locale, {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Format a number as INR currency.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR',
    }).format(amount);
}
