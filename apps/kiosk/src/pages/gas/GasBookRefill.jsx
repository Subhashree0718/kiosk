import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#117a65';

export default function GasBookRefill() {
    const navigate = useNavigate();
    const { t } = useT();
    const [form, setForm] = useState({ lpgId: '', mobile: '', cylinderType: '14.2', deliveryDate: '', address: '', paymentMode: 'upi' });
    const [booked, setBooked] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setBooked(true);
    };

    if (booked) {
        return (
            <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Book Gas Refill', 'गैस रिफिल बुक करें')]}>
                <div className="kiosk-gov-strip"></div>
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Icon name="check_circle" size={64} color="#27ae60" />
                    </div>
                    <h2 style={{ fontSize: 32, color: 'var(--gov-navy)', marginBottom: 12 }}>{t('Refill Booked Successfully!', 'रिफिल सफलतापूर्वक बुक हो गई!')}</h2>
                    <p style={{ fontSize: 18, color: '#666', marginBottom: 8 }}>{t('Booking Reference:', 'बुकिंग संदर्भ:')} <strong style={{ color: COLOR }}>GAS-2026-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong></p>
                    <p style={{ fontSize: 16, color: '#888' }}>{t('Expected delivery within 3-5 business days', '3-5 कार्य दिवसों में डिलीवरी अपेक्षित')}</p>
                    <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center', gap: 20 }}>
                        <button className="kiosk-btn kiosk-btn--primary" style={{ height: 60, padding: '0 40px' }} onClick={() => navigate('/gas/track-refill')}>
                            <Icon name="track_changes" size={20} color="#fff" style={{ marginRight: 8 }} />{t('TRACK STATUS', 'स्थिति ट्रैक करें')}
                        </button>
                        <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60, padding: '0 40px' }} onClick={() => navigate('/gas')}>
                            {t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                        </button>
                    </div>
                </div>
            </GovLayout>
        );
    }

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Book Gas Refill', 'गैस रिफिल बुक करें')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">गैस रिफिल बुक करें</div>
                    <div className="kiosk-gov-text-en">Book Gas Refill</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('Order LPG cylinder refill', 'एलपीजी सिलेंडर रिफिल ऑर्डर करें')}</div>
                </div>
            </div>

            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('Book Cylinder Refill', 'सिलेंडर रिफिल बुक करें')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Fill in the details below to order your LPG refill', 'अपनी एलपीजी रिफिल ऑर्डर करने के लिए नीचे विवरण भरें')}</p>
                </div>

                <div className="gov-card" style={{ maxWidth: 720, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="local_shipping" size={18} color="#fff" style={{ marginRight: 8 }} />
                        {t('Refill Order Form', 'रिफिल ऑर्डर फॉर्म')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                        {t('LPG ID', 'एलपीजी आईडी')} <span style={{ color: '#c0392b' }}>*</span>
                                    </label>
                                    <input type="text" value={form.lpgId} onChange={e => set('lpgId', e.target.value)} placeholder={t('17-digit LPG ID', '17 अंकों की एलपीजी आईडी')} required
                                        style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                        {t('Registered Mobile', 'पंजीकृत मोबाइल')} <span style={{ color: '#c0392b' }}>*</span>
                                    </label>
                                    <input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder={t('10-digit mobile', '10 अंकों का मोबाइल')} maxLength={10} required
                                        style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                        {t('Cylinder Type', 'सिलेंडर प्रकार')} <span style={{ color: '#c0392b' }}>*</span>
                                    </label>
                                    <select value={form.cylinderType} onChange={e => set('cylinderType', e.target.value)}
                                        style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none', background: '#fff' }}>
                                        <option value="14.2">{t('14.2 Kg (Regular)', '14.2 किलो (नियमित)')}</option>
                                        <option value="5">{t('5 Kg (FTL)', '5 किलो (एफटीएल)')}</option>
                                        <option value="19">{t('19 Kg (Commercial)', '19 किलो (वाणिज्यिक)')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                        {t('Preferred Delivery Date', 'पसंदीदा डिलीवरी तिथि')}
                                    </label>
                                    <input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)}
                                        style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                    {t('Delivery Address', 'डिलीवरी पता')} <span style={{ color: '#c0392b' }}>*</span>
                                </label>
                                <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={3}
                                    placeholder={t('Enter delivery address', 'डिलीवरी पता दर्ज करें')} required
                                    style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none', resize: 'vertical' }} />
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                    {t('Payment Mode', 'भुगतान मोड')} <span style={{ color: '#c0392b' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                    {[
                                        { value: 'upi', label: 'UPI', icon: 'qr_code' },
                                        { value: 'card', label: t('Debit/Credit Card', 'डेबिट/क्रेडिट कार्ड'), icon: 'credit_card' },
                                        { value: 'netbanking', label: t('Net Banking', 'नेट बैंकिंग'), icon: 'account_balance' },
                                        { value: 'cod', label: t('Cash on Delivery', 'कैश ऑन डिलीवरी'), icon: 'payments' },
                                    ].map(pm => (
                                        <label key={pm.value} style={{
                                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                                            border: form.paymentMode === pm.value ? `2px solid ${COLOR}` : '2px solid #ddd',
                                            borderRadius: 10, cursor: 'pointer',
                                            background: form.paymentMode === pm.value ? COLOR + '10' : '#fff',
                                            transition: 'all 0.2s',
                                        }}>
                                            <input type="radio" name="paymentMode" value={pm.value} checked={form.paymentMode === pm.value}
                                                onChange={() => set('paymentMode', pm.value)} style={{ display: 'none' }} />
                                            <Icon name={pm.icon} size={20} color={form.paymentMode === pm.value ? COLOR : '#888'} />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: form.paymentMode === pm.value ? COLOR : '#555' }}>{pm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 60, fontSize: 18, marginTop: 28 }}>
                                <Icon name="local_shipping" size={22} color="#fff" style={{ marginRight: 8 }} />
                                {t('BOOK REFILL', 'रिफिल बुक करें')}
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 70, padding: '0 50px' }} onClick={() => navigate('/gas')}>
                        <Icon name="arrow_back" size={26} color="#fff" />&nbsp;&nbsp;{t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
