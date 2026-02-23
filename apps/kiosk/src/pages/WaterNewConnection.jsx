import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { wSendOtp, wVerifyOtp, wLogin, wGetConnectionStatus } from '../services/waterApi.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

export default function WaterNewConnection() {
    const navigate = useNavigate();
    const [mode, setMode] = useState(null); // 'login' | 'status'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Form inputs
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [appNo, setAppNo] = useState('');

    const handleSendOtp = async () => {
        if (!/^\d{10}$/.test(mobile)) { setError('Enter 10-digit mobile number | 10 अंकों का मोबाइल नंबर दर्ज करें'); return; }
        setLoading(true); setError('');
        try {
            await wSendOtp(mobile);
            setOtpSent(true);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleLogin = async () => {
        setLoading(true); setError('');
        try {
            await wLogin({ mobile, otp });
            setResult({ type: 'success', msg: 'Welcome! You can now start your application at Counter #1. | स्वागत है! अब आप काउंटर नंबर 1 पर अपना आवेदन शुरू कर सकते हैं।' });
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleCheckStatus = async () => {
        if (!appNo) { setError('Enter Application Number | आवेदन संख्या दर्ज करें'); return; }
        setLoading(true); setError('');
        try {
            const { data } = await wGetConnectionStatus(appNo);
            setResult({ type: 'status', data: data.data || data });
        } catch (err) { setError('Application not found | आवेदन नहीं मिला'); }
        finally { setLoading(false); }
    };

    const reset = () => {
        setMode(null);
        setResult(null);
        setMobile('');
        setOtp('');
        setOtpSent(false);
        setAppNo('');
        setError('');
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

                {!mode && (
                    <div className="kiosk-grid" style={{ marginTop: 40 }}>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid var(--gov-navy)' }} onClick={() => setMode('login')}>
                            <Icon name="login" size={80} color="var(--gov-navy)" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">लॉगिन / पंजीकरण</span>
                                Login / Register
                            </div>
                            <div className="kiosk-tile__desc">Existing applicants or new users start here.</div>
                        </div>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid #27ae60' }} onClick={() => setMode('status')}>
                            <Icon name="assignment" size={80} color="#27ae60" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">आवेदन की स्थिति</span>
                                Track Status
                            </div>
                            <div className="kiosk-tile__desc">Enter App No. to view your current application stage.</div>
                        </div>
                    </div>
                )}

                {mode === 'login' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                            <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>आवेदक लॉगिन</span>
                            Applicant Login
                        </h2>
                        {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20 }}>{error}</div>}

                        {!otpSent ? (
                            <>
                                <div className="kiosk-input-group">
                                    <label className="kiosk-label">
                                        <span className="kiosk-gov-label-hi">पंजीकृत मोबाइल नंबर</span>
                                        Register Mobile Number
                                    </label>
                                    <input className="kiosk-input" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter 10-digit number" />
                                </div>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                        <span className="kiosk-gov-btn-hi">रद्द करें</span> | CANCEL
                                    </button>
                                    <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleSendOtp} disabled={loading}>
                                        <span className="kiosk-gov-btn-hi">{loading ? 'भेज रहे हैं...' : 'ओटीपी भेजें'}</span> | SEND OTP
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="kiosk-label" style={{ textAlign: 'center' }}>
                                    <span className="kiosk-gov-label-hi">ओटीपी दर्ज करें (नंबर {mobile} पर भेजा गया)</span>
                                    Enter OTP sent to {mobile}
                                </label>
                                <div className="kiosk-otp-container">
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <input key={i} className="kiosk-otp-box" type="text" maxLength={1} value={otp[i] || ''} onChange={e => {
                                            const newOtp = otp.split('');
                                            newOtp[i] = e.target.value;
                                            setOtp(newOtp.join(''));
                                        }} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => setOtpSent(false)}>
                                        <span className="kiosk-gov-btn-hi">वापस</span> | BACK
                                    </button>
                                    <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleLogin} disabled={loading}>
                                        <span className="kiosk-gov-btn-hi">{loading ? 'सत्यापित कर रहे हैं...' : 'लॉगिन करें'}</span> | LOGIN
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {mode === 'status' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                            <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>आवेदन ट्रैक करें</span>
                            Track Application
                        </h2>
                        {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20 }}>{error}</div>}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">आवेदन संख्या</span>
                                Application Number
                            </label>
                            <input className="kiosk-input" type="text" value={appNo} onChange={e => setAppNo(e.target.value)} placeholder="e.g. APP-LMT5X-XXXX" />
                        </div>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <span className="kiosk-gov-btn-hi">वापस</span>
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleCheckStatus} disabled={loading}>
                                <span className="kiosk-gov-btn-hi">{loading ? 'जाँच रहे हैं...' : 'स्थिति देखें'}</span> | CHECK STATUS
                            </button>
                        </div>
                    </div>
                )}

                {result && result.type === 'success' && (
                    <div className="kiosk-form kiosk-gov-card" style={{ textAlign: 'center' }}>
                        <Icon name="check_circle" size={100} color="var(--gov-green)" />
                        <h2 style={{ fontSize: 32, margin: '20px 0', color: 'var(--gov-green)' }}>
                            <span className="kiosk-gov-label-hi" style={{ fontSize: 36 }}>सफलतापूर्वक लॉगिन!</span>
                            Logged In!
                        </h2>
                        <p style={{ fontSize: 20, marginBottom: 30 }}>{result.msg}</p>
                        <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={reset}>
                            <span className="kiosk-gov-btn-hi">पूर्ण</span> | DONE
                        </button>
                    </div>
                )}

                {result && result.type === 'status' && (
                    <div className="kiosk-card kiosk-gov-card">
                        <div className="kiosk-card__header">
                            <span>आवेदन विवरण | Application Details</span>
                            <span style={{ float: 'right' }}>{result.data.applicationNo}</span>
                        </div>
                        <div className="kiosk-card__body">
                            <table className="kiosk-result-table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">वर्तमान स्थिति</span>
                                            Current Status
                                        </td>
                                        <td><span className="gov-badge gov-badge--success" style={{ fontSize: 20, padding: '5px 15px' }}>{result.data.status}</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">आवेदक का नाम</span>
                                            Applicant Name
                                        </td>
                                        <td>{result.data.applicantName}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">मोबाइल नंबर</span>
                                            Mobile No.
                                        </td>
                                        <td>{result.data.mobile}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">दिनांक</span>
                                            Submitted On
                                        </td>
                                        <td>{new Date(result.data.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', marginTop: 30 }} onClick={reset}>
                                <span className="kiosk-gov-btn-hi">वापस जाएं</span> | BACK TO MENU
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60 }} onClick={() => navigate('/water')}>
                        <Icon name="home" size={24} color="#fff" /> EXIT BOARD | बाहर निकलें
                    </button>
                </div>

            </div>
        </GovLayout>
    );
}
