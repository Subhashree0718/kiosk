import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../store/index.js';

const NAV = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/tickets', label: 'All Tickets', icon: '🎫' },
    { path: '/complaints', label: 'Complaints', icon: '📢' },
    { path: '/map', label: 'Issue Map', icon: '🗺️' },
    { path: '/escalation', label: 'Escalations', icon: '🚨' },
    { path: '/departments', label: 'Departments', icon: '🏛️' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAdminStore();

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__title">Navigation Menu</div>

            <nav className="admin-sidebar__nav">
                {NAV.map(n => (
                    <button
                        key={n.path}
                        className={`admin-sidebar__link${location.pathname === n.path ? ' admin-sidebar__link--active' : ''}`}
                        onClick={() => navigate(n.path)}
                    >
                        <span className="admin-sidebar__icon">{n.icon}</span>
                        <span>{n.label}</span>
                    </button>
                ))}
            </nav>

            <div className="admin-sidebar__footer">
                {user && <div style={{ marginBottom: 6 }}>👤 {user.mobile}</div>}
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="admin-sidebar__link"
                    style={{ color: '#fb7185', padding: '6px 0', width: '100%' }}
                >
                    🚪 Logout / लॉगआउट
                </button>
            </div>
        </aside>
    );
}
