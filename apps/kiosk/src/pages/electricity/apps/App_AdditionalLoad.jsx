import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_AdditionalLoad() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Additional Load Request initiated for Connection No: ' + formData.serviceNo);
    navigate('/electricity/existing-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Existing Services', 'LT - Additional Load']}>
      
    <KioskFormCard 
        title="LT Additional Load" 
        subtitle="Request to increase the sanctioned load for your connection."
        icon="battery_charging_full"
        theme="red"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e74c3c] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">Existing Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="existingLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 2.5" className="form-input" />
              </div>

              <div>
                <label className="form-label">Requested Additional Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="additionalLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 1.0" className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Purpose of Additional Load <span className="req-star">*</span></label>
                <textarea name="purpose" required onChange={handleChange} rows="3" placeholder="Explain the reason for load increase (e.g. new ACs, expansion)..." className="form-input"></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Documents
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Electrical Wiring Completion Certificate (If load increase is large)</label>
                <input type="file" name="wiringCert" accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Request  <span className="material-icons text-sm">send</span>
              </button>
            </div>
          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
