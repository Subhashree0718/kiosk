import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#6c3483';

const STEPS = [
    { key: 'booked', label: 'Booked', labelHi: 'बुक किया गया', icon: 'shopping_cart' },
    { key: 'confirmed', label: 'Confirmed', labelHi: 'पुष्टि हुई', icon: 'check_circle' },
    { key: 'dispatched', label: 'Out for Delivery', labelHi: 'डिलीवरी के लिए निकला', icon: 'local_shipping' },
    { key: 'delivered', label: 'Delivered', labelHi: 'डिलीवर किया गया', icon: 'done_all' },
];

export default function GasTrackRefill() {
    const navigate = useNavigate();
    const { t } = useT();
    const [searchId, setSearchId] = useState('');
    const [tracked, setTracked] = useState(false);
    const currentStep = 2; // demo: "Out for Delivery"

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId) setTracked(true);
    };

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Track Refill', 'रिफिल ट्रैक करें')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">रिफिल स्थिति ट्रैक करें</div>
                    <div className="kiosk-gov-text-en">Track Refill Status</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('Check your LPG delivery status', 'अपनी एलपीजी डिलीवरी स्थिति जांचें')}</div>
                </div>
            </div>

            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('Track Delivery', 'डिलीवरी ट्रैक करें')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Enter your Booking Reference or LPG ID', 'अपना बुकिंग संदर्भ या एलपीजी आईडी दर्ज करें')}</p>
                </div>

                <div className="gov-card" style={{ maxWidth: 700, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
                        {t('Search Order', 'ऑर्डर खोजें')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16 }}>
                            <input
                                type="text"
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                                placeholder={t('Booking Reference No. or LPG ID', 'बुकिंग संदर्भ सं. या एलपीजी आईडी')}
                                required
                                style={{ flex: 1, padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' }}
                            />
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ height: 52, padding: '0 32px', fontSize: 16 }}>
                                <Icon name="search" size={20} color="#fff" style={{ marginRight: 6 }} />
                                {t('TRACK', 'ट्रैक')}
                            </button>
                        </form>
                    </div>
                </div>

                {tracked && (
                    <div className="gov-card" style={{ maxWidth: 700, margin: '24px auto 0' }}>
                        <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                            <Icon name="track_changes" size={18} color="#fff" style={{ marginRight: 8 }} />
                            {t('Delivery Timeline', 'डिलीवरी टाइमलाइन')}
                        </div>
                        <div className="gov-card__body" style={{ padding: 32 }}>
                            {/* Order summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32, padding: 20, background: '#f8f9fa', borderRadius: 12 }}>
                                <div><span style={{ fontSize: 13, color: '#888' }}>{t('Booking Ref', 'बुकिंग संदर्भ')}</span><div style={{ fontWeight: 700, color: 'var(--gov-navy)', fontSize: 16 }}>{searchId}</div></div>
                                <div><span style={{ fontSize: 13, color: '#888' }}>{t('Cylinder Type', 'सिलेंडर प्रकार')}</span><div style={{ fontWeight: 700, color: 'var(--gov-navy)', fontSize: 16 }}>14.2 Kg</div></div>
                                <div><span style={{ fontSize: 13, color: '#888' }}>{t('Booked On', 'बुक किया')}</span><div style={{ fontWeight: 700, color: 'var(--gov-navy)', fontSize: 16 }}>28 Feb 2026</div></div>
                                <div><span style={{ fontSize: 13, color: '#888' }}>{t('Expected Delivery', 'अपेक्षित डिलीवरी')}</span><div style={{ fontWeight: 700, color: COLOR, fontSize: 16 }}>3 Mar 2026</div></div>
                            </div>

                            {/* Timeline */}
                            <div style={{ position: 'relative', paddingLeft: 40 }}>
                                {STEPS.map((step, i) => {
                                    const done = i <= currentStep;
                                    const active = i === currentStep;
                                    return (
                                        <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: i < STEPS.length - 1 ? 0 : 0, position: 'relative', paddingBottom: i < STEPS.length - 1 ? 36 : 0 }}>
                                            {/* Vertical line */}
                                            {i < STEPS.length - 1 && (
                                                <div style={{ position: 'absolute', left: -20, top: 40, width: 3, height: 'calc(100% - 20px)', background: done ? COLOR : '#ddd', borderRadius: 2 }} />
                                            )}
                                            {/* Circle */}
                                            <div style={{
                                                position: 'absolute', left: -30,
                                                width: 24, height: 24, borderRadius: '50%',
                                                background: done ? COLOR : '#ddd',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: active ? `3px solid ${COLOR}50` : 'none',
                                                boxShadow: active ? `0 0 0 6px ${COLOR}20` : 'none',
                                            }}>
                                                {done && <Icon name="check" size={14} color="#fff" />}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: 12,
                                                    background: done ? COLOR + '15' : '#f5f5f5',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <Icon name={step.icon} size={24} color={done ? COLOR : '#bbb'} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 17, fontWeight: 700, color: done ? 'var(--gov-navy)' : '#bbb' }}>
                                                        {t(step.label, step.labelHi)}
                                                        {active && <span style={{ background: COLOR, color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 4, marginLeft: 10, fontWeight: 700 }}>{t('CURRENT', 'वर्तमान')}</span>}
                                                    </div>
                                                    {done && <div style={{ fontSize: 13, color: '#888' }}>{i <= 1 ? '28 Feb 2026, 10:30 AM' : i === 2 ? '1 Mar 2026, 09:15 AM' : 'Pending'}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 70, padding: '0 50px' }} onClick={() => navigate('/gas')}>
                        <Icon name="arrow_back" size={26} color="#fff" />&nbsp;&nbsp;{t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
