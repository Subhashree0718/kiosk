import React, { useEffect, useState } from 'react';
import { getAllTickets, updateTicket } from '../services/api.js';
import { formatDate } from '@suvidha/utils';

export default function Complaints() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await getAllTickets({ serviceType: 'COMPLAINT', limit: 50 });
            setData(res.data.data.filter(t => t.complaint));
        } finally { setLoading(false); }
    }
    useEffect(() => { load(); }, []);

    async function handleStatus(id, status) {
        await updateTicket(id, { status, note: 'Updated by officer.' });
        load();
    }

    return (
        <div className="admin-page">
            <div style={{ marginBottom: 30 }}>
                <h1 className="admin-page__title" style={{ marginBottom: 5 }}>📢 Public Grievance Management / शिकायत प्रबंधन</h1>
                <p style={{ color: '#64748b', fontSize: 14 }}>Active public complaints and grievance logs filtered by department and status.</p>
            </div>

            <div style={{
                background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
                overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
                {loading ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
                        <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                        Fetching Grievance Logs...
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px' }}>Ticket ID</th>
                                <th>Department</th>
                                <th>Description / Issue</th>
                                <th>Current Status</th>
                                <th>SLA Info</th>
                                <th style={{ padding: '20px 25px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                        <span className="material-icons" style={{ fontSize: 48, display: 'block', marginBottom: 15 }}>check_circle_outline</span>
                                        All grievances cleared. No active complaints found.
                                    </td>
                                </tr>
                            )}
                            {data.map(t => (
                                <tr key={t.id} style={{ transition: 'background 0.2s' }}>
                                    <td style={{ padding: '18px 25px' }}>
                                        <div style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--gov-navy)', fontSize: 15 }}>{t.ticketId}</div>
                                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Logged: {formatDate(t.createdAt)}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{t.complaint?.department?.name || 'General Enquiry'}</div>
                                        <div style={{ fontSize: 11, color: '#64748b' }}>{t.complaint?.location || 'Location Not Specified'}</div>
                                    </td>
                                    <td style={{ maxWidth: 350 }}>
                                        <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {t.complaint?.description}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge--${t.status.toLowerCase()}`} style={{
                                            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase'
                                        }}>
                                            {t.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                                            High Priority
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Target: 48 Hrs</div>
                                    </td>
                                    <td style={{ padding: '18px 25px' }}>
                                        <select
                                            className="suvi-input-group__field"
                                            style={{ fontSize: 12, height: 36, minWidth: 140, padding: '0 10px', fontWeight: 600 }}
                                            value={t.status}
                                            onChange={e => handleStatus(t.id, e.target.value)}
                                        >
                                            {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div style={{ marginTop: 20, textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
                🔒 Official Government Document Management System
            </div>
        </div>
    );
}
