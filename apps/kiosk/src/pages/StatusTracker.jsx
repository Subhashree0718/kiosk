import React, { useState } from 'react';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';

const STATUS_COLORS = {
    PENDING: 'gov-badge--pending',
    IN_PROGRESS: 'gov-badge--in_progress',
    RESOLVED: 'gov-badge--resolved',
    ESCALATED: 'gov-badge--escalated',
    CLOSED: 'gov-badge--closed',
};

export default function StatusTracker() {
    const [ticketId, setTicketId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function search(e) {
        e.preventDefault();
        if (!ticketId.trim()) { setError('Please enter a ticket ID.'); return; }
        setError(''); setResult(null); setLoading(true);
        try {
            const { data } = await api.get(`/tickets/${ticketId.toUpperCase().trim()}`);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Ticket not found. Please check the ID.');
        } finally { setLoading(false); }
    }

    return (
        <GovLayout breadcrumbs={['Citizen Services', 'Track Complaint / Status']}>
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
                <div className="gov-card" style={{ marginBottom: 16 }}>
                    <div className="gov-card__header">🔍 Track Complaint / Service Request Status</div>
                    <div className="gov-card__body">
                        <p style={{ fontSize: 13, marginBottom: 14, color: 'var(--gov-text-muted)' }}>
                            Enter the Ticket ID received via SMS after submitting your complaint or service request.
                        </p>
                        {error && <div className="gov-alert gov-alert--error mb-2">⚠ {error}</div>}
                        <form onSubmit={search} style={{ display: 'flex', gap: 10 }}>
                            <input
                                className="gov-form-group__field gov-otp-input"
                                style={{ flex: 1, letterSpacing: '0.15em', fontSize: '1.1rem', textTransform: 'uppercase' }}
                                type="text" placeholder="SVDH-XXXXXXXX"
                                value={ticketId} onChange={e => setTicketId(e.target.value.toUpperCase())}
                                maxLength={16} required
                            />
                            <button className="gov-btn gov-btn--primary" type="submit" disabled={loading}>
                                {loading ? '…' : 'Track →'}
                            </button>
                        </form>
                    </div>
                </div>

                {result && (
                    <div className="gov-card">
                        <div className="gov-card__header">
                            Ticket Details
                            <span className={`gov-badge ${STATUS_COLORS[result.status] || ''}`}
                                style={{ marginLeft: 12, verticalAlign: 'middle' }}>
                                {result.status?.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="gov-card__body">
                            <table className="gov-table" style={{ marginBottom: 16 }}>
                                <tbody>
                                    <tr><td><b>Ticket ID</b></td>
                                        <td><span className="gov-ticket-id">{result.ticketId}</span></td></tr>
                                    <tr><td><b>Service Type</b></td><td>{result.serviceType?.replace(/_/g, ' ')}</td></tr>
                                    <tr><td><b>Status</b></td>
                                        <td><span className={`gov-badge ${STATUS_COLORS[result.status] || ''}`}>
                                            {result.status?.replace(/_/g, ' ')}</span></td></tr>
                                    <tr><td><b>Priority</b></td><td>{result.priority}</td></tr>
                                    <tr><td><b>SLA Deadline</b></td>
                                        <td style={{ color: 'var(--gov-error)' }}>
                                            {result.slaDeadline ? new Date(result.slaDeadline).toLocaleString('en-IN') : '—'}
                                        </td></tr>
                                    <tr><td><b>Created On</b></td>
                                        <td>{result.createdAt ? new Date(result.createdAt).toLocaleString('en-IN') : '—'}</td></tr>
                                </tbody>
                            </table>

                            {result.statusHistory?.length > 0 && (
                                <>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 10 }}>
                                        Status History / गतिविधि इतिहास
                                    </h4>
                                    <div style={{ borderLeft: '3px solid var(--gov-navy)', paddingLeft: 16 }}>
                                        {result.statusHistory.map((h, i) => (
                                            <div key={i} style={{ marginBottom: 12, position: 'relative' }}>
                                                <div style={{
                                                    position: 'absolute', left: -22, top: 3,
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    background: i === 0 ? 'var(--gov-saffron)' : 'var(--gov-navy)',
                                                    border: '2px solid #fff', boxShadow: '0 0 0 2px var(--gov-navy)'
                                                }} />
                                                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gov-navy)' }}>
                                                    {h.status?.replace(/_/g, ' ')}
                                                </div>
                                                {h.note && <div style={{ fontSize: 12, color: 'var(--gov-text-muted)' }}>{h.note}</div>}
                                                <div style={{ fontSize: 11, color: '#999' }}>
                                                    {new Date(h.changedAt).toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </GovLayout>
    );
}
