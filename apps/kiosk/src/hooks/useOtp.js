import { useState, useCallback } from 'react';
import { sendOtp as sendOtpApi, verifyOtp as verifyOtpApi } from '../services/api.js';
import { useKioskStore } from '../store/index.js';

export function useOtp() {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setAuth } = useKioskStore();

    const sendOtp = useCallback(async () => {
        if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number.'); return; }
        setLoading(true); setError('');
        try {
            await sendOtpApi(mobile);
            setStep('otp');
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to send OTP.');
        } finally { setLoading(false); }
    }, [mobile]);

    const verifyOtp = useCallback(async () => {
        if (!/^\d{6}$/.test(otp)) { setError('Enter a valid 6-digit OTP.'); return; }
        setLoading(true); setError('');
        try {
            const res = await verifyOtpApi(mobile, otp);
            setAuth(res.data.user, res.data.token);
        } catch (e) {
            setError(e.response?.data?.message || 'Invalid OTP.');
        } finally { setLoading(false); }
    }, [mobile, otp]);

    return { mobile, setMobile, otp, setOtp, step, loading, error, sendOtp, verifyOtp };
}
