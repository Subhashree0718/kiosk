import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#1a5276';

const SERVICES = [
    { path: '/electricity/new-service-connection/lt-service', label: 'LT - Service Connection', labelHi: 'एलटी - सेवा कनेक्शन', icon: 'bolt' },
    { path: '/electricity/new-service-connection/lt-temporary', label: 'LT - Temporary Connection', labelHi: 'एलटी - अस्थायी कनेक्शन', icon: 'timer' },
    { path: '/electricity/new-service-connection/agriculture-lt', label: 'Agriculture LT – Cottage Industries', labelHi: 'कृषि एलटी – कुटीर उद्योग', icon: 'agriculture' },
    { path: '/electricity/new-service-connection/lt-group', label: 'LT - Group Connection', labelHi: 'एलटी - समूह कनेक्शन', icon: 'groups' },
    { path: '/electricity/new-service-connection/lt-one-day', label: 'LT - One Day Service Connection Scheme', labelHi: 'एलटी - एक दिवसीय सेवा कनेक्शन योजना', icon: 'today' },
    { path: '/electricity/new-service-connection/lt-refund', label: 'LT Online Application - Refund', labelHi: 'एलटी ऑनलाइन आवेदन - रिफंड', icon: 'currency_rupee' },
];

export default function NewServiceConnection() {
    const navigate = useNavigate();
    return (
        <GovLayout breadcrumbs={['Departments', 'Electricity', 'New Service Connection']}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">नई सेवा कनेक्शन</div>
                    <div className="kiosk-gov-text-en">New Service Connection</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>Electricity Department — State Electricity Board</div>
                </div>
            </div>
            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>Select Sub-Service</div>
                    <p style={{ fontSize: 18, color: '#666' }}>Choose the type of new connection you wish to apply for</p>
                </div>
                <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                    {SERVICES.map(s => (
                        <div key={s.path} className="kiosk-tile" style={{ borderLeft: `8px solid ${COLOR}`, padding: '28px 24px', cursor: 'pointer', minHeight: 120, alignItems: 'flex-start', gap: 12 }} onClick={() => navigate(s.path)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: COLOR + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon name={s.icon} size={28} color={COLOR} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontSize: 13, color: COLOR, fontWeight: 700, marginBottom: 2 }}>{s.labelHi}</div>
                                    <div style={{ fontSize: 17, color: 'var(--gov-navy)', fontWeight: 800 }}>{s.label}</div>
                                </div>
                                <Icon name="arrow_forward_ios" size={18} color={COLOR} />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 70, padding: '0 50px' }} onClick={() => navigate('/electricity')}>
                        <Icon name="arrow_back" size={26} color="#fff" />&nbsp;&nbsp;BACK TO ELECTRICITY SERVICES
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
