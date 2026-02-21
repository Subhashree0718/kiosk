import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/index.jsx';
import { useSessionTimeout } from './hooks/useSessionTimeout.js';
import '../src/styles/global.css';

function SessionGuard({ children }) {
    useSessionTimeout();
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <SessionGuard>
                <AppRoutes />
            </SessionGuard>
        </BrowserRouter>
    );
}
