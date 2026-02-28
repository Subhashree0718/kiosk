import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { wSubmitComplaint, wGetComplaintStatus, wMyProperties } from '../services/waterApi.js';
import { useKioskStore } from '../store/index.js';
import { useT } from '../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

export default function WaterComplaints() {
    const navigate = useNavigate();
    const sessionMobile = useKioskStore(s => s.sessionMobile);
    const { t } = useT();
    const [mode, setMode] = useState(null); // 'register' | 'check'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Form states — mobile removed, taken from session
    const [propertyId, setPropertyId] = useState('');
    const [propertyIdLoading, setPropertyIdLoading] = useState(false);
    const [propertyIdMsg, setPropertyIdMsg] = useState('');
    const [description, setDescription] = useState('');
    const [complaintId, setComplaintId] = useState('');

    // Auto-fetch the user's Property ID when they open the register form
    const fetchPropertyId = async () => {
        if (!sessionMobile) return;
        setPropertyIdLoading(true);
        setPropertyIdMsg('');
        try {
            const { data } = await wMyProperties(sessionMobile);
            const firstProp = data?.properties?.[0]?.propertyId;
            if (firstProp) {
                setPropertyId(firstProp);
                setPropertyIdMsg(`✓ Auto-filled: ${firstProp}`);
            } else {
                setPropertyIdMsg('No property ID found for your mobile. Enter manually.');
            }
        } catch (_) {
            setPropertyIdMsg('Could not fetch Property ID. Enter manually.');
        } finally {
            setPropertyIdLoading(false);
        }
    };

    // Auto-run when user switches to register mode
    useEffect(() => {
        if (mode === 'register' && sessionMobile && !propertyId) {
            fetchPropertyId();
        }
    }, [mode]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!sessionMobile) {
            setError('Session expired. Please return to the main screen and login again.');
            return;
        }
        if (!propertyId || !description) {
            setError(t('Please fill in all required fields.', 'कृपया सभी आवश्यक जानकारी भरें।'));
            return;
        }
        setLoading(true);
        try {
            // mobile is taken from session — no user input needed
            const { data } = await wSubmitComplaint({ propertyId, mobile: sessionMobile, description });
            setResult({ type: 'success', id: data.complaintId, msg: 'Complaint registered successfully!' });
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };


    const handleCheck = async (e) => {
        e.preventDefault();
        setError('');
        if (!complaintId) {
            setError('Please enter a Complaint ID | कृपया शिकायत संख्या दर्ज करें।');
            return;
        }
        setLoading(true);
        try {
            const { data } = await wGetComplaintStatus(complaintId);
            setResult({ type: 'status', data: data.data || data });
        } catch (err) {
            setError(err.message || 'Complaint not found.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setMode(null);
        setResult(null);
        setError('');
        setPropertyId('');
        setDescription('');
        setComplaintId('');
    };


    return (
        <GovLayout breadcrumbs={['Departments', 'Water Supply Board', 'Complaints']}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <Icon name="report_problem" size={50} color="#fff" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">शिकायत पंजीकरण एवं ट्रैकिंग</div>
                    <div className="kiosk-gov-text-en">Grievance Registration & Tracking</div>
                </div>
            </div>

            <div className="kiosk-container">

                {!mode && (
                    <div className="kiosk-grid" style={{ marginTop: 40 }}>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid #e67e22' }} onClick={() => setMode('register')}>
                            <Icon name="add_task" size={80} color="#e67e22" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">नई शिकायत</span>
                                Register New
                            </div>
                            <div className="kiosk-tile__desc">Report leakage, supply pipe damage, or water quality issues.</div>
                        </div>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid var(--gov-navy)' }} onClick={() => setMode('check')}>
                            <Icon name="fact_check" size={80} color="var(--gov-navy)" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">स्थिति जाँचें</span>
                                Check Status
                            </div>
                            <div className="kiosk-tile__desc">Enter your Complaint ID to track progress and view remarks.</div>
                        </div>
                    </div>
                )}

                {mode === 'register' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ fontSize: 28, marginBottom: 30, color: 'var(--gov-navy)', textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block', fontSize: 32 }}>नई शिकायत पंजीकरण</span>
                            New Complaint Registration
                        </h2>

                        {error && (
                            <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, marginBottom: 25 }}>
                                <Icon name="error" size={24} style={{ marginRight: 10 }} /> {error}
                            </div>
                        )}

                        {/* Session mobile indicator — no input needed */}
                        {sessionMobile && (
                            <div style={{ background: '#e8f5e9', border: '1px solid #27ae60', padding: '12px 16px', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Icon name="verified_user" size={22} color="#27ae60" />
                                <span style={{ fontSize: 16, color: '#2e7d32' }}>
                                    Complaint will be registered for mobile <strong>+91-XXXXXX{sessionMobile.slice(-4)}</strong>
                                </span>
                            </div>
                        )}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">संपत्ति आईडी / उपभोक्ता संख्या</span>
                                Property ID / Consumer ID <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <input className="kiosk-input" style={{ flex: 1 }} type="text"
                                    placeholder={propertyIdLoading ? 'Fetching your Property ID…' : 'e.g. PROP-12345'}
                                    value={propertyId}
                                    onChange={e => { setPropertyId(e.target.value); setPropertyIdMsg(''); }} />
                                <button type="button"
                                    style={{ whiteSpace: 'nowrap', height: 60, padding: '0 18px', background: 'var(--gov-navy)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: propertyIdLoading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
                                    onClick={fetchPropertyId} disabled={propertyIdLoading}>
                                    <Icon name={propertyIdLoading ? 'hourglass_top' : 'manage_search'} size={20} color="#fff" />
                                    {propertyIdLoading ? 'Fetching…' : 'Fetch My ID'}
                                </button>
                            </div>
                            {propertyIdMsg && (
                                <div style={{ fontSize: 13, marginTop: 6, color: propertyIdMsg.startsWith('✓') ? '#27ae60' : '#e67e22', fontWeight: 600 }}>
                                    {propertyIdMsg}
                                </div>
                            )}
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">शिकायत का विवरण</span>
                                Complaint Description <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea className="kiosk-input" style={{ height: 120, paddingTop: 15 }} placeholder="Describe the issue..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">रद्द करें</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>CANCEL</div>
                                </div>
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleRegister} disabled={loading}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'जमा हो रहा है...' : 'शिकायत दर्ज करें'}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>REGISTER COMPLAINT</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'check' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ fontSize: 28, marginBottom: 30, color: 'var(--gov-navy)', textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block', fontSize: 32 }}>शिकायत की स्थिति</span>
                            Check Complaint Status
                        </h2>

                        {error && (
                            <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, marginBottom: 25 }}>
                                <Icon name="error" size={24} style={{ marginRight: 10 }} /> {error}
                            </div>
                        )}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">शिकायत संख्या</span>
                                Complaint ID
                            </label>
                            <input className="kiosk-input" type="text" placeholder="e.g. COMP-XXXXXX" value={complaintId} onChange={e => setComplaintId(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">वापस</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>BACK</div>
                                </div>
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleCheck} disabled={loading}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'खोज रहे हैं...' : 'स्थिति जाँचें'}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>CHECK STATUS</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {result && result.type === 'success' && (
                    <div className="kiosk-form kiosk-gov-card" style={{ textAlign: 'center' }}>
                        <Icon name="check_circle" size={100} color="var(--gov-green)" />
                        <h2 style={{ fontSize: 36, margin: '20px 0', color: 'var(--gov-green)' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block' }}>सफल!</span>
                            Success!
                        </h2>
                        <p style={{ fontSize: 22, marginBottom: 30 }}>Complaint registered successfully | शिकायत सफलतापूर्वक दर्ज की गई।</p>

                        <div style={{ background: '#f8f9fa', padding: 30, borderRadius: 15, marginBottom: 30, border: '2px solid #ddd' }}>
                            <div style={{ fontSize: 16, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Your Complaint ID / आपकी शिकायत संख्या</div>
                            <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--gov-navy)', marginTop: 10 }}>{result.id}</div>
                        </div>

                        <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={reset}>
                            <span className="kiosk-gov-btn-hi">पूर्ण (समाप्त)</span> | DONE
                        </button>
                    </div>
                )}

                {result && result.type === 'status' && (() => {
                    const d = result.data;
                    const fmtDate = (dt) => dt ? new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
                    const statusColor = { PENDING: '#e67e22', IN_PROGRESS: '#2980b9', RESOLVED: '#27ae60', CLOSED: '#555', ESCALATED: '#c0392b' }[d.status] || '#555';
                    // Strip old '[Property ID: ...] ' prefix that may exist in legacy descriptions
                    const cleanDesc = (d.description || '').replace(/^\[Property ID:.*?\]\s*/i, '');

                    const Field = ({ hi, en, value, accent = '#1a3a5c', mono = false }) => (
                        <div style={{ borderLeft: `5px solid ${accent}`, paddingLeft: 16, marginBottom: 20 }}>
                            <div style={{ fontSize: 18, fontFamily: 'Noto Sans Devanagari', color: accent, fontWeight: 700 }}>{hi}</div>
                            <div style={{ fontSize: 13, color: '#999', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{en}</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#222', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-word' }}>{value}</div>
                        </div>
                    );

                    return (
                        <div className="kiosk-gov-card">
                            {/* Header */}
                            <div style={{ background: 'var(--gov-navy)', color: '#fff', borderRadius: '12px 12px 0 0', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                <div>
                                    <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: 1, textTransform: 'uppercase' }}>शिकायत विवरण | Complaint Details</div>
                                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, marginTop: 4, fontFamily: 'monospace' }}>{d.complaintId}</div>
                                </div>
                                <span style={{ background: statusColor, color: '#fff', padding: '8px 22px', borderRadius: 30, fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>
                                    {d.status}
                                </span>
                            </div>

                            {/* Detail rows */}
                            <div style={{ padding: '28px 32px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                                    {d.propertyId && <Field hi="संपत्ति आईडी" en="Property ID" value={d.propertyId} accent="#1a3a5c" mono />}
                                    {d.consumerName && <Field hi="उपभोक्ता का नाम" en="Consumer Name" value={d.consumerName} accent="#27ae60" />}
                                    <Field hi="दर्ज करने की तारीख" en="Registered On" value={fmtDate(d.createdAt)} accent="#2980b9" />
                                    {d.resolvedAt && <Field hi="समाधान तारीख" en="Resolved On" value={fmtDate(d.resolvedAt)} accent="#27ae60" />}
                                    {d.priority && <Field hi="प्राथमिकता" en="Priority" value={d.priority} accent="#e67e22" />}
                                    {d.assignedTo && <Field hi="आवंटित अधिकारी" en="Assigned To" value={d.assignedTo} accent="#8e44ad" />}
                                </div>

                                <div style={{ borderLeft: '5px solid #e74c3c', paddingLeft: 16, marginTop: 10 }}>
                                    <div style={{ fontSize: 18, fontFamily: 'Noto Sans Devanagari', color: '#e74c3c', fontWeight: 700 }}>विवरण</div>
                                    <div style={{ fontSize: 13, color: '#999', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</div>
                                    <div style={{ fontSize: 16, color: '#333', lineHeight: 1.7 }}>{cleanDesc || '—'}</div>
                                </div>

                                <div style={{ borderLeft: '5px solid #95a5a6', paddingLeft: 16, marginTop: 20 }}>
                                    <div style={{ fontSize: 18, fontFamily: 'Noto Sans Devanagari', color: '#7f8c8d', fontWeight: 700 }}>टिप्पणी</div>
                                    <div style={{ fontSize: 13, color: '#999', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Remarks / Official Notes</div>
                                    <div style={{ fontSize: 16, color: d.remarks ? '#333' : '#aaa', fontStyle: d.remarks ? 'normal' : 'italic', lineHeight: 1.7 }}>
                                        {d.remarks || 'No official remarks recorded yet. Check back later.'}
                                    </div>
                                </div>

                                <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', marginTop: 30, height: 70 }} onClick={reset}>
                                    <Icon name="arrow_back" size={24} color="#fff" style={{ marginRight: 8 }} />
                                    <span className="kiosk-gov-btn-hi">मुख्य मेनू पर वापस जाएं</span>&nbsp;| BACK TO MENU
                                </button>
                            </div>
                        </div>
                    );
                })()}


                <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60 }} onClick={() => navigate('/water')}>
                        <Icon name="home" size={24} color="#fff" /> EXIT BOARD | बाहर निकलें
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
