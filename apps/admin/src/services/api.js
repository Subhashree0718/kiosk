import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || '/api/v1',
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('suvidha_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const adminLogin = (mobile, code) => api.post('/auth/verify-otp', { mobile, code });
export const getDashStats = () => api.get('/admin/stats');
export const getMapData = () => api.get('/admin/map');
export const getAllTickets = (params) => api.get('/admin/tickets', { params });
export const updateTicket = (id, data) => api.patch(`/tickets/${id}/status`, data);
export const getDepartments = () => api.get('/departments');
export const createDept = (data) => api.post('/departments', data);

export default api;
