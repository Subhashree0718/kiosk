import React, { useEffect, useState } from 'react';
import { getDashStats } from '../services/api.js';

const STATS = [
    { key: 'totalTickets', label: 'Total Tickets', icon: '🎫', color: '#1a56db' },
    { key: 'pending', label: 'Pending', icon: '🕐', color: '#92400e' },
    { key: 'inProgress', label: 'In Progress', icon: '🔧', color: '#1e3a8a' },
    { key: 'resolved', label: 'Resolved', icon: '✅', color: '#065f46' },
    { key: 'escalated', label: 'Escalated', icon: '🚨', color: '#991b1b' },
    { key: 'totalPayments', label: 'Total Payments', icon: '💳', color: '#7e3af2' },
];

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashStats().then(r => setStats(r.data.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">📊 Dashboard Overview</h1>
            {loading ? (
                <p style={{ color: '#6b7280' }}>Loading statistics…</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {STATS.map(s => (
                        <div key={s.key} className="stat-card">
                            <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                            <div className="stat-card__value" style={{ color: s.color }}>{stats[s.key] ?? 0}</div>
                            <div className="stat-card__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>Quick Actions</h2>
                <p style={{ fontSize: '.88rem', color: '#6b7280' }}>
                    Use the sidebar to manage tickets, view the complaint map, monitor escalations, and configure departments.
                </p>
            </div>
        </div>
    );
}
