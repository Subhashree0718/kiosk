import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAdminStore } from './store/index.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tickets from './pages/Tickets.jsx';
import Complaints from './pages/Complaints.jsx';
import GeoMap from './pages/GeoMap.jsx';
import Escalation from './pages/Escalation.jsx';
import Departments from './pages/Departments.jsx';
import Sidebar from './components/Sidebar.jsx';
import './styles/global.css';

function GovHeader() {
    return (
        <>
            <div className="admin-utility-bar">
                <span>भारत सरकार | Government of India</span>
                <span>Screen Reader | A- A A+</span>
            </div>
            <header className="admin-header">
                <img
                    className="admin-header__emblem"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/240px-Emblem_of_India.svg.png"
                    alt="Emblem"
                />
                <div className="admin-header__title">
                    <h1>SUVIDHA – Admin Portal</h1>
                    <span>Ministry of Urban Affairs | Citizen Service Management System</span>
                </div>
                <span className="admin-header__badge">🔐 Admin</span>
            </header>
        </>
    );
}

function AdminLayout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <GovHeader />
            <div className="admin-layout">
                <Sidebar />
                <main className="admin-main">{children}</main>
            </div>
            <footer className="admin-footer">
                SUVIDHA Admin Portal | Government of India | Content managed by Urban Local Bodies
            </footer>
        </div>
    );
}

function Guard({ children }) {
    const { token } = useAdminStore();
    return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Guard><AdminLayout><Dashboard /></AdminLayout></Guard>} />
                <Route path="/tickets" element={<Guard><AdminLayout><Tickets /></AdminLayout></Guard>} />
                <Route path="/complaints" element={<Guard><AdminLayout><Complaints /></AdminLayout></Guard>} />
                <Route path="/map" element={<Guard><AdminLayout><GeoMap /></AdminLayout></Guard>} />
                <Route path="/escalation" element={<Guard><AdminLayout><Escalation /></AdminLayout></Guard>} />
                <Route path="/departments" element={<Guard><AdminLayout><Departments /></AdminLayout></Guard>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
