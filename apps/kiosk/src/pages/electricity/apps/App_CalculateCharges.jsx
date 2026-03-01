import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_CalculateCharges() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // I will tell what to do when clicked calculate afterwards
    alert('Charge Calculation triggered for: ' + JSON.stringify(formData));
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Application Tracking', 'Calculate Charges']}>
      
    <KioskFormCard 
        title="Calculate Application Charges" 
        subtitle="Estimate the fees for your new connection or load modification."
        icon="calculate"
        theme="purple"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Application Category <span className="req-star">*</span></label>
                <select name="applicationCategory" required onChange={handleChange} className="form-input">
                  <option value="">Select Category</option>
                  <option value="new_connection">New Service Connection</option>
                  <option value="additional_load">Additional Load</option>
                  <option value="reduction_load">Reduction of Load</option>
                  <option value="tariff_change">Tariff Change</option>
                  <option value="temporary">Temporary Connection</option>
                </select>
              </div>

              <div>
                <label className="form-label">Existing Demand (kWh)</label>
                <input type="number" name="existingDemand" min="0" step="0.1" onChange={handleChange} placeholder="e.g. 2.0" className="form-input" />
              </div>

              <div>
                <label className="form-label">Applied Demand (kWh) <span className="req-star">*</span></label>
                <input type="number" name="appliedDemand" min="0" step="0.1" required onChange={handleChange} placeholder="e.g. 5.0" className="form-input" />
              </div>

              <div>
                <label className="form-label">Existing Phase</label>
                <select name="existingPhase" onChange={handleChange} className="form-input">
                  <option value="">Select Existing Phase</option>
                  <option value="1">1 Phase</option>
                  <option value="3">3 Phase</option>
                </select>
              </div>

              <div>
                <label className="form-label">Applied Phase <span className="req-star">*</span></label>
                <select name="appliedPhase" required onChange={handleChange} className="form-input">
                  <option value="">Select Applied Phase</option>
                  <option value="1">1 Phase</option>
                  <option value="3">3 Phase</option>
                </select>
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Calculate  <span className="material-icons text-sm">calculate</span>
              </button>
            </div>
          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
