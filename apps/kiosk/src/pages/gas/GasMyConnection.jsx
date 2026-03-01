import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#1a5276';

export default function GasMyConnection() {
    const navigate = useNavigate();
    const { t } = useT();
    const [lpgId, setLpgId] = useState('');
    const [mobile, setMobile] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (lpgId && mobile) setSubmitted(true);
    };

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('My Gas Connection', 'मेरा गैस कनेक्शन')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">मेरा गैस कनेक्शन</div>
                    <div className="kiosk-gov-text-en">My Gas Connection</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('View your LPG connection details', 'अपने एलपीजी कनेक्शन विवरण देखें')}</div>
                </div>
            </div>

            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('Connection Details', 'कनेक्शन विवरण')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Enter your LPG ID to view connection information', 'कनेक्शन जानकारी देखने के लिए अपना एलपीजी आईडी दर्ज करें')}</p>
                </div>

                <div className="gov-card" style={{ maxWidth: 700, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
                        {t('Search Connection', 'कनेक्शन खोजें')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={handleSearch}>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                    {t('LPG ID / Consumer Number', 'एलपीजी आईडी / उपभोक्ता संख्या')} <span style={{ color: '#c0392b' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lpgId}
                                    onChange={e => setLpgId(e.target.value)}
                                    placeholder={t('Enter 17-digit LPG ID', '17 अंकों की एलपीजी आईडी दर्ज करें')}
                                    style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 }}>
                                    {t('Registered Mobile Number', 'पंजीकृत मोबाइल नंबर')} <span style={{ color: '#c0392b' }}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value)}
                                    placeholder={t('Enter 10-digit mobile number', '10 अंकों का मोबाइल नंबर दर्ज करें')}
                                    maxLength={10}
                                    style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' }}
                                    required
                                />
                            </div>
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 60, fontSize: 18 }}>
                                <Icon name="search" size={22} color="#fff" style={{ marginRight: 8 }} />
                                {t('SEARCH CONNECTION', 'कनेक्शन खोजें')}
                            </button>
                        </form>
                    </div>
                </div>

                {submitted && (
                    <div className="gov-card" style={{ maxWidth: 700, margin: '24px auto 0' }}>
                        <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                            <Icon name="local_fire_department" size={18} color="#fff" style={{ marginRight: 8 }} />
                            {t('Connection Information', 'कनेक्शन जानकारी')}
                        </div>
                        <div className="gov-card__body" style={{ padding: 28 }}>
                            {[
                                { label: t('Consumer Name', 'उपभोक्ता नाम'), value: 'Rajesh Kumar', icon: 'person' },
                                { label: t('LPG ID', 'एलपीजी आईडी'), value: lpgId || 'N/A', icon: 'badge' },
                                { label: t('Distributor Name', 'वितरक का नाम'), value: 'HP Gas Agency, Sector 22', icon: 'store' },
                                { label: t('Connection Type', 'कनेक्शन प्रकार'), value: t('Domestic (DBTL)', 'घरेलू (डीबीटीएल)'), icon: 'home' },
                                { label: t('Cylinder Type', 'सिलेंडर प्रकार'), value: '14.2 Kg', icon: 'propane_tank' },
                                { label: t('Last Refill Date', 'अंतिम रिफिल तिथि'), value: '15 Feb 2026', icon: 'calendar_today' },
                                { label: t('Subsidy Status', 'सब्सिडी स्थिति'), value: t('Active (PAHAL)', 'सक्रिय (पहल)'), icon: 'verified' },
                                { label: t('Registered Mobile', 'पंजीकृत मोबाइल'), value: `+91-XXXXXX${mobile.slice(-4)}`, icon: 'phone' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 7 ? '1px solid #eee' : 'none' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: COLOR + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon name={item.icon} size={22} color={COLOR} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{item.label}</div>
                                        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gov-navy)' }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
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
