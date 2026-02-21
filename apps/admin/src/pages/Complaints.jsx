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
            <h1 className="admin-page__title">📢 Complaint Management</h1>
            <div className="card" style={{ overflowX: 'auto' }}>
                {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div> : (
                    <table className="admin-table">
                        <thead>
                            <tr><th>Ticket</th><th>Department</th><th>Description</th><th>Location</th><th>Status</th><th>Created</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0 && <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No complaints found.</td></tr>}
                            {data.map(t => (
                                <tr key={t.id}>
                                    <td><span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1a56db' }}>{t.ticketId}</span></td>
                                    <td>{t.complaint?.department?.name || '—'}</td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.complaint?.description}</td>
                                    <td style={{ fontSize: '.82rem', color: '#6b7280' }}>{t.complaint?.location || '—'}</td>
                                    <td><span className={`badge badge--${t.status.toLowerCase()}`}>{t.status}</span></td>
                                    <td style={{ fontSize: '.82rem' }}>{formatDate(t.createdAt)}</td>
                                    <td>
                                        <select className="suvi-input-group__field" style={{ fontSize: '.8rem', padding: '.3rem .5rem', minWidth: 130 }}
                                            value={t.status} onChange={e => handleStatus(t.id, e.target.value)}>
                                            {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
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
