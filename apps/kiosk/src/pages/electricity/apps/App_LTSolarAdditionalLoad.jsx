import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTSolarAdditionalLoad() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Solar Additional Load request submitted.');
    navigate('/electricity/solar-service-connections');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'Additional Load']}>
      
    <KioskFormCard 
        title="LT Solar - Additional Load" 
        subtitle="Request to increase load for your existing solar setup."
        icon="add_circle"
        theme="red"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e74c3c] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">Existing Sanctioned Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="existingLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 2.0" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e74c3c] outline-none transition-all focus:bg-white" />
              </div>

              <div>
                <label className="form-label">Requested Additional Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="additionalLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 1.5" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e74c3c] outline-none transition-all focus:bg-white" />
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Updated Solar Capacity (If changing, kW)</label>
                <input type="number" name="updatedCapacity" min="0.1" step="0.1" onChange={handleChange} placeholder="Leave blank if no change" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e74c3c] outline-none transition-all focus:bg-white" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Reason for Load Increase <span className="req-star">*</span></label>
                <textarea name="reason" required onChange={handleChange} rows="3" placeholder="Explain your requirements..." className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e74c3c] outline-none transition-all focus:bg-white"></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Load Calculation Documents
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Wiring Completion Certificate <span className="req-star">*</span></label>
                <input type="file" name="wiringCert" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Load Calculation Sheet <span className="req-star">*</span></label>
                <input type="file" name="loadSheet" required accept=".pdf,image/*,.xls,.xlsx" onChange={handleChange} className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Load Request  <span className="material-icons text-sm">send</span>
              </button>
            </div>

          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
