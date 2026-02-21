import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../store/index.js';

const TIMEOUT_MS = 5 * 60 * 1000;   // 5 minutes
const WARN_BEFORE_MS = 60 * 1000;   // warn 1 minute before

export function useSessionTimeout() {
    const { token, logout, updateActivity } = useKioskStore();
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        const reset = () => {
            updateActivity();
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                logout();
                navigate('/');
                alert('Session expired. Please login again.');
            }, TIMEOUT_MS);
        };

        const events = ['click', 'touchstart', 'keydown'];
        events.forEach(e => window.addEventListener(e, reset));
        reset(); // start immediately

        return () => {
            clearTimeout(timerRef.current);
            events.forEach(e => window.removeEventListener(e, reset));
        };
    }, [token]);
}
