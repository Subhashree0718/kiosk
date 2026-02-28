import { create } from 'zustand';

export const useKioskStore = create((set) => ({
    // Auth
    user: null,
    token: null,
    setAuth: (user, token) => {
        localStorage.setItem('suvidha_token', token);
        set({ user, token });
    },
    logout: () => {
        localStorage.removeItem('suvidha_token');
        localStorage.removeItem('suvidha_session_mobile');
        set({ user: null, token: null, sessionMobile: null });
    },

    // Global Session Identity — set once after OTP, used across all departments
    sessionMobile: localStorage.getItem('suvidha_session_mobile') || null,
    setSessionMobile: (mobile) => {
        if (mobile) localStorage.setItem('suvidha_session_mobile', mobile);
        else localStorage.removeItem('suvidha_session_mobile');
        set({ sessionMobile: mobile });
    },

    // Language — persisted across refreshes
    language: localStorage.getItem('lang') || 'en',
    setLanguage: (lang) => {
        localStorage.setItem('lang', lang);
        set({ language: lang });
    },


    // Session
    lastActivity: Date.now(),
    updateActivity: () => set({ lastActivity: Date.now() }),

    // Receipt
    lastReceipt: null,
    setLastReceipt: (data) => set({ lastReceipt: data }),
}));
