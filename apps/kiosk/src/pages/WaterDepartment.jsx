import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';
import { wCheckRegistration } from '../services/waterApi.js';
import { useT } from '../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const SERVICES = [
    {
        path: '/water/complaints',
        icon: 'report_problem',
        label: 'Register Complaint',
        labelHi: 'शिकायत दर्ज करें',
        desc: 'Pipeline leaks, quality issues, supply disruption',
        color: '#e74c3c'
    },
    {
        path: '/water/tax',
        icon: 'receipt_long',
        label: 'Pay Water Tax',
        labelHi: 'जल कर भुगतान',
        desc: 'Quick pay, bill history, and property search',
        color: '#2980b9'
    },
    {
        path: '/water/new-connection',
        icon: 'plumbing',
        label: 'New Connection',
        labelHi: 'नया कनेक्शन',
        desc: 'Apply for fresh domestic or commercial line',
        color: '#27ae60'
    },
    {
        path: '/water/account',
        icon: 'manage_accounts',
        label: 'My Account & History',
        labelHi: 'मेरा खाता',
        desc: 'Payment history, complaints, connections & profile',
        color: '#8e44ad'
    },
];


export default function WaterDepartment() {
    const navigate = useNavigate();
    const sessionMobile = useKioskStore(s => s.sessionMobile);
    const { t } = useT();
    const [checking, setChecking] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [consumerName, setConsumerName] = useState('');

    // Build services list using current language
    const SERVICES = [
        {
            path: '/water/complaints', icon: 'report_problem', color: '#e74c3c',
            label: t('Register Complaint', 'शिकायत दर्ज करें'),
            desc: t('Pipeline leaks, quality issues, supply disruption', 'पाइप लीक, जल गुणवत्ता, आपूर्ति समस्या')
        },
        {
            path: '/water/tax', icon: 'receipt_long', color: '#2980b9',
            label: t('Pay Water Tax', 'जल कर भुगतान'),
            desc: t('Quick pay, bill history and property search', 'त्वरित भुगतान, बिल इतिहास और संपत्ति खोज')
        },
        {
            path: '/water/new-connection', icon: 'plumbing', color: '#27ae60',
            label: t('New Connection', 'नया कनेक्शन'),
            desc: t('Apply for domestic or commercial water line', 'घरेलू या वाणिज्यिक जल लाइन हेतु आवेदन करें')
        },
        {
            path: '/water/account', icon: 'manage_accounts', color: '#8e44ad',
            label: t('My Account & History', 'मेरा खाता और इतिहास'),
            desc: t('Payments, complaints, connections & profile', 'भुगतान, शिकायत, कनेक्शन और प्रोफाइल')
        },
    ];

    useEffect(() => {
        if (!sessionMobile) {
            setChecking(false);
            return;
        }
        wCheckRegistration(sessionMobile)
            .then(({ data }) => {
                setIsRegistered(data.registered);
                setConsumerName(data.consumerName || '');
            })
            .catch(() => {
                // On error, still show the dashboard — don't block
                setIsRegistered(true);
            })
            .finally(() => setChecking(false));
    }, [sessionMobile]);

    const GovHeader = () => (
        <>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                    alt="Emblem of India"
                    className="kiosk-gov-emblem"
                />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">{t('Water Supply Board', 'जल आपूर्ति बोर्ड')}</div>
                    <div className="kiosk-gov-text-en">{t('Ministry of Jal Shakti, Government of India', 'जल शक्ति मंत्रालय, भारत सरकार')}</div>
                </div>
            </div>
        </>
    );

    // — No session —
    if (!sessionMobile) {
        return (
            <GovLayout breadcrumbs={['Departments', t('Water Supply Board', 'जल आपूर्ति बोर्ड')]}>
                <GovHeader />
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <Icon name="lock" size={80} color="var(--gov-navy)" />
                    <h2 style={{ fontSize: 32, margin: '20px 0', color: 'var(--gov-navy)' }}>
                        {t('Authentication Required', 'प्रमाणीकरण आवश्यक')}
                    </h2>
                    <p style={{ fontSize: 20, color: '#666', marginBottom: 30 }}>
                        {t('Please login via the main kiosk screen first.', 'कृपया पहले मुख्य किओस्क स्क्रीन से लॉगिन करें।')}
                    </p>
                    <button className="kiosk-btn kiosk-btn--primary" style={{ height: 80, padding: '0 50px' }} onClick={() => navigate('/login')}>
                        {t('GO TO LOGIN', 'लॉगिन करें')}
                    </button>
                </div>
            </GovLayout>
        );
    }

    // — Loading —
    if (checking) {
        return (
            <GovLayout breadcrumbs={['Departments', 'Water Supply Board']}>
                <GovHeader />
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 80 }}>
                    <Icon name="hourglass_top" size={80} color="var(--gov-navy)" />
                    <p style={{ fontSize: 24, marginTop: 20, color: '#555' }}>Loading your services...</p>
                </div>
            </GovLayout>
        );
    }

    // — Main dashboard (shown for BOTH registered and unregistered users) —
    return (
        <GovLayout breadcrumbs={['Departments', 'Water Supply Board']}>
            <GovHeader />
            <div className="kiosk-container">

                {/* Welcome banner for registered users */}
                {isRegistered && (
                    <div style={{ background: '#e8f5e9', border: '2px solid #27ae60', padding: '14px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                        <Icon name="verified_user" size={32} color="#27ae60" />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>
                                {t('Welcome back', 'सुस्वागतम')}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gov-navy)' }}>
                                {consumerName || `+91-XXXXXX${sessionMobile?.slice(-4)}`}
                            </div>
                        </div>
                    </div>
                )}



                {/* Registration banner for unregistered users */}
                {!isRegistered && (
                    <div style={{ background: '#fff8e1', border: '2px solid #f39c12', padding: '16px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <Icon name="info" size={32} color="#e67e22" />
                            <div>
                                <div style={{ fontSize: 17, fontWeight: 700, color: '#c0392b' }}>
                                    {t('Water Registration Required', 'जल सेवा पंजीकरण आवश्यक है')}
                                </div>
                                <div style={{ fontSize: 14, color: '#7f6000', marginTop: 3 }}>
                                    {t(
                                        `Mobile +91-XXXXXX${sessionMobile.slice(-4)} is not registered. Register once to link a Property ID.`,
                                        `मोबाइल +91-XXXXXX${sessionMobile.slice(-4)} पंजीकृत नहीं है। प्रॉपर्टी आईडी लिंक करने हेतु एक बार पंजीकरण करें।`
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            className="kiosk-btn kiosk-btn--primary"
                            style={{ minWidth: 220, height: 60, flexShrink: 0, background: '#e67e22', borderColor: '#e67e22' }}
                            onClick={() => navigate('/water/tax', { state: { action: 'register' } })}
                        >
                            <Icon name="how_to_reg" size={22} color="#fff" />
                            <span style={{ marginLeft: 8 }}>{t('REGISTER NOW', 'अभी पंजीकरण करें')}</span>
                        </button>
                    </div>
                )}

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>
                        {t('Citizen Services Portal', 'नागरिक सेवा पोर्टल')}
                    </div>
                    <p style={{ fontSize: 18, color: '#666', fontWeight: 500, marginTop: 8 }}>
                        {t('Select a service to proceed', 'आगे बढ़ने के लिए सेवा चुनें')}
                    </p>
                </div>

                {/* All services — always visible */}
                <div className="kiosk-grid">
                    {SERVICES.map(s => (
                        <div key={s.path} className="kiosk-tile" style={{ borderTop: `8px solid ${s.color}` }} onClick={() => navigate(s.path)}>
                            <div className="kiosk-tile__icon" style={{ color: s.color }}>
                                <Icon name={s.icon} size={80} color={s.color} />
                            </div>
                            <div className="kiosk-tile__label">{s.label}</div>
                            <div className="kiosk-tile__desc">{s.desc}</div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 85, padding: '0 60px' }} onClick={() => navigate('/departments')}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>
                                {t('BACK TO DEPARTMENTS', 'विभागों पर वापस जाएं')}
                            </div>
                        </div>
                        <Icon name="arrow_back" size={32} color="#fff" />
                    </button>

                    <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 40, borderTop: '1px solid #ddd', paddingTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="phone" size={24} color="var(--gov-navy)" />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>HELPLINE</div>
                                <div style={{ fontSize: 20, color: 'var(--gov-navy)', fontWeight: 800 }}>1916</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="email" size={24} color="var(--gov-navy)" />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>EMAIL</div>
                                <div style={{ fontSize: 18, color: 'var(--gov-navy)', fontWeight: 800 }}>waterboard@gov.in</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
