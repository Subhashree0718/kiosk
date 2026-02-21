import React, { useEffect, useState } from 'react';
import { getAllTickets, updateTicket } from '../services/api.js';
import { formatDate } from '@suvidha/utils';
import { TICKET_STATUS } from '@suvidha/config';

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ status: '', priority: '', page: 1 });
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await getAllTickets(filters);
            setTickets(res.data.data);
            setTotal(res.data.total);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, [filters]);

    async function handleStatusChange(id, status) {
        await updateTicket(id, { status, note: `Status updated by admin.` });
        load();
    }

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">🎫 All Tickets</h1>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <select className="suvi-input-group__field" style={{ minWidth: 150 }} value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
                    <option value="">All Statuses</option>
                    {Object.keys(TICKET_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="suvi-input-group__field" style={{ minWidth: 140 }} value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}>
                    <option value="">All Priorities</option>
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <span style={{ alignSelf: 'center', color: '#6b7280', fontSize: '.88rem' }}>Total: {total}</span>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th><th>Type</th><th>Status</th><th>Priority</th><th>SLA Deadline</th><th>Created</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No tickets found.</td></tr>}
                            {tickets.map(t => (
                                <tr key={t.id}>
                                    <td><span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1a56db' }}>{t.ticketId}</span></td>
                                    <td>{t.serviceType?.replace('_', ' ')}</td>
                                    <td><span className={`badge badge--${t.status.toLowerCase()}`}>{t.status}</span></td>
                                    <td style={{ color: t.priority === 'CRITICAL' ? '#e02424' : t.priority === 'HIGH' ? '#ff5a1f' : 'inherit', fontWeight: 600 }}>{t.priority}</td>
                                    <td style={{ fontSize: '.82rem' }}>{formatDate(t.slaDeadline)}</td>
                                    <td style={{ fontSize: '.82rem' }}>{formatDate(t.createdAt)}</td>
                                    <td>
                                        <select className="suvi-input-group__field" style={{ fontSize: '.8rem', padding: '.3rem .5rem', minWidth: 130 }}
                                            value={t.status}
                                            onChange={e => handleStatusChange(t.id, e.target.value)}>
                                            {Object.keys(TICKET_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button className="suvi-btn suvi-btn--secondary" disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
                <span style={{ alignSelf: 'center', fontSize: '.88rem', color: '#6b7280' }}>Page {filters.page}</span>
                <button className="suvi-btn suvi-btn--secondary" disabled={tickets.length < 25} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
            </div>
        </div>
    );
}
