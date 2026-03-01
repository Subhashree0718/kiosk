/**
 * profileApi.js
 * API calls for the unified citizen profile page.
 */
import axios from 'axios';

const profileApi = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || '/api/v1') + '/profile',
    timeout: 15000,
});

profileApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('suvidha_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/** Fetch full profile + all-dept history for a mobile number */
export const fetchFullProfile = (mobile) => profileApi.get(`/${mobile}`);
