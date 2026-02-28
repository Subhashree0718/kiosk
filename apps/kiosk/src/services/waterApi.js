/**
 * waterApi.js
 * Axios wrapper for all Water Department portal API calls.
 * Base: /api/v1/water — no kiosk auth token required.
 */
import axios from 'axios';

const waterApi = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || '/api/v1') + '/water',
    timeout: 12000,
});

/* ── Request interceptor: attach token if available (optional) ── */
waterApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('suvidha_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/* ── Response interceptor: unwrap {success, ...} envelope ──────── */
waterApi.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err?.response?.data?.message ||
            err?.message ||
            'A network error occurred. Please try again.';
        return Promise.reject(new Error(message));
    },
);

/* ── OTP ───────────────────────────────────────────────────────── */
export const wSendOtp = (mobile) => waterApi.post('/otp/send', { mobile });
export const wVerifyOtp = (mobile, otp) => waterApi.post('/otp/verify', { mobile, otp });

/* ── Consumer ──────────────────────────────────────────────────── */
export const wRegister = (data) => waterApi.post('/register', data);
export const wLogin = (data) => waterApi.post('/login', data);

/* ── Complaints ────────────────────────────────────────────────── */
export const wSubmitComplaint = (data) => waterApi.post('/complaints', data);
export const wGetComplaintStatus = (complaintId) => waterApi.get(`/complaints/${complaintId}`);

/* ── Bill & Pay ────────────────────────────────────────────────── */
export const wFetchBill = (params) => waterApi.get('/bill', { params });   // { propertyId } or { mobile }
export const wQuickPay = (data) => waterApi.post('/pay', data);

/* ── Property Search ────────────────────────────────────────────── */
export const wFindProperty = (data) => waterApi.post('/find-property', data);

/* ── New Connection ─────────────────────────────────────────────── */
export const wSubmitNewConnection = (data) => waterApi.post('/connections', data);
export const wGetConnectionStatus = (applicationNo) => waterApi.get(`/connections/${applicationNo}`);

/* ── Session Identity Endpoints ─────────────────────────────────── */
// Check if mobile is registered in Water DB (for entry check in WaterDepartment.jsx)
export const wCheckRegistration = (mobile) => waterApi.get('/check-registration', { params: { mobile } });
// Get all property IDs for a mobile (Forgot Property ID, Quick Pay auto-load)
export const wMyProperties = (mobile) => waterApi.get('/my-properties', { params: { mobile } });
// Get all new connection applications for a mobile (Forgot Application Number)
export const wMyApplications = (mobile) => waterApi.get('/my-applications', { params: { mobile } });
// Get full account history: payments, complaints, new connections
export const wAccountHistory = (mobile) => waterApi.get('/account-history', { params: { mobile } });

export default waterApi;

