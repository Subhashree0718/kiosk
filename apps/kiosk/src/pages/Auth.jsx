import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';
import { useKioskStore } from '../store/index.js';

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
        e.preventDefault();
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            setError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }
        setError(''); setLoading(true);
        try {
            await api.post('/auth/send-otp', { mobile });
            setInfo('OTP sent to your registered mobile number.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally { setLoading(false); }
    }

    async function verifyOtp(e) {
        e.preventDefault();
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

    return (
        <GovLayout breadcrumbs={['Citizen Login']}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <div className="gov-card">
                    <div className="gov-card__header">
                        🔐 Citizen Login – OTP Authentication
                    </div>
                    <div className="gov-card__body">
                        {/* Progress indicator */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20, fontSize: 12 }}>
                            <div style={{
                                flex: 1, padding: '6px', textAlign: 'center', borderRadius: 2,
                                background: step >= 1 ? 'var(--gov-navy)' : '#e0e0e0',
                                color: step >= 1 ? '#fff' : '#555'
                            }}>Step 1: Mobile Number</div>
                            <div style={{
                                flex: 1, padding: '6px', textAlign: 'center', borderRadius: 2,
                                background: step >= 2 ? 'var(--gov-navy)' : '#e0e0e0',
                                color: step >= 2 ? '#fff' : '#555'
                            }}>Step 2: Verify OTP</div>
                        </div>

                        {error && (
                            <div className="gov-alert gov-alert--error mb-2">⚠ {error}</div>
                        )}
                        {info && (
                            <div className="gov-alert gov-alert--success mb-2">✅ {info}</div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={sendOtp}>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">
                                        Mobile Number <span className="gov-form-group__req">*</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span style={{
                                            padding: '9px 12px', border: '1.5px solid var(--gov-input-border)',
                                            borderRight: 'none', background: '#f0f4f8', borderRadius: '4px 0 0 4px',
                                            fontSize: 14, fontWeight: 600, color: 'var(--gov-navy)'
                                        }}>+91</span>
                                        <input
                                            className="gov-form-group__field"
                                            style={{ borderRadius: '0 4px 4px 0', flex: 1 }}
                                            type="tel" inputMode="numeric" maxLength={10}
                                            placeholder="10-digit mobile number"
                                            value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/, ''))}
                                            required
                                        />
                                    </div>
                                    <span style={{ fontSize: 11.5, color: 'var(--gov-text-muted)' }}>
                                        Registered with Aadhaar / Kiosk system
                                    </span>
                                </div>
                                <button className="gov-btn gov-btn--primary gov-btn--full gov-btn--lg" type="submit" disabled={loading}>
                                    {loading ? 'Sending OTP…' : 'Send OTP →'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={verifyOtp}>
                                <p style={{ fontSize: 13, marginBottom: 14 }}>
                                    An OTP has been sent to <strong>+91-XXXXXX{mobile.slice(-4)}</strong>
                                </p>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">
                                        Enter OTP <span className="gov-form-group__req">*</span>
                                    </label>
                                    <input
                                        className="gov-form-group__field gov-otp-input"
                                        type="text" inputMode="numeric" maxLength={6}
                                        placeholder="● ● ● ● ● ●"
                                        value={otp} onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                                        required autoFocus
                                    />
                                    <span style={{ fontSize: 11.5, color: 'var(--gov-text-muted)' }}>
                                        Valid for 5 minutes. Do not share with anyone.
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="gov-btn gov-btn--outline" type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}>
                                        ← Back
                                    </button>
                                    <button className="gov-btn gov-btn--primary gov-btn--full" type="submit" disabled={loading}>
                                        {loading ? 'Verifying…' : 'Verify & Login →'}
                                    </button>
                                </div>
                                <div className="mt-2 text-center" style={{ fontSize: 12 }}>
                                    Did not receive OTP?{' '}
                                    <button className="gov-btn gov-btn--sm gov-btn--outline" type="button"
                                        onClick={() => { setStep(1); setOtp(''); setInfo(''); setError(''); }}>
                                        Resend
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="gov-card__footer" style={{ fontSize: 11.5, color: 'var(--gov-text-muted)' }}>
                        🔒 This service uses OTP-based authentication. Your data is secure.
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
