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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111928 0%, #1e3a8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
                <div style={{ background: 'linear-gradient(90deg,#1a56db,#7e3af2)', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🏛️</div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>SUVIDHA Admin</div>
                    <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.82rem', marginTop: '.25rem' }}>Authorized Access Only</div>
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
