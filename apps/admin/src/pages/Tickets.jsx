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
            <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="admin-page__title" style={{ marginBottom: 5 }}>All Tickets / सभी टिकट</h1>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Manage and monitor citizen service requests across all departments.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="suvi-btn suvi-btn--secondary" onClick={load} style={{ padding: '8px 15px', fontSize: 13 }}>
                        <span className="material-icons" style={{ fontSize: 16, marginRight: 5 }}>refresh</span>
                        REFRESH
                    </button>
                    <button className="suvi-btn suvi-btn--primary" style={{ padding: '8px 15px', fontSize: 13 }}>
                        <span className="material-icons" style={{ fontSize: 16, marginRight: 5 }}>download</span>
                        EXPORT CSV
                    </button>
                </div>
            </div>

            {/* Comprehensive Filter Bar */}
            <div style={{
                background: '#fff', padding: '20px 25px', borderRadius: 16,
                border: '1px solid #e2e8f0', marginBottom: 25, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Filter by Status</label>
                    <select className="suvi-input-group__field" style={{ minWidth: 180, height: 42 }} value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
                        <option value="">All Statuses / सभी स्थितियाँ</option>
                        {Object.keys(TICKET_STATUS).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Filter by Priority</label>
                    <select className="suvi-input-group__field" style={{ minWidth: 160, height: 42 }} value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}>
                        <option value="">All Priorities</option>
                        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Showing Total Results</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--gov-navy)' }}>{total}</div>
                </div>
            </div>

            <div style={{
                background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
                overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
                {loading ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
                        <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                        Loading Repository...
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px' }}>Ticket ID</th>
                                <th>Category</th>
                                <th>Current Status</th>
                                <th>Priority</th>
                                <th>SLA Deadline</th>
                                <th style={{ padding: '20px 25px' }}>Quick Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                        <span className="material-icons" style={{ fontSize: 48, display: 'block', marginBottom: 15 }}>inventory_2</span>
                                        No tickets matching your current filters.
                                    </td>
                                </tr>
                            )}
                            {tickets.map(t => (
                                <tr key={t.id} style={{ transition: 'background 0.2s' }}>
                                    <td style={{ padding: '18px 25px' }}>
                                        <div style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--gov-navy)', fontSize: 15 }}>{t.ticketId}</div>
                                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{formatDate(t.createdAt)}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{t.serviceType?.replace(/_/g, ' ')}</div>
                                        <div style={{ fontSize: 11, color: '#64748b' }}>{t.department?.name || 'General'}</div>
                                    </td>
                                    <td>
                                        <span className={`badge badge--${t.status.toLowerCase()}`} style={{
                                            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase'
                                        }}>
                                            {t.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            color: t.priority === 'CRITICAL' ? '#ef4444' : t.priority === 'HIGH' ? '#f97316' : '#64748b',
                                            fontWeight: 800, fontSize: 12
                                        }}>
                                            <span className="material-icons" style={{ fontSize: 14 }}>{t.priority === 'CRITICAL' ? 'priority_high' : 'radio_button_checked'}</span>
                                            {t.priority}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                                        {formatDate(t.slaDeadline)}
                                    </td>
                                    <td style={{ padding: '18px 25px' }}>
                                        <select
                                            className="suvi-input-group__field"
                                            style={{ fontSize: 12, height: 36, minWidth: 150, padding: '0 10px', fontWeight: 600 }}
                                            value={t.status}
                                            onChange={e => handleStatusChange(t.id, e.target.value)}
                                        >
                                            {Object.keys(TICKET_STATUS).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Footer */}
                <div style={{
                    padding: '20px 25px', borderTop: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fcfdfe'
                }}>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                        Page <strong>{filters.page}</strong> of repository
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            className="suvi-btn suvi-btn--secondary"
                            disabled={filters.page === 1}
                            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                            style={{ padding: '8px 20px', fontSize: 13 }}
                        >
                            PREVIOUS
                        </button>
                        <button
                            className="suvi-btn suvi-btn--secondary"
                            disabled={tickets.length < 25}
                            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                            style={{ padding: '8px 20px', fontSize: 13 }}
                        >
                            NEXT PAGE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
