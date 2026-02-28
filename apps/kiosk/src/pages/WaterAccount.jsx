import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';
import { wAccountHistory } from '../services/waterApi.js';
import { useT } from '../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const StatusBadge = ({ status }) => {
    const map = {
        SUCCESS: { color: '#27ae60', label: 'PAID' },
        PENDING: { color: '#e67e22', label: 'PENDING' },
        IN_PROGRESS: { color: '#2980b9', label: 'IN PROGRESS' },
        RESOLVED: { color: '#27ae60', label: 'RESOLVED' },
        INITIATED: { color: '#7f8c8d', label: 'INITIATED' },
        ESCALATED: { color: '#c0392b', label: 'ESCALATED' },
        CLOSED: { color: '#555', label: 'CLOSED' },
    };
    const s = map[status] || { color: '#555', label: status };
    return (
        <span style={{ background: s.color + '22', color: s.color, border: `1px solid ${s.color}`, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {s.label}
        </span>
    );
};

export default function WaterAccount() {
    const navigate = useNavigate();
    const sessionMobile = useKioskStore(s => s.sessionMobile);
    const { t } = useT();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('payments');

    useEffect(() => {
        if (!sessionMobile) { setLoading(false); return; }
        wAccountHistory(sessionMobile)
            .then(({ data: d }) => setData(d))
            .catch(err => setError(err.message || 'Could not load history.'))
            .finally(() => setLoading(false));
    }, [sessionMobile]);

    const TABS = [
        { id: 'payments', icon: 'payments', label: t('Bill Payments', 'बिल भुगतान') },
        { id: 'complaints', icon: 'report_problem', label: t('Complaints', 'शिकायतें') },
        { id: 'connections', icon: 'plumbing', label: t('New Connections', 'नए कनेक्शन') },
    ];

    return (
        <GovLayout breadcrumbs={['Departments', t('Water Supply Board', 'जल आपूर्ति बोर्ड'), t('My Account', 'मेरा खाता')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <Icon name="manage_accounts" size={50} color="#fff" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">{t('My Account & History', 'मेरा खाता एवं इतिहास')}</div>
                </div>
            </div>

            <div className="kiosk-container">
                {!sessionMobile && (
                    <div style={{ textAlign: 'center', paddingTop: 60 }}>
                        <Icon name="lock" size={80} color="var(--gov-navy)" />
                        <h2 style={{ fontSize: 28, marginTop: 20 }}>Please login first</h2>
                        <button className="kiosk-btn kiosk-btn--primary" style={{ marginTop: 20 }} onClick={() => navigate('/login')}>GO TO LOGIN</button>
                    </div>
                )}

                {sessionMobile && loading && (
                    <div style={{ textAlign: 'center', paddingTop: 80 }}>
                        <Icon name="hourglass_top" size={80} color="var(--gov-navy)" />
                        <p style={{ fontSize: 22, marginTop: 20, color: '#555' }}>Loading your account history...</p>
                    </div>
                )}

                {error && (
                    <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, margin: '20px 0' }}>{error}</div>
                )}

                {data && data.found && (
                    <>
                        {/* Consumer Profile Card */}
                        <div style={{ background: 'linear-gradient(135deg, var(--gov-navy) 0%, #1a5276 100%)', color: '#fff', borderRadius: 16, padding: '24px 30px', marginBottom: 28, display: 'flex', flexWrap: 'wrap', gap: 30, alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4, letterSpacing: 1 }}>CONSUMER PROFILE</div>
                                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{data.consumerProfile.name}</div>
                                <div style={{ fontSize: 16, opacity: 0.85 }}>📱 +91-{sessionMobile}</div>
                                {data.consumerProfile.email !== 'N/A' && <div style={{ fontSize: 16, opacity: 0.85 }}>✉ {data.consumerProfile.email}</div>}
                                <div style={{ fontSize: 14, opacity: 0.65, marginTop: 8 }}>Registered: {fmtDate(data.consumerProfile.registeredOn)}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {data.consumerProfile.propertyIds.length > 0 ? (
                                    data.consumerProfile.propertyIds.map((pid, i) => (
                                        <div key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 10, minWidth: 170 }}>
                                            <div style={{ fontSize: 12, opacity: 0.7 }}>PROPERTY / CONSUMER ID</div>
                                            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, marginTop: 4 }}>{pid}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ background: 'rgba(255,200,0,0.2)', padding: '12px 20px', borderRadius: 10, fontSize: 14 }}>
                                        ⚠ No Property ID assigned yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                            {[
                                { icon: 'payments', label: 'Total Payments', labelHi: 'कुल भुगतान', value: data.summary.totalPayments, sub: `₹${(data.summary.totalAmountPaid || 0).toFixed(0)} paid`, color: '#27ae60' },
                                { icon: 'report_problem', label: 'Complaints', labelHi: 'शिकायतें', value: data.summary.totalComplaints, sub: `${data.summary.pendingComplaints} pending`, color: '#e74c3c' },
                                { icon: 'plumbing', label: 'New Connections', labelHi: 'नए कनेक्शन', value: data.summary.totalConnections, sub: 'applications', color: '#2980b9' },
                            ].map(s => (
                                <div key={s.label} style={{ background: '#fff', border: `2px solid ${s.color}22`, borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 150, textAlign: 'center' }}>
                                    <Icon name={s.icon} size={32} color={s.color} />
                                    <div style={{ fontSize: 36, fontWeight: 900, color: s.color, lineHeight: 1.2, margin: '8px 0' }}>{s.value}</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{s.label}</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* History Tabs */}
                        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #ddd', marginBottom: 20 }}>
                            {TABS.map(tab => (
                                <button key={tab.id}
                                    style={{ flex: 1, height: 60, border: 'none', borderBottom: activeTab === tab.id ? '4px solid var(--gov-navy)' : '4px solid transparent', background: activeTab === tab.id ? '#f0f4ff' : 'transparent', color: activeTab === tab.id ? 'var(--gov-navy)' : '#777', fontWeight: activeTab === tab.id ? 800 : 500, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                                    onClick={() => setActiveTab(tab.id)}>
                                    <Icon name={tab.icon} size={20} color={activeTab === tab.id ? 'var(--gov-navy)' : '#777'} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div>
                                {data.paymentHistory.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
                                        <Icon name="receipt_long" size={60} color="#ddd" />
                                        <p style={{ fontSize: 20, marginTop: 16 }}>No payment records found yet.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                                            <thead>
                                                <tr style={{ background: 'var(--gov-navy)', color: '#fff' }}>
                                                    {['Date', 'Property ID', 'Bill Amount', 'Amount Paid', 'Receipt No.', 'Status'].map(h => (
                                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.paymentHistory.map((p, i) => (
                                                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '12px 16px' }}>{fmtDate(p.date)}</td>
                                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--gov-navy)' }}>{p.propertyId || '—'}</td>
                                                        <td style={{ padding: '12px 16px' }}>₹{p.billAmount}</td>
                                                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>₹{p.amountPaid}</td>
                                                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#555', fontFamily: 'monospace' }}>{p.receiptNo}</td>
                                                        <td style={{ padding: '12px 16px' }}><StatusBadge status={p.status} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Complaints Tab */}
                        {activeTab === 'complaints' && (
                            <div>
                                {data.complaintHistory.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
                                        <Icon name="report_problem" size={60} color="#ddd" />
                                        <p style={{ fontSize: 20, marginTop: 16 }}>No complaints registered yet.</p>
                                    </div>
                                ) : (
                                    data.complaintHistory.map((c, i) => (
                                        <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '18px 20px', marginBottom: 12, borderLeft: '5px solid var(--gov-navy)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--gov-navy)', marginBottom: 6 }}>{c.complaintId}</div>
                                                    <div style={{ fontSize: 15, color: '#555', marginBottom: 8, lineHeight: 1.5 }}>{c.description}</div>
                                                    <div style={{ fontSize: 13, color: '#888' }}>
                                                        Registered: {fmtDate(c.date)}
                                                        {c.resolvedAt && <> &nbsp;|&nbsp; Resolved: {fmtDate(c.resolvedAt)}</>}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                                    <StatusBadge status={c.status} />
                                                    <span style={{ fontSize: 12, color: '#aaa', background: '#f8f8f8', padding: '2px 8px', borderRadius: 8 }}>Priority: {c.priority}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* New Connections Tab */}
                        {activeTab === 'connections' && (
                            <div>
                                {data.connectionHistory.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
                                        <Icon name="plumbing" size={60} color="#ddd" />
                                        <p style={{ fontSize: 20, marginTop: 16 }}>No new connection applications found.</p>
                                    </div>
                                ) : (
                                    data.connectionHistory.map((c, i) => (
                                        <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '18px 20px', marginBottom: 12, borderLeft: '5px solid #27ae60' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--gov-navy)', marginBottom: 4 }}>{c.applicationNo}</div>
                                                    <div style={{ fontSize: 15, color: '#555' }}>
                                                        <strong>{c.connectionType}</strong> connection — {c.applicantName || 'N/A'}
                                                    </div>
                                                    {c.address && <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>📍 {c.address}</div>}
                                                    <div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Applied: {fmtDate(c.date)}</div>
                                                </div>
                                                <StatusBadge status={c.status} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}

                {data && !data.found && (
                    <div style={{ textAlign: 'center', paddingTop: 60 }}>
                        <Icon name="person_off" size={80} color="#ddd" />
                        <h2 style={{ fontSize: 24, color: '#999', marginTop: 20 }}>No account found for this mobile number.</h2>
                        <p style={{ color: '#aaa' }}>Please register first from Water Tax → Registration.</p>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60, padding: '0 40px' }} onClick={() => navigate('/water')}>
                        <Icon name="arrow_back" size={24} color="#fff" /> {t('BACK TO WATER DEPARTMENT', 'जल विभाग पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
