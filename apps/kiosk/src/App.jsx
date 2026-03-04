import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/index.jsx';
import { useSessionTimeout } from './hooks/useSessionTimeout.js';
import { useKioskStore } from './store/index.js';
import '../src/styles/global.css';

function SessionGuard({ children }) {
    useSessionTimeout();
    return children;
}

function LangSync() {
    const language = useKioskStore(s => s.language);
    useEffect(() => {
        // Apply data-lang to <html> → CSS rules in global.css handle all pages
        document.documentElement.setAttribute('data-lang', language || 'en');
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
