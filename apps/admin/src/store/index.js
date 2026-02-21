import { create } from 'zustand';

export const useAdminStore = create((set) => ({
    token: localStorage.getItem('suvidha_admin_token') || null,
    user: null,
    setAuth: (user, token) => {
        localStorage.setItem('suvidha_admin_token', token);
        set({ user, token });
    },
    logout: () => {
        localStorage.removeItem('suvidha_admin_token');
        set({ user: null, token: null });
    },
}));
