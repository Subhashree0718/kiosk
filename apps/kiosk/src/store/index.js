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
        set({ user: null, token: null });
    },

    // Language
    language: 'en',
    setLanguage: (lang) => set({ language: lang }),

    // Session
    lastActivity: Date.now(),
    updateActivity: () => set({ lastActivity: Date.now() }),

    // Receipt
    lastReceipt: null,
    setLastReceipt: (data) => set({ lastReceipt: data }),
}));
