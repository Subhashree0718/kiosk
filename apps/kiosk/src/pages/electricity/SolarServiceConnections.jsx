import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
  <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#f39c12';

const SERVICES = [
  { path: '/electricity/solar-service-connections/national-solar-rooftop', label: 'National Solar Rooftop Portal (Domestic Subsidy)', labelHi: 'राष्ट्रीय सौर रूफटॉप पोर्टल', icon: 'solar_power' },
  { path: '/electricity/solar-service-connections/lt-solar-service', label: 'LT Solar - Service Connection (Non CFA)', labelHi: 'एलटी सौर ऊर्जा कनेक्शन', icon: 'wb_sunny' },
  { path: '/electricity/solar-service-connections/lt-solar-consumer-readiness', label: 'LT Solar - Consumer Readiness (Non CFA)', labelHi: 'उपभोक्ता तैयारी प्रपत्र', icon: 'check_circle' },
  { path: '/electricity/solar-service-connections/lt-solar-additional-load', label: 'LT Solar - Additional Load', labelHi: 'अतिरिक्त सौर भार', icon: 'add_circle' },
  { path: '/electricity/solar-service-connections/lt-solar-scheme-change', label: 'LT Solar - Scheme Change', labelHi: 'सौर योजना परिवर्तन', icon: 'published_with_changes' },
  { path: '/electricity/solar-service-connections/lt-solar-to-normal', label: 'LT Solar Service to Normal Service', labelHi: 'सौर से सामान्य सेवा', icon: 'compare_arrows' },
  { path: '/electricity/solar-service-connections/online-solar-ground-mounted', label: 'Online Solar - Ground Mounted', labelHi: 'ग्राउंड माउंटेड सोलर', icon: 'landscape' },
];

export default function SolarServiceConnections() {
  const navigate = useNavigate();
  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar Connections']}>
      <div className="kiosk-gov-strip"></div>
      <div className="kiosk-gov-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
        <div className="kiosk-gov-title-group">
          <div className="kiosk-gov-text-hi">सौर सेवा संपर्क</div>
          <div className="kiosk-gov-text-en">Solar Service Connections</div>
          <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>Electricity Department — State Electricity Board</div>
        </div>
      </div>
      <div className="kiosk-container">
        <div className="kiosk-header">
          <div className="kiosk-title" style={{ fontSize: 32 }}>Select Sub-Service</div>
          <p style={{ fontSize: 18, color: '#666' }}>Green energy applications and solar connection modifications</p>
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
