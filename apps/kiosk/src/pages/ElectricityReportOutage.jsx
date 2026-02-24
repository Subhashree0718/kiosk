import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

export default function ElectricityReportOutage() {
    const navigate = useNavigate();

    return (
        <GovLayout breadcrumbs={['Departments', 'Electricity', 'Report Outage']}>
            <div className="kiosk-container" style={{ padding: '40px 0' }}>
                <div style={{ background: '#fff', borderRadius: 24, padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <span className="material-icons" style={{ fontSize: 80, color: '#e74c3c', marginBottom: 20 }}>power_off</span>
                    <h1 style={{ color: 'var(--gov-navy)', fontSize: 36, marginBottom: 10 }}>Report Power Outage</h1>
                    <p style={{ fontSize: 22, color: '#64748b', marginBottom: 40 }}>The outage reporting system is currently being set up by the field operations team.</p>

                    <button className="kiosk-btn kiosk-btn--secondary" style={{ width: 300, margin: '0 auto' }} onClick={() => navigate('/electricity')}>
                        <span className="material-icons" style={{ marginRight: 10 }}>arrow_back</span>
                        BACK TO SERVICES
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
