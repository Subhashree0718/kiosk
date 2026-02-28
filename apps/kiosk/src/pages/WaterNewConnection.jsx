import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { wSubmitNewConnection, wGetConnectionStatus, wMyApplications } from '../services/waterApi.js';
import { useKioskStore } from '../store/index.js';
import { useT } from '../hooks/useT.js';


const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const CONNECTION_TYPES = ['Domestic', 'Commercial', 'Industrial'];

export default function WaterNewConnection() {
    const navigate = useNavigate();
    const sessionMobile = useKioskStore(s => s.sessionMobile);
    const [mode, setMode] = useState(null); // 'apply' | 'status'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Application form states
    const [appStep, setAppStep] = useState('form'); // 'form' | 'success'
    const [appName, setAppName] = useState('');
    const [appAddress, setAppAddress] = useState('');
    const [appType, setAppType] = useState('Domestic');

    // Track status
    const [appNo, setAppNo] = useState('');

    // Forgot Application Number
    const [myApplications, setMyApplications] = useState(null);
    const [loadingApps, setLoadingApps] = useState(false);

    const handleSubmitApplication = async () => {
        if (!sessionMobile) { setError('Session expired. Please return to the main screen and login again.'); return; }
        if (!appName.trim()) { setError('आवेदक का नाम आवश्यक है | Applicant name is required'); return; }
        if (!appAddress.trim()) { setError('पता आवश्यक है | Address is required'); return; }
        setLoading(true); setError('');
        try {
            const { data } = await wSubmitNewConnection({
                mobile: sessionMobile,   // from session — no user input needed
                applicantName: appName,
                address: appAddress,
                connectionType: appType,
            });
            setResult({ type: 'application', data: data });
            setAppStep('success');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleForgotAppNo = async () => {
        if (!sessionMobile) return;
        setLoadingApps(true); setMyApplications(null); setError('');
        try {
            const { data } = await wMyApplications(sessionMobile);
            setMyApplications(data);
        } catch (err) {
            setError('Could not retrieve applications. ' + (err.message || ''));
        } finally { setLoadingApps(false); }
    };

    const handleCheckStatus = async () => {
        if (!appNo) { setError('आवेदन संख्या दर्ज करें | Enter Application Number'); return; }
        setLoading(true); setError(''); setMyApplications(null);
        try {
            const { data } = await wGetConnectionStatus(appNo);
            setResult({ type: 'status', data: data.data || data });
        } catch (err) { setError('आवेदन नहीं मिला | Application not found'); }
        finally { setLoading(false); }
    };

    const reset = () => {
        setMode(null);
        setResult(null);
        setAppStep('form');
        setAppName(''); setAppAddress(''); setAppType('Domestic');
        setAppNo('');
        setError('');
        setMyApplications(null);
    };

    return (
        <GovLayout breadcrumbs={['Departments', 'Water Supply Board', 'New Connection']}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <Icon name="plumbing" size={50} color="#fff" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">नया जल कनेक्शन</div>
                    <div className="kiosk-gov-text-en">New Water Connection</div>
                </div>
            </div>

            <div className="kiosk-container">

                {/* ── Mode Selection ── */}
                {!mode && (
                    <div className="kiosk-grid" style={{ marginTop: 40 }}>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid var(--gov-navy)' }} onClick={() => setMode('apply')}>
                            <Icon name="assignment_add" size={80} color="var(--gov-navy)" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">नया आवेदन करें</span>
                                Apply for New Connection
                            </div>
                            <div className="kiosk-tile__desc">Fill application form → Get Application Number</div>
                        </div>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid #27ae60' }} onClick={() => setMode('status')}>
                            <Icon name="assignment" size={80} color="#27ae60" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">आवेदन की स्थिति</span>
                                Track Application Status
                            </div>
                            <div className="kiosk-tile__desc">Enter your Application Number to check processing stage</div>
                        </div>
                    </div>
                )}

                {/* ── Apply Form (session-based, no OTP needed) ── */}
                {mode === 'apply' && appStep === 'form' && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                            <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>नया जल कनेक्शन आवेदन</span>
                            New Water Connection Application
                        </h2>
                        {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 17, padding: 20, marginBottom: 20 }}>{error}</div>}

                        {/* Session identity indicator — no mobile input */}
                        {sessionMobile ? (
                            <div style={{ background: '#e8f5e9', border: '1px solid #27ae60', padding: '12px 16px', borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Icon name="verified_user" size={22} color="#27ae60" />
                                <span style={{ fontSize: 16, color: '#2e7d32' }}>
                                    Application will be linked to mobile <strong>+91-XXXXXX{sessionMobile.slice(-4)}</strong>
                                </span>
                            </div>
                        ) : (
                            <div className="gov-alert gov-alert--error" style={{ marginBottom: 20 }}>Session not found. Please login from the main screen.</div>
                        )}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">आवेदक का नाम *</span>
                                Applicant Name *
                            </label>
                            <input className="kiosk-input" type="text" value={appName} onChange={e => setAppName(e.target.value)} placeholder="Enter full name" />
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">संपत्ति का पता *</span>
                                Property Address *
                            </label>
                            <textarea className="kiosk-input" style={{ height: 100, paddingTop: 12 }} value={appAddress} onChange={e => setAppAddress(e.target.value)} placeholder="Full address for this connection" />
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">कनेक्शन का प्रकार</span>
                                Connection Type
                            </label>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {CONNECTION_TYPES.map(t => (
                                    <button key={t}
                                        className={`kiosk-btn ${appType === t ? 'kiosk-btn--primary' : 'kiosk-btn--secondary'}`}
                                        style={{ flex: 1, minWidth: 140, height: 60 }}
                                        onClick={() => setAppType(t)}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <span className="kiosk-gov-btn-hi">रद्द करें</span> | CANCEL
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleSubmitApplication} disabled={loading || !sessionMobile}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'जमा हो रहा है...' : 'आवेदन जमा करें'}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>SUBMIT APPLICATION</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Application Success ── */}
                {mode === 'apply' && appStep === 'success' && result?.type === 'application' && (
                    <div className="kiosk-form kiosk-gov-card" style={{ textAlign: 'center' }}>
                        <Icon name="check_circle" size={100} color="var(--gov-green)" />
                        <h2 style={{ fontSize: 36, margin: '20px 0', color: 'var(--gov-green)' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block' }}>आवेदन सफल!</span>
                            Application Submitted!
                        </h2>
                        <p style={{ fontSize: 20, marginBottom: 20 }}>Your application has been received.</p>
                        <div style={{ background: '#f8f9fa', padding: 30, borderRadius: 15, marginBottom: 30, border: '2px solid #ddd' }}>
                            <div style={{ fontSize: 16, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Application Number / आवेदन संख्या</div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--gov-navy)', marginTop: 10 }}>{result.data?.applicationNo || result.data?.data?.applicationNo || 'N/A'}</div>
                            <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Please note this number for future reference. Processing takes 7–15 working days.</div>
                        </div>
                        <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={reset}>
                            <span className="kiosk-gov-btn-hi">समाप्त</span> | DONE
                        </button>
                    </div>
                )}

                {/* ── Application Status Check ── */}
                {mode === 'status' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                            <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>आवेदन स्थिति जाँच</span>
                            Check Application Status
                        </h2>
                        {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 17, padding: 20, marginBottom: 20 }}>{error}</div>}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">आवेदन संख्या</span>
                                Application Number (e.g. APP-XXXXXX)
                            </label>
                            <input className="kiosk-input" type="text" value={appNo}
                                onChange={e => setAppNo(e.target.value)} placeholder="APP-XXXXXXXX" />
                        </div>

                        {/* Forgot Application Number */}
                        {!myApplications && (
                            <button
                                className="kiosk-btn kiosk-btn--secondary"
                                style={{ width: '100%', marginBottom: 16, background: 'transparent', border: '1px dashed #aaa', color: 'var(--gov-navy)', height: 55 }}
                                onClick={handleForgotAppNo}
                                disabled={loadingApps || !sessionMobile}
                            >
                                <Icon name="help_outline" size={20} color="var(--gov-navy)" />
                                {loadingApps ? ' Retrieving...' : ' Forgot Application Number? Click to view all your applications'}
                            </button>
                        )}

                        {/* My Applications List */}
                        {myApplications && (
                            <div style={{ background: '#f0f4ff', border: '1px solid #aac', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: 'var(--gov-navy)' }}>
                                    <Icon name="list_alt" size={20} color="var(--gov-navy)" /> Your Applications for +91-XXXXXX{sessionMobile?.slice(-4)}
                                </div>
                                {myApplications.applications?.length > 0 ? (
                                    myApplications.applications.map((app, idx) => (
                                        <div key={idx} style={{ background: '#fff', border: '1px solid #dde', borderRadius: 8, padding: '12px 16px', marginBottom: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onClick={() => { setAppNo(app.applicationNo); setMyApplications(null); }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--gov-navy)', fontSize: 17 }}>{app.applicationNo}</div>
                                                <div style={{ fontSize: 13, color: '#666' }}>{app.connectionType} • {new Date(app.appliedOn).toLocaleDateString('en-IN')}</div>
                                            </div>
                                            <span className={`gov-badge gov-badge--${app.status === 'SUCCESS' ? 'success' : 'info'}`} style={{ fontSize: 13 }}>{app.status}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#666', fontSize: 15 }}>No applications found for this mobile number.</p>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <span className="kiosk-gov-btn-hi">वापस</span> | BACK
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleCheckStatus} disabled={loading}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'खोज रहे हैं...' : 'स्थिति जाँचें'}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>CHECK STATUS</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Status Result ── */}
                {result && result.type === 'status' && (
                    <div className="kiosk-card kiosk-gov-card">
                        <div className="kiosk-card__header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22 }}>
                            <span>आवेदन विवरण | Application Details</span>
                            <span className={`gov-badge gov-badge--${result.data.status === 'APPROVED' ? 'success' : 'info'}`} style={{ fontSize: 18, padding: '6px 16px' }}>{result.data.status}</span>
                        </div>
                        <div className="kiosk-card__body">
                            <table className="kiosk-result-table">
                                <tbody>
                                    <tr><td><span className="kiosk-gov-label-hi">आवेदन संख्या</span> Application No.</td><td><strong>{result.data.applicationNo}</strong></td></tr>
                                    <tr><td><span className="kiosk-gov-label-hi">आवेदक का नाम</span> Applicant</td><td>{result.data.applicantName}</td></tr>
                                    <tr><td><span className="kiosk-gov-label-hi">कनेक्शन प्रकार</span> Type</td><td>{result.data.connectionType}</td></tr>
                                    <tr><td><span className="kiosk-gov-label-hi">पता</span> Address</td><td>{result.data.address}</td></tr>
                                    <tr><td><span className="kiosk-gov-label-hi">टिप्पणी</span> Remarks</td><td>{result.data.remarks || 'Under processing'}</td></tr>
                                </tbody>
                            </table>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', marginTop: 30 }} onClick={reset}>
                                <span className="kiosk-gov-btn-hi">मुख्य मेनू पर वापस जाएं</span> | BACK TO MENU
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60 }} onClick={() => navigate('/water')}>
                        <Icon name="home" size={24} color="#fff" /> EXIT | बाहर निकलें
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
