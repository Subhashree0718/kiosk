import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';
import { fetchFullProfile } from '../services/profileApi.js';
import { useT } from '../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

export default function Profile() {
    const navigate = useNavigate();
    const { t } = useT();
    const sessionMobile = useKioskStore(s => s.sessionMobile);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        if (!sessionMobile) {
            navigate('/login');
            return;
        }
        loadProfile();
    }, [sessionMobile]);

    async function loadProfile() {
        try {
            setLoading(true);
            const res = await fetchFullProfile(sessionMobile);
            setData(res.data);
        } catch (err) {
            setError(t('Failed to load profile history.', 'प्रोफ़ाइल इतिहास लोड करने में विफल।'));
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <GovLayout>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="kiosk-loader"></div>
            </div>
        </GovLayout>
    );

    if (error || !data) return (
        <GovLayout>
            <div className="kiosk-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <Icon name="error_outline" size={80} color="#ef4444" />
                <h2 style={{ fontSize: 32, marginTop: 20 }}>{error || t('Profile not found.', 'प्रोफ़ाइल नहीं मिली।')}</h2>
                <button className="kiosk-btn kiosk-btn--primary" style={{ marginTop: 30 }} onClick={() => navigate('/dashboard')}>
                    {t('BACK TO DASHBOARD', 'डैशबोर्ड पर वापस जाएं')}
                </button>
            </div>
        </GovLayout>
    );

    const { profile, summary, history } = data;

    const tabs = [
        { id: 'summary', icon: 'dashboard', label: t('Summary', 'सारांश') },
        { id: 'payments', icon: 'payments', label: t('Payments', 'भुगतान') },
        { id: 'complaints', icon: 'campaign', label: t('Complaints', 'शिकायतें') },
        { id: 'services', icon: 'assignment', label: t('Services', 'सेवाएँ') },
        { id: 'activity', icon: 'history', label: t('Activity', 'गतिविधि') },
    ];

    return (
        <GovLayout breadcrumbs={['Dashboard', t('Citizen Profile', 'नागरिक प्रोफ़ाइल')]}>
            <div className="kiosk-gov-strip"></div>

            <div className="kiosk-container" style={{ padding: '40px 0' }}>

                {/* 1. Profile Header Card */}
                <div className="kiosk-glass" style={{ padding: 40, borderRadius: 40, marginBottom: 40, display: 'flex', gap: 40, alignItems: 'center', border: '2px solid rgba(255,255,255,0.5)' }}>
                    <div style={{ width: 150, height: 150, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gov-navy), var(--gov-saffron))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <Icon name="person" size={80} color="#fff" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
                            <div style={{ background: 'var(--gov-saffron)', color: '#fff', fontSize: 12, fontWeight: 900, padding: '4px 12px', borderRadius: 20, letterSpacing: 1 }}>{profile.role}</div>
                            <div style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>{t('Member Since:', 'सदस्यता तिथि:')} {new Date(profile.memberSince).toLocaleDateString()}</div>
                        </div>
                        <h1 style={{ fontSize: 42, color: 'var(--gov-navy)', margin: 0, fontWeight: 900 }}>{profile.name || t('Citizen User', 'नागरिक उपयोगकर्ता')}</h1>
                        <div style={{ display: 'flex', gap: 30, marginTop: 15 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontWeight: 700 }}>
                                <Icon name="smartphone" size={20} color="var(--gov-navy)" /> {profile.mobile}
                            </div>
                            {profile.email && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontWeight: 700 }}>
                                    <Icon name="alternate_email" size={20} color="var(--gov-navy)" /> {profile.email}
                                </div>
                            )}
                        </div>
                        {profile.propertyId && (
                            <div style={{ marginTop: 10, display: 'flex', gap: 20 }}>
                                <div style={{ background: '#f1f5f9', padding: '6px 15px', borderRadius: 10, fontSize: 13, border: '1px solid #e2e8f0' }}>
                                    <b>PID:</b> {profile.propertyId}
                                </div>
                                <div style={{ background: '#f1f5f9', padding: '6px 15px', borderRadius: 10, fontSize: 13, border: '1px solid #e2e8f0' }}>
                                    <b>CID:</b> {profile.consumerId}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 30 }}>

                    {/* Sidebar Tabs */}
                    <div className="kiosk-glass" style={{ padding: 20, borderRadius: 30, height: 'fit-content' }}>
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                style={{
                                    width: '100%', padding: '20px 25px', borderRadius: 20, border: 'none',
                                    background: activeTab === t.id ? 'var(--gov-navy)' : 'transparent',
                                    color: activeTab === t.id ? '#fff' : '#334155',
                                    display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer',
                                    transition: 'all 0.2s', marginBottom: 10, textAlign: 'left',
                                    fontWeight: 800, fontSize: 18
                                }}
                            >
                                <Icon name={t.icon} size={24} color={activeTab === t.id ? '#fff' : 'var(--gov-navy)'} />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="kiosk-glass" style={{ padding: 40, borderRadius: 30, minHeight: 600 }}>
                        {activeTab === 'summary' && (
                            <div>
                                <h2 style={{ fontSize: 28, color: 'var(--gov-navy)', marginBottom: 30, borderBottom: '2px solid #f1f5f9', paddingBottom: 15 }}>
                                    {t('Overview & Metrics', 'सिंहावलोकन और मेट्रिक्स')}
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                                    <SummaryCard icon="payments" color="#3b82f6" label={t('Total Payments', 'कुल भुगतान')} value={`₹${summary.totalWaterAmountPaid + summary.totalGeneralPayments}`} />
                                    <SummaryCard icon="campaign" color="#f59e0b" label={t('Active Grievances', 'सक्रिय शिकायतें')} value={summary.pendingWaterComplaints} />
                                    <SummaryCard icon="assignment_turned_in" color="#10b981" label={t('Services Used', 'उपयोग की गई सेवाएँ')} value={summary.totalServiceRequests + summary.totalWaterConnections} />
                                    <SummaryCard icon="history" color="#6366f1" label={t('Events Tracked', 'ट्रैक की गई घटनाएँ')} value={history.changeLog.length} />
                                </div>

                                <div style={{ marginTop: 40, padding: 30, background: 'rgba(255,255,255,0.5)', borderRadius: 25, border: '1px dashed #cbd5e1' }}>
                                    <h3 style={{ margin: '0 0 15px 0' }}>{t('Project Information', 'परियोजना की जानकारी')}</h3>
                                    <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>
                                        {t('This profile aggregates data from all SUVIDHA modules including Water, Electricity, and Municipal services. Your history is securely tracked to ensure transparent government service delivery.', 'यह प्रोफ़ाइल जल, बिजली और नगरपालिका सेवाओं सहित सभी सुविधा मॉड्यूल से डेटा एकत्र करती है। पारदर्शी सरकारी सेवा वितरण सुनिश्चित करने के लिए आपका इतिहास सुरक्षित रूप से ट्रैक किया जाता है।')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div>
                                <h2 style={{ fontSize: 28, color: 'var(--gov-navy)', marginBottom: 30, borderBottom: '2px solid #f1f5f9', paddingBottom: 15 }}>
                                    {t('Payment History', 'भुगतान इतिहास')}
                                </h2>
                                <HistoryTable
                                    headers={[t('Date', 'दिनांक'), t('Dept', 'विभाग'), t('ID/Consumer', 'आईडी/उपभोक्ता'), t('Amount', 'राशि'), t('Status', 'स्थिति')]}
                                    rows={[
                                        ...history.waterPayments.map(p => ({
                                            date: p.createdAt, dept: 'Water', id: p.propertyId, amount: `₹${p.amountPaid}`, status: p.status, color: p.status === 'SUCCESS' ? '#10b981' : '#f59e0b'
                                        })),
                                        ...history.generalPayments.map(p => ({
                                            date: p.date, dept: p.department, id: p.consumerNo, amount: `₹${p.amountPaid}`, status: p.status, color: p.status === 'SUCCESS' ? '#10b981' : '#f59e0b'
                                        }))
                                    ].sort((a, b) => new Date(b.date) - new Date(a.date))}
                                />
                            </div>
                        )}

                        {activeTab === 'complaints' && (
                            <div>
                                <h2 style={{ fontSize: 28, color: 'var(--gov-navy)', marginBottom: 30, borderBottom: '2px solid #f1f5f9', paddingBottom: 15 }}>
                                    {t('Grievance & Complaints', 'शिकायत और समस्या')}
                                </h2>
                                <HistoryTable
                                    headers={[t('Ticket ID', 'टिकट आईडी'), t('Department', 'विभाग'), t('Description', 'विवरण'), t('Status', 'स्थिति')]}
                                    rows={[
                                        ...history.waterComplaints.map(c => ({
                                            id: c.complaintId, dept: 'Water', desc: c.description, status: c.status, color: c.status === 'RESOLVED' ? '#10b981' : '#f59e0b', date: c.createdAt
                                        })),
                                        ...history.generalComplaints.map(c => ({
                                            id: c.ticketId, dept: c.department, desc: c.description, status: c.status, color: c.status === 'RESOLVED' ? '#10b981' : '#f59e0b', date: c.date
                                        }))
                                    ].sort((a, b) => new Date(b.date) - new Date(a.date))}
                                />
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div>
                                <h2 style={{ fontSize: 28, color: 'var(--gov-navy)', marginBottom: 30, borderBottom: '2px solid #f1f5f9', paddingBottom: 15 }}>
                                    {t('Service Applications', 'सेवा आवेदन')}
                                </h2>
                                <HistoryTable
                                    headers={[t('App No', 'आवेदन संख्या'), t('Type', 'प्रकार'), t('Dept', 'विभाग'), t('Status', 'स्थिति')]}
                                    rows={[
                                        ...history.waterConnections.map(c => ({
                                            id: c.applicationNo, type: c.connectionType, dept: 'Water', status: c.status, color: c.status === 'APPROVED' ? '#10b981' : '#3b82f6', date: c.createdAt
                                        })),
                                        ...history.serviceRequests.map(r => ({
                                            id: r.ticketId, type: r.serviceType, dept: r.department, status: r.status, color: r.status === 'RESOLVED' ? '#10b981' : '#3b82f6', date: r.date
                                        }))
                                    ].sort((a, b) => new Date(b.date) - new Date(a.date))}
                                />
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div>
                                <h2 style={{ fontSize: 28, color: 'var(--gov-navy)', marginBottom: 30, borderBottom: '2px solid #f1f5f9', paddingBottom: 15 }}>
                                    {t('System Logs & Profile Changes', 'सिस्टम लॉग और प्रोफ़ाइल परिवर्तन')}
                                </h2>
                                <div style={{ borderLeft: '4px solid var(--gov-saffron)', paddingLeft: 30, marginLeft: 10 }}>
                                    {history.changeLog.map((log, i) => (
                                        <div key={i} style={{ marginBottom: 30, position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: -38, top: 0, width: 16, height: 16, borderRadius: '50%', background: 'var(--gov-saffron)', border: '4px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}></div>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b' }}>{new Date(log.date).toLocaleString()}</div>
                                            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--gov-navy)', marginTop: 4 }}>{log.type.replace(/_/g, ' ')}</div>
                                            <div style={{ fontSize: 16, color: '#334155', marginTop: 4 }}>{log.note}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 50 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" onClick={() => navigate('/dashboard')}>
                        <Icon name="arrow_back" size={24} style={{ marginRight: 10 }} />
                        {t('BACK TO DASHBOARD', 'डैशबोर्ड पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}

function SummaryCard({ icon, color, label, value }) {
    return (
        <div style={{ padding: 25, borderRadius: 25, background: `${color}10`, border: `1.5px solid ${color}20`, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ background: color, width: 60, height: 60, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={icon} size={30} color="#fff" />
            </div>
            <div>
                <div style={{ color: '#64748b', fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#1e293b' }}>{value}</div>
            </div>
        </div>
    );
}

function HistoryTable({ headers, rows }) {
    if (!rows.length) return (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <Icon name="inventory_2" size={60} color="#cbd5e1" style={{ marginBottom: 15 }} />
            <div style={{ fontSize: 18, fontWeight: 700 }}>No records found in this category.</div>
        </div>
    );

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                        {headers.map((h, i) => (
                            <th key={i} style={{ padding: '15px 10px', fontSize: 14, textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            {/* Logic to map dynamic row objects depends on the tab, but for simplicity we assume consistent layouts for these specific tabs */}
                            {Object.values(r).filter(v => typeof v === 'string').map((val, j) => (
                                <td key={j} style={{ padding: '20px 10px', fontSize: 16, fontWeight: 700, color: '#334155' }}>
                                    {val === r.status ? (
                                        <span style={{ background: `${r.color}15`, color: r.color, padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 900 }}>{val}</span>
                                    ) : (
                                        val.startsWith('₹') ? <span style={{ color: 'var(--gov-navy)' }}>{val}</span> : val
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
