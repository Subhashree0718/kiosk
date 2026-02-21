import React, { useEffect, useState } from 'react';
import { getAllTickets, updateTicket } from '../services/api.js';
import { formatDate } from '@suvidha/utils';

export default function Escalation() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await getAllTickets({ status: 'ESCALATED', limit: 50 });
            setData(res.data.data);
        } finally { setLoading(false); }
    }
    useEffect(() => { load(); }, []);

    async function reassign(id) {
        await updateTicket(id, { status: 'IN_PROGRESS', note: 'Supervisor reassigned and handling.' });
        load();
    }

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">🚨 SLA Escalations</h1>
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '.88rem', color: '#991b1b' }}>
                <strong>⚠ Action Required:</strong> The following tickets have breached their SLA deadline and require immediate supervisor attention.
            </div>
            <div className="card" style={{ overflowX: 'auto' }}>
                {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div> : (
                    <table className="admin-table">
                        <thead>
                            <tr><th>Ticket</th><th>Type</th><th>Priority</th><th>Escalated At</th><th>SLA Deadline</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>🎉 No escalated tickets!</td></tr>}
                            {data.map(t => (
                                <tr key={t.id}>
                                    <td><span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#e02424' }}>{t.ticketId}</span></td>
                                    <td>{t.serviceType?.replace('_', ' ')}</td>
                                    <td style={{ fontWeight: 700, color: '#e02424' }}>{t.priority}</td>
                                    <td style={{ fontSize: '.82rem' }}>{t.escalatedAt ? formatDate(t.escalatedAt) : '—'}</td>
                                    <td style={{ fontSize: '.82rem', color: '#e02424' }}>{formatDate(t.slaDeadline)}</td>
                                    <td>
                                        <button className="suvi-btn suvi-btn--primary" style={{ fontSize: '.8rem' }} onClick={() => reassign(t.id)}>
                                            Take Over
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
