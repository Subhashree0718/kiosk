import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
  <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#8e44ad';

const SERVICES = [
  { path: '/electricity/lt-application-tracking/calculate-charges', label: 'Calculate Application Charges', labelHi: 'शुल्क की गणना करें', icon: 'calculate' },
  { path: '/electricity/lt-application-tracking/application-status', label: 'Application Status', labelHi: 'आवेदन की स्थिति', icon: 'pending_actions' },
  { path: '/electricity/lt-application-tracking/modify-application', label: 'Modify Application', labelHi: 'आवेदन संशोधित करें', icon: 'edit_document' },
  { path: '/electricity/lt-application-tracking/print-application', label: 'Print Application', labelHi: 'आवेदन प्रिंट करें', icon: 'print' },
  { path: '/electricity/lt-application-tracking/upload-completion-certificate', label: 'Upload Completion Certificate', labelHi: 'पूर्णता प्रमाणपत्र अपलोड करें', icon: 'upload_file' },
  { path: '/electricity/lt-application-tracking/enter-grievance', label: 'Enter Grievance', labelHi: 'शिकायत दर्ज करें', icon: 'report_problem' },
  { path: '/electricity/lt-application-tracking/grievance-status', label: 'Grievance Status', labelHi: 'शिकायत की स्थिति', icon: 'assignment_turned_in' },
  { path: '/electricity/lt-application-tracking/give-feedback', label: 'Give Feedback', labelHi: 'प्रतिक्रिया दें', icon: 'feedback' },
];

export default function LTApplicationTracking() {
  const navigate = useNavigate();
  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'LT Application Tracking']}>
      <div className="kiosk-gov-strip"></div>
      <div className="kiosk-gov-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
        <div className="kiosk-gov-title-group">
          <div className="kiosk-gov-text-hi">एलटी आवेदन ट्रैकिंग</div>
          <div className="kiosk-gov-text-en">LT Application Tracking</div>
          <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>Electricity Department — State Electricity Board</div>
        </div>
      </div>
      <div className="kiosk-container">
        <div className="kiosk-header">
          <div className="kiosk-title" style={{ fontSize: 32 }}>Select Action</div>
          <p style={{ fontSize: 18, color: '#666' }}>Track or modify your existing applications and grievances</p>
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
