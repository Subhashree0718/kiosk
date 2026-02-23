import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api.js';
import { useAdminStore } from '../store/index.js';

export default function Login() {
    const navigate = useNavigate();
    const { setAuth } = useAdminStore();
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('mobile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSendOtp() {
        if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Valid mobile number required.'); return; }
        setLoading(true); setError('');
        try {
            await fetch('/api/v1/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile }) });
            setStep('otp');
        } catch { setError('Failed to send OTP.'); }
        finally { setLoading(false); }
    }

    async function handleVerify() {
        setLoading(true); setError('');
        try {
            const res = await adminLogin(mobile, otp);
            const { user, token } = res.data;
            if (!['ADMIN', 'OFFICER', 'SUPERVISOR'].includes(user.role)) {
                setError('Access denied. Admin credentials required.'); return;
            }
            setAuth(user, token);
            navigate('/');
        } catch (e) { setError(e.response?.data?.message || 'Invalid OTP.'); }
        finally { setLoading(false); }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--gov-body-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--gov-font)', position: 'relative' }}>
            <div className="kiosk-gov-strip" style={{ position: 'absolute', top: 0, height: 12 }}></div>

            <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 450, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #d0d7de' }}>
                <div style={{ background: 'var(--gov-navy)', padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '6px solid var(--gov-saffron)' }}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                        alt="Emblem"
                        style={{ height: 80, filter: 'brightness(0) invert(1)', marginBottom: '1rem' }}
                    />
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.05em' }}>सुविधा एडमिन</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 600 }}>SUVIDHA ADMIN PORTAL</div>
                </div>

                <div style={{ padding: '2rem' }}>
                    {step === 'mobile' ? (
                        <>
                            <label style={{ fontWeight: 600, fontSize: '.88rem', display: 'block', marginBottom: '.5rem' }}>Mobile Number</label>
                            <input type="tel" maxLength={10} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                                placeholder="10-digit number" className="suvi-input-group__field" style={{ width: '100%', marginBottom: '1rem' }}
                                onKeyDown={e => e.key === 'Enter' && handleSendOtp()} autoFocus />
                            <button className="suvi-btn suvi-btn--primary" style={{ width: '100%', padding: '.85rem', fontSize: '1rem' }} onClick={handleSendOtp} disabled={loading}>
                                {loading ? 'Sending…' : 'Send OTP →'}
                            </button>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: '.88rem', color: '#6b7280', marginBottom: '1rem' }}>OTP sent to <strong>+91 {mobile}</strong></p>
                            <label style={{ fontWeight: 600, fontSize: '.88rem', display: 'block', marginBottom: '.5rem' }}>Enter OTP</label>
                            <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="6-digit OTP" className="suvi-input-group__field"
                                style={{ width: '100%', marginBottom: '1rem', letterSpacing: '.3em', fontSize: '1.4rem', textAlign: 'center' }}
                                onKeyDown={e => e.key === 'Enter' && handleVerify()} autoFocus />
                            <button className="suvi-btn suvi-btn--primary" style={{ width: '100%', padding: '.85rem', fontSize: '1rem' }} onClick={handleVerify} disabled={loading}>
                                {loading ? 'Verifying…' : 'Login'}
                            </button>
                        </>
                    )}
                    {error && <p style={{ color: '#e02424', fontSize: '.85rem', marginTop: '.75rem', textAlign: 'center' }}>⚠ {error}</p>}
                </div>
            </div>
        </div>
    );
}
