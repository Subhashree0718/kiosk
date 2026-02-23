import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';
import { useKioskStore } from '../store/index.js';

const NUM_PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'];

export default function Auth() {
    const navigate = useNavigate();
    const setAuth = useKioskStore(s => s.setAuth);
    const [step, setStep] = useState(1); // 1=mobile, 2=otp
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    async function sendOtp(e) {
        if (e) e.preventDefault();
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            setError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }
        setError(''); setLoading(true);
        try {
            await api.post('/auth/send-otp', { mobile });
            setInfo('OTP sent to ' + mobile);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally { setLoading(false); }
    }

    async function verifyOtp(e) {
        if (e) e.preventDefault();
        if (!/^\d{6}$/.test(otp)) { setError('OTP must be 6 digits.'); return; }
        setError(''); setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-otp', { mobile, code: otp });
            setAuth(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally { setLoading(false); }
    }

    function handleNumPad(val) {
        setError('');
        const currentField = step === 1 ? mobile : otp;
        const maxLen = step === 1 ? 10 : 6;
        const setter = step === 1 ? setMobile : setOtp;

        if (val === 'CLR') setter('');
        else if (val === 'DEL') setter(currentField.slice(0, -1));
        else if (currentField.length < maxLen) setter(currentField + val);
    }

    return (
        <GovLayout breadcrumbs={[]} showSidebar={false}>
            <div className="kiosk-gradient-patriotic" style={{ minHeight: 'calc(100vh - 200px)', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* 1. ELITE SECURITY HEADER */}
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <div style={{ background: '#fff', padding: '15px 30px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: 20 }}>
                        <span className="material-icons" style={{ fontSize: 32, color: 'var(--gov-navy)' }}>lock</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Secure Authentication</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--gov-navy)' }}>SUVIDHA Portal Access</div>
                        </div>
                    </div>
                    <h1 className="kiosk-text-display" style={{ fontSize: 42, color: 'var(--gov-navy)', margin: 0 }}>
                        {step === 1 ? 'Enter Mobile Number' : 'Verify Identity'}
                    </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '500px 420px', gap: 40, alignItems: 'start' }}>

                    {/* LEFT PANEL: INPUT & INFO */}
                    <div className="kiosk-glass" style={{ padding: 50, borderRadius: 40, border: '2px solid rgba(255,255,255,0.6)' }}>

                        {error && (
                            <div style={{ background: '#fee2e2', borderLeft: '8px solid #ef4444', padding: '20px', borderRadius: 16, color: '#991b1b', fontSize: 18, fontWeight: 700, marginBottom: 30, display: 'flex', gap: 12 }}>
                                <span className="material-icons">report</span>
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <div>
                                <label className="kiosk-gov-label-hi" style={{ fontSize: 22, color: '#64748b' }}>मोबाइल नंबर दर्ज करें</label>
                                <div style={{ display: 'flex', gap: 15, background: '#fff', padding: 15, borderRadius: 24, border: '3px solid var(--gov-navy)', alignItems: 'center', marginBottom: 20 }}>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--gov-navy)', paddingRight: 15, borderRight: '2px solid #e2e8f0' }}>+91</div>
                                    <input
                                        className="kiosk-input-elite"
                                        style={{ flex: 1, border: 'none', fontSize: 44, fontWeight: 900, color: 'var(--gov-navy)', background: 'transparent', letterSpacing: 4, width: '100%' }}
                                        value={mobile} readOnly placeholder="00000 00000"
                                    />
                                </div>
                                <p style={{ fontSize: 18, color: '#64748b', fontWeight: 600 }}>We will send an OTP for verification. / हम सत्यापन के लिए एक ओटीपी भेजेंगे।</p>

                                <button className="kiosk-btn-premium" style={{ width: '100%', background: 'var(--gov-navy)', color: '#fff', marginTop: 40, height: 90 }} onClick={sendOtp} disabled={loading || mobile.length < 10}>
                                    {loading ? 'SENDING...' : 'SEND OTP'}
                                    <span className="material-icons" style={{ fontSize: 32 }}>arrow_forward</span>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="kiosk-gov-label-hi" style={{ fontSize: 22, color: '#64748b' }}>ओटीपी दर्ज करें</label>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 30 }}>
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <div key={i} style={{
                                            width: 65, height: 85, border: `3px solid ${otp.length > i ? 'var(--gov-navy)' : '#e2e8f0'}`,
                                            borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 36, fontWeight: 900, color: 'var(--gov-navy)',
                                            boxShadow: otp.length === i ? '0 0 0 4px rgba(0,51,102,0.1)' : 'none'
                                        }}>
                                            {otp[i] || ''}
                                        </div>
                                    ))}
                                </div>
                                <p style={{ textAlign: 'center', fontSize: 18, color: '#64748b' }}>Sent to <strong>+91-XXXXXX{mobile.slice(-4)}</strong></p>

                                <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                                    <button className="kiosk-btn-premium" style={{ flex: 1, background: '#f1f5f9', color: 'var(--gov-navy)', height: 90 }} onClick={() => { setStep(1); setOtp(''); }}>
                                        BACK
                                    </button>
                                    <button className="kiosk-btn-premium" style={{ flex: 2, background: 'var(--gov-saffron)', color: '#fff', height: 90 }} onClick={verifyOtp} disabled={loading || otp.length < 6}>
                                        {loading ? 'VERIFYING...' : 'LOGIN NOW'}
                                        <span className="material-icons" style={{ fontSize: 32 }}>verified</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 40, padding: '20px', background: 'rgba(0,0,0,0.03)', borderRadius: 20, display: 'flex', gap: 15, alignItems: 'center' }}>
                            <span className="material-icons" style={{ color: '#16a34a' }}>privacy_tip</span>
                            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>This session is protected with 256-bit encryption. Do not disclose OTP to anyone.</div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: NUMERIC PAD */}
                    <div className="kiosk-glass" style={{ padding: 40, borderRadius: 40, border: '2px solid rgba(255,255,255,0.6)' }}>
                        <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
                            {NUM_PAD.map(val => (
                                <button
                                    key={val}
                                    className="kiosk-btn-premium"
                                    style={{
                                        height: 90, padding: 0, borderRadius: 25,
                                        background: val === 'CLR' || val === 'DEL' ? '#fee2e2' : '#fff',
                                        color: val === 'CLR' || val === 'DEL' ? '#dc2626' : 'var(--gov-navy)',
                                        fontSize: val === 'CLR' || val === 'DEL' ? 20 : 32,
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                                    }}
                                    onClick={() => handleNumPad(val)}
                                >
                                    {val === 'DEL' ? <span className="material-icons" style={{ fontSize: 32 }}>backspace</span> : val}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* LOGOS STRIP */}
                <div style={{ marginTop: 'auto', paddingTop: 60, display: 'flex', gap: 60, opacity: 0.6, grayscale: 1 }}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png" alt="Digital India" style={{ height: 60 }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem" style={{ height: 70 }} />
                </div>
            </div>
        </GovLayout>
    );
}
