import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    timeout: 10000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('suvidha_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const sendOtp = (mobile) => api.post('/auth/send-otp', { mobile });
export const verifyOtp = (mobile, code) => api.post('/auth/verify-otp', { mobile, code });

// ── Departments ───────────────────────────────────────────────────────────────
export const getDepartments = () => api.get('/departments');

// ── Complaints ────────────────────────────────────────────────────────────────
export const createComplaint = (data) => api.post('/complaints', data);

// ── Service Requests ──────────────────────────────────────────────────────────
export const createServiceRequest = (data) => api.post('/service-requests', data);

// ── Payments ──────────────────────────────────────────────────────────────────
export const fetchBill = (consumerNo, department) => api.get('/payments/bill', { params: { consumerNo, department } });
export const processPayment = (data) => api.post('/payments/pay', data);

// ── Ticket Status ─────────────────────────────────────────────────────────────
export const getTicket = (ticketId) => api.get(`/tickets/${ticketId}`);

export default api;
