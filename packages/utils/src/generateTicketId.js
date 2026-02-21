import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

/**
 * Generate a unique ticket ID e.g. "SVDH-A3F7K2X1"
 * @returns {string}
 */
export function generateTicketId() {
    return `SVDH-${nanoid()}`;
}
