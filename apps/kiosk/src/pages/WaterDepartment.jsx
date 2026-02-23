import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

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
];

export default function WaterDepartment() {
    const navigate = useNavigate();

    return (
        <GovLayout breadcrumbs={['Departments', 'Water Supply Board']}>
            {/* National Color Strip */}
            <div className="kiosk-gov-strip"></div>

            {/* Formal Government Header */}
            <div className="kiosk-gov-header">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                    alt="Emblem of India"
                    className="kiosk-gov-emblem"
                />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">जल आपूर्ति बोर्ड</div>
                    <div className="kiosk-gov-text-en">Water Supply Board</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>Ministry of Jal Shakti, Government of India</div>
                </div>
            </div>

            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>Welcome to Citizen Portal</div>
                    <div style={{ fontStyle: 'italic', fontSize: 24, fontColor: '#666', marginBottom: 10 }}>नागरिक पोर्टल में आपका स्वागत है</div>
                    <p style={{ fontSize: 20, color: '#666', fontWeight: 500 }}>
                        Select a service to proceed | आगे बढ़ने के लिए सेवा का चयन करें
                    </p>
                </div>

                <div className="kiosk-grid">
                    {SERVICES.map(s => (
                        <div key={s.path} className="kiosk-tile" style={{ borderTop: `8px solid ${s.color}` }} onClick={() => navigate(s.path)}>
                            <div className="kiosk-tile__icon" style={{ color: s.color }}>
                                <Icon name={s.icon} size={80} color={s.color} />
                            </div>
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">{s.labelHi}</span>
                                {s.label}
                            </div>
                            <div className="kiosk-tile__desc">{s.desc}</div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 85, padding: '0 60px' }} onClick={() => navigate('/departments')}>
                        <div style={{ textAlign: 'left' }}>
                            <span className="kiosk-gov-btn-hi">मुख्य पृष्ठ पर जाएं</span>
                            <div style={{ fontSize: 16, opacity: 0.8 }}>BACK TO DEPARTMENTS</div>
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
