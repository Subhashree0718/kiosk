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
            <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="admin-page__title" style={{ marginBottom: 5 }}>Admin Overview / एडमिन अवलोकन</h1>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Real-time service utilization and ticket monitoring dashboard.</p>
                </div>
                <div style={{ background: '#f1f5f9', padding: '8px 15px', borderRadius: 8, fontSize: 13, border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    📅 Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '50px 0', textAlign: 'center', color: '#94a3b8' }}>
                    <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                    Synchronizing Data...
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                    {STATS.map(s => (
                        <div key={s.key} style={{
                            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
                            padding: 25, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: 10
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{
                                    width: 45, height: 45, background: `${s.color}15`,
                                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 22
                                }}>
                                    {s.icon}
                                </div>
                                <span style={{ fontSize: 12, color: s.color, fontWeight: 700, padding: '4px 10px', background: `${s.color}10`, borderRadius: 20 }}>
                                    LIVE
                                </span>
                            </div>
                            <div style={{ marginTop: 15 }}>
                                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--gov-navy)' }}>{stats[s.key] ?? 0}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                marginTop: 35, background: '#fff', borderRadius: 20,
                border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ background: 'var(--gov-navy)', padding: '20px 30px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Portal Operations Center</h2>
                    <span style={{ fontSize: 11, opacity: 0.7 }}>Secure Environment</span>
                </div>
                <div style={{ padding: 30 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gov-navy)', marginBottom: 15 }}>Quick Management</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {['Review Tickets', 'Assign Officers', 'View Heatmap', 'Export Reports'].map(act => (
                                    <button key={act} style={{
                                        padding: '10px 20px', background: '#f1f5f9', border: '1.5px solid #e2e8f0',
                                        borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer'
                                    }}>
                                        {act}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: 40 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gov-navy)', marginBottom: 15 }}>System Status</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>API Gateway</span>
                                    <span style={{ color: '#10b981', fontWeight: 800 }}>● Operational</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Database Cluster</span>
                                    <span style={{ color: '#10b981', fontWeight: 800 }}>● Operational</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Notification Engine</span>
                                    <span style={{ color: '#f59e0b', fontWeight: 800 }}>● High Load</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
