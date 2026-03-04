import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/index.jsx';
import { useSessionTimeout } from './hooks/useSessionTimeout.js';
import { useKioskStore } from './store/index.js';
import i18n from '../../packages/i18n/src/index.js';
import '../src/styles/global.css';

function SessionGuard({ children }) {
    useSessionTimeout();
    return children;
}

function LangSync() {
    const language = useKioskStore(s => s.language);
    useEffect(() => {
        const lang = language || 'en';
        // Apply data-lang to <html> → CSS rules in global.css handle all pages
        document.documentElement.setAttribute('data-lang', lang);
        // Basic RTL support for Urdu
        document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
        // Keep central i18n instance in sync with Zustand language
        i18n.changeLanguage(lang);
    }, [language]);
    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <LangSync />
            <SessionGuard>
                <AppRoutes />
            </SessionGuard>
        </BrowserRouter>
    );
}
