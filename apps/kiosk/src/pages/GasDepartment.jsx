import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useT } from '../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

export default function GasDepartment() {
    const navigate = useNavigate();
    const { t } = useT();

    const SERVICES = [
        {
            path: '/gas/my-connection',
            icon: 'local_fire_department',
            label: t('My Gas Connection', 'मेरा गैस कनेक्शन'),
            desc: t('View connection details', 'कनेक्शन विवरण देखें'),
            color: '#1a5276',
        },
        {
            path: '/gas/book-refill',
            icon: 'local_shipping',
            label: t('Book Gas Refill', 'गैस रिफिल बुक करें'),
            desc: t('Order LPG cylinder', 'एलपीजी सिलेंडर ऑर्डर करें'),
            color: '#117a65',
        },
        {
            path: '/gas/track-refill',
            icon: 'track_changes',
            label: t('Track Refill Status', 'रिफिल स्थिति ट्रैक करें'),
            desc: t('Check delivery status', 'डिलीवरी स्थिति जांचें'),
            color: '#6c3483',
        },
        {
            path: '/gas/new-connection',
            icon: 'add_circle',
            label: t('New Gas Connection', 'नया गैस कनेक्शन'),
            desc: t('Apply for connection', 'कनेक्शन हेतु आवेदन करें'),
            color: '#27ae60',
        },
        {
            path: '/gas/change-distributor',
            icon: 'swap_horiz',
            label: t('Change Distributor', 'वितरक बदलें'),
            desc: t('Request transfer', 'स्थानांतरण अनुरोध'),
            color: '#7d6608',
        },
        {
            path: '/gas/bill-payment',
            icon: 'payments',
            label: t('Gas Bill & Payment', 'गैस बिल और भुगतान'),
            desc: t('View & pay bills', 'बिल देखें और भुगतान करें'),
            color: '#2980b9',
        },
        {
            path: '/gas/subsidy-status',
            icon: 'account_balance',
            label: t('Subsidy Status', 'सब्सिडी स्थिति'),
            desc: t('Check subsidy', 'सब्सिडी जांचें'),
            color: '#d35400',
        },
        {
            path: '/gas/emergency',
            icon: 'emergency',
            label: t('Emergency Help', 'आपातकालीन सहायता'),
            desc: t('Gas leak / complaint', 'गैस रिसाव / शिकायत'),
            color: '#c0392b',
            isEmergency: true,
        },
    ];

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service Department', 'गैस सेवा विभाग')]}>
            <div className="kiosk-gov-strip"></div>

            <div className="kiosk-gov-header">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                    alt="Emblem of India"
                    className="kiosk-gov-emblem"
                />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">गैस सेवा विभाग</div>
                    <div className="kiosk-gov-text-en">Gas Service Department</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>
                        {t('Ministry of Petroleum & Natural Gas — Helpline: 1906', 'पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय — हेल्पलाइन: 1906')}
                    </div>
                </div>
            </div>

            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>
                        {t('Citizen Services Portal', 'नागरिक सेवा पोर्टल')}
                    </div>
                    <p style={{ fontSize: 18, color: '#666', fontWeight: 500, marginTop: 8 }}>
                        {t('Select a service to proceed', 'आगे बढ़ने के लिए सेवा चुनें')}
                    </p>
                </div>

                <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
                    {SERVICES.map(s => (
                        <div
                            key={s.path}
                            className="kiosk-tile"
                            style={{
                                borderTop: `8px solid ${s.color}`,
                                cursor: 'pointer',
                                padding: '32px 28px',
                                minHeight: 180,
                                alignItems: 'flex-start',
                                gap: 14,
                                ...(s.isEmergency ? {
                                    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
                                    border: '2px solid #e74c3c40',
                                    borderTop: '8px solid #c0392b',
                                    boxShadow: '0 4px 20px rgba(192, 57, 43, 0.12)',
                                } : {}),
                            }}
                            onClick={() => navigate(s.path)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 18,
                                    background: s.color + '18',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, border: `2px solid ${s.color}30`,
                                    ...(s.isEmergency ? {
                                        background: '#c0392b20',
                                        border: '2px solid #c0392b50',
                                        animation: 'pulse-badge 2s ease-in-out infinite',
                                    } : {}),
                                }}>
                                    <Icon name={s.icon} size={36} color={s.color} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div className="kiosk-tile__label" style={{
                                        fontSize: 20,
                                        color: s.isEmergency ? '#c0392b' : 'var(--gov-navy)',
                                        fontWeight: 900,
                                        textAlign: 'left',
                                    }}>
                                        {s.label}
                                        {s.isEmergency && (
                                            <span style={{
                                                display: 'inline-block',
                                                background: '#c0392b',
                                                color: '#fff',
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                marginLeft: 10,
                                                verticalAlign: 'middle',
                                                animation: 'pulse-badge 1.4s ease-in-out infinite',
                                                letterSpacing: 0.5,
                                            }}>
                                                {t('URGENT', 'तत्काल')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="kiosk-tile__desc" style={{ textAlign: 'left', margin: 0, fontSize: 15 }}>
                                        {s.desc}
                                    </div>
                                </div>
                                <Icon name="chevron_right" size={28} color={s.color} style={{ flexShrink: 0 }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 80, padding: '0 60px' }} onClick={() => navigate('/departments')}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>
                                {t('BACK TO DEPARTMENTS', 'विभागों पर वापस जाएं')}
                            </div>
                        </div>
                        <Icon name="arrow_back" size={30} color="#fff" />
                    </button>

                    <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 40, borderTop: '1px solid #ddd', paddingTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="phone" size={24} color="var(--gov-navy)" />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{t('HELPLINE', 'हेल्पलाइन')}</div>
                                <div style={{ fontSize: 20, color: 'var(--gov-navy)', fontWeight: 800 }}>1906</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="phone" size={24} color="#c0392b" />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#c0392b' }}>{t('EMERGENCY', 'आपातकालीन')}</div>
                                <div style={{ fontSize: 20, color: '#c0392b', fontWeight: 800 }}>1906</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="email" size={24} color="var(--gov-navy)" />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{t('EMAIL', 'ईमेल')}</div>
                                <div style={{ fontSize: 18, color: 'var(--gov-navy)', fontWeight: 800 }}>gas@gov.in</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
