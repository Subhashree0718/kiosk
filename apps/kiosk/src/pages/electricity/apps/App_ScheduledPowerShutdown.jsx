import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_ScheduledPowerShutdown() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Services', 'Scheduled Power Shutdown']}>
      <KioskFormCard
        title="Scheduled Power Shutdown"
        subtitle="Check upcoming maintenance schedules for your area."
        icon="power_off"
        theme="blue"
      >
        {!submitted ? (
          <form className="kiosk-form" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="col-span-2">
                <label className="form-label">District <span className="req-star">*</span></label>
                <select name="district" required onChange={handleChange} className="form-input">
                  <option value="">Select District</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="form-label">Taluk <span className="req-star">*</span></label>
                <input type="text" name="taluk" required onChange={handleChange} placeholder="Enter Taluk" className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Area / Locality <span className="req-star">*</span></label>
                <input type="text" name="area" required onChange={handleChange} placeholder="Enter Area or Locality" className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Check Schedule <span className="material-icons text-sm">search</span></button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 100, height: 100, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <span className="material-icons" style={{ color: '#ef4444', fontSize: '48px' }}>power_off</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Upcoming Shutdown Found</h3>
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px' }}>
              Maintenance work has been scheduled for your selected area <b>{formData.area || 'Unknown'}, {formData.taluk || 'Unknown'}</b>.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '16px', display: 'inline-block', textAlign: 'left', minWidth: '350px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Scheduled Period</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>14 March, 09:00 AM - 04:00 PM</div>
              <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Reason</div>
              <div style={{ fontSize: '16px', color: '#334155', fontWeight: 500 }}>Substation maintenance and line clearance.</div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={() => setSubmitted(false)} className="btn-cancel">
                Check Another Location
              </button>
            </div>
          </div>
        )}
      </KioskFormCard>
    </GovLayout>
  );
}
