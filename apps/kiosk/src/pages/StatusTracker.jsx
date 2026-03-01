import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const [searchParams] = useSearchParams();
    const [ticketId, setTicketId] = useState('');
    const [result, setResult] = useState(null);
    const [userTickets, setUserTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserTickets();
        const id = searchParams.get('id');
        if (id) {
            setTicketId(id.toUpperCase());
            trackTicket(id.toUpperCase());
        }
    }, [searchParams]);

    async function fetchUserTickets() {
        setFetchingUsers(true);
        try {
            const { data } = await api.get('/tickets/user/me');
            setUserTickets(data.data || []);
        } catch (err) {
            console.error('Failed to fetch user tickets', err);
        } finally {
            setFetchingUsers(false);
        }
    }

    async function trackTicket(id) {
        if (!id.trim()) { setError('Please enter a ticket ID.'); return; }
        setError(''); setResult(null); setLoading(true);
        try {
            const { data } = await api.get(`/tickets/${id.toUpperCase().trim()}`);
            setResult(data.data);
            setTicketId(id.toUpperCase());
            window.scrollTo({ top: 400, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Ticket not found. Please check the ID.');
        } finally { setLoading(false); }
    }

    async function search(e) {
        e.preventDefault();
        trackTicket(ticketId);
    }

    return (
        <GovLayout breadcrumbs={['Citizen Services', 'Track Complaint / Status']}>
            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>Track Your Application</div>
                    <div style={{ fontStyle: 'italic', fontSize: 24, color: '#666', marginBottom: 15 }}>आवेदन की स्थिति जांचें</div>
                    <p style={{ fontSize: 20, color: '#666', fontWeight: 500 }}>
                        Enter your Ticket ID to know the current status and activity log.
                    </p>
                </div>

                <div className="kiosk-form" style={{ maxWidth: 850 }}>
                    <div className="kiosk-input-group">
                        <label className="kiosk-label">Ticket ID / शिकायत संख्या</label>
                        <form onSubmit={search} style={{ display: 'flex', gap: 15 }}>
                            <input
                                className="kiosk-input"
                                style={{ flex: 1, letterSpacing: '0.15em', fontSize: 32, textTransform: 'uppercase' }}
                                type="text"
                                placeholder="SVDH-XXXXXXXX"
                                value={ticketId}
                                onChange={e => setTicketId(e.target.value.toUpperCase())}
                                maxLength={20}
                                required
                            />
                            <button className="kiosk-btn kiosk-btn--primary" type="submit" disabled={loading} style={{ height: 75 }}>
                                <span className="material-icons">{loading ? 'sync' : 'search'}</span>
                                {loading ? 'Wait...' : 'Track'}
                            </button>
                        </form>
                        <div style={{ marginTop: 10, fontSize: 16, color: '#666' }}>
                            * You can find the Ticket ID in the SMS sent to your registered mobile number.
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '2px solid #ef4444',
                            padding: '15px 20px', borderRadius: 12, color: '#b91c1c',
                            marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 600
                        }}>
                            <span className="material-icons">error</span>
                            {error}
                        </div>
                    )}
                </div>

                {userTickets.length > 0 && !result && (
                    <div style={{ maxWidth: 850, margin: '40px auto 0' }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gov-navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="material-icons" style={{ color: 'var(--gov-saffron)' }}>assignment</span>
                            Your Recent Applications / आपके आवेदन
                        </div>
                        <div style={{ display: 'grid', gap: 15 }}>
                            {userTickets.map((t) => (
                                <div
                                    key={t.id}
                                    className="kiosk-glass"
                                    style={{
                                        padding: '20px 30px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        borderRadius: 20,
                                        border: '2px solid rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => trackTicket(t.ticketId)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateX(10px)';
                                        e.currentTarget.style.borderColor = 'var(--gov-navy)';
                                        e.currentTarget.style.background = '#f8fafc';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gov-navy)' }}>{t.ticketId}</div>
                                        <div style={{ fontSize: 16, color: '#64748b', fontWeight: 600 }}>
                                            {t.serviceType?.replace(/_/g, ' ')} • {new Date(t.createdAt).toLocaleDateString('en-IN')}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`gov-badge ${STATUS_COLORS[t.status] || ''}`} style={{ fontSize: 14 }}>
                                            {t.status?.replace(/_/g, ' ')}
                                        </span>
                                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 5 }}>Click to view details</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {result && (
                    <div className="kiosk-form" style={{ maxWidth: 850, marginTop: 40, background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '3px solid #f0f0f0', paddingBottom: 20 }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gov-navy)' }}>
                                Ticket Details
                            </div>
                            <span className={`gov-badge ${STATUS_COLORS[result.status] || ''}`} style={{ fontSize: 18, padding: '10px 20px' }}>
                                {result.status?.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div style={{
                            background: '#f8fafc', border: '2px solid #e2e8f0',
                            borderRadius: 16, padding: '30px', marginBottom: 30
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 20 }}>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Ticket ID</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right', color: 'var(--gov-navy)' }}>{result.ticketId}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Service Type</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>{result.serviceType?.replace(/_/g, ' ')}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>SLA Deadline</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, color: '#c2410c', textAlign: 'right' }}>
                                            {result.slaDeadline ? new Date(result.slaDeadline).toLocaleString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Created On</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>
                                            {result.createdAt ? new Date(result.createdAt).toLocaleString('en-IN') : '—'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {result.statusHistory?.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gov-navy)', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span className="material-icons">history</span>
                                    Resolution Timeline / गतिविधि इतिहास
                                </div>
                                <div style={{ borderLeft: '5px solid var(--gov-navy)', paddingLeft: 30, marginLeft: 15 }}>
                                    {result.statusHistory.map((h, i) => (
                                        <div key={i} style={{ marginBottom: 30, position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute', left: -42, top: 4,
                                                width: 18, height: 18, borderRadius: '50%',
                                                background: i === 0 ? 'var(--gov-saffron)' : 'var(--gov-navy)',
                                                border: '4px solid #fff', boxShadow: '0 0 0 4px var(--gov-navy)'
                                            }} />
                                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gov-navy)' }}>
                                                {h.status?.replace(/_/g, ' ')}
                                            </div>
                                            {h.note && <div style={{ fontSize: 16, color: '#4b5563', marginTop: 5, background: '#f3f4f6', padding: '10px 15px', borderRadius: 8 }}>{h.note}</div>}
                                            <div style={{ fontSize: 14, color: '#9ca3af', marginTop: 5, fontWeight: 600 }}>
                                                {new Date(h.changedAt).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" onClick={() => window.history.back()}>
                        <span className="material-icons">arrow_back</span>
                        Go Back / पीछे जाएं
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
