import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const SERVICES = [
    {
        path: '/electricity/new-service-connection',
        icon: 'add_circle',
        label: 'New Service Connection',
        labelHi: 'नई सेवा कनेक्शन',
        desc: 'LT connections, temporary, agriculture, group & one-day scheme',
        color: '#1a5276',
    },
    {
        path: '/electricity/shifting-of-services',
        icon: 'swap_horiz',
        label: 'Shifting of Services',
        labelHi: 'सेवाओं का स्थानांतरण',
        desc: 'Shift meters and service lines for public or government organizations',
        color: '#117a65',
    },
    {
        path: '/electricity/existing-services',
        icon: 'settings',
        label: 'Existing Services',
        labelHi: 'मौजूदा सेवाएं',
        desc: 'Tariff change, name transfer, load addition or reduction',
        color: '#6c3483',
    },
    {
        path: '/electricity/lt-application-tracking',
        icon: 'track_changes',
        label: 'LT Application Tracking',
        labelHi: 'एलटी आवेदन ट्रैकिंग',
        desc: 'Track, modify, grievance, feedback for LT applications',
        color: '#7d6608',
    },
    {
        path: '/electricity/solar-service-connections',
        icon: 'wb_sunny',
        label: 'Solar Service Connections',
        labelHi: 'सोलर सेवा कनेक्शन',
        desc: 'Solar rooftop, ground-mounted plants, scheme change',
        color: '#d35400',
    },
    {
        path: '/electricity/lt-solar-service-tracking',
        icon: 'solar_power',
        label: 'LT Solar Service Tracking',
        labelHi: 'एलटी सोलर सेवा ट्रैकिंग',
        desc: 'Track and modify your solar service applications',
        color: '#c0392b',
    },
    {
        path: '/electricity/services-and-complaints',
        icon: 'support_agent',
        label: 'Services & Complaints',
        labelHi: 'सेवाएं एवं शिकायतें',
        desc: 'Aadhaar link, scheduled shutdown, complaints, misuse report',
        color: '#1a6e25',
    },
    {
        path: '/electricity/payments',
        icon: 'payments',
        label: 'Payments',
        labelHi: 'भुगतान',
        desc: 'Pay online, e-receipts, e-invoice, bill status',
        color: '#1a3c6e',
    },
];

export default function ElectricityDepartment() {
    const navigate = useNavigate();

    return (
        <GovLayout breadcrumbs={['Departments', 'Electricity Department']}>
            <div className="kiosk-gov-strip"></div>

            <div className="kiosk-gov-header">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                    alt="Emblem of India"
                    className="kiosk-gov-emblem"
                />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">विद्युत विभाग</div>
                    <div className="kiosk-gov-text-en">Electricity Department</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>State Electricity Board — Helpline: 1912</div>
                </div>
            </div>

            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>Citizen Service Portal</div>
                    <div style={{ fontStyle: 'italic', fontSize: 22, color: '#666', marginBottom: 10 }}>नागरिक सेवा पोर्टल</div>
                    <p style={{ fontSize: 18, color: '#666', fontWeight: 500 }}>
                        Select a service category to proceed | सेवा श्रेणी चुनें
                    </p>
                </div>

                <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
                    {SERVICES.map(s => (
                        <div
                            key={s.path}
                            className="kiosk-tile"
                            style={{ borderTop: `8px solid ${s.color}`, cursor: 'pointer', padding: '32px 28px', minHeight: 180, alignItems: 'flex-start', gap: 14 }}
                            onClick={() => navigate(s.path)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 18,
                                    background: s.color + '18',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, border: `2px solid ${s.color}30`
                                }}>
                                    <Icon name={s.icon} size={36} color={s.color} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontSize: 16, color: s.color, opacity: 0.85, fontWeight: 700, marginBottom: 2 }}>{s.labelHi}</div>
                                    <div className="kiosk-tile__label" style={{ fontSize: 20, color: 'var(--gov-navy)', fontWeight: 900, textAlign: 'left' }}>{s.label}</div>
                                </div>
                                <Icon name="chevron_right" size={28} color={s.color} style={{ flexShrink: 0 }} />
                            </div>
                            <div className="kiosk-tile__desc" style={{ textAlign: 'left', margin: 0, paddingLeft: 82, fontSize: 15 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 80, padding: '0 60px' }} onClick={() => navigate('/departments')}>
                        <div style={{ textAlign: 'left' }}>
                            <span className="kiosk-gov-btn-hi">विभाग सूची पर वापस जाएं</span>
                            <div style={{ fontSize: 15, opacity: 0.8 }}>BACK TO DEPARTMENTS</div>
                        </div>
                        <Icon name="arrow_back" size={30} color="#fff" />
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
