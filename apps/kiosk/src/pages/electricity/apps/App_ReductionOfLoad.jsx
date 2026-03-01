import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_ReductionOfLoad() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reduction of Load Request initiated for Connection No: ' + formData.serviceNo);
    navigate('/electricity/existing-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Existing Services', 'LT - Reduction of Load']}>
      
    <KioskFormCard 
        title="LT Reduction of Load" 
        subtitle="Request to decrease the sanctioned load for your connection."
        icon="battery_saver"
        theme="saffron"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d35400] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">Current Sanctioned Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="currentLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 5.0" className="form-input" />
              </div>

              <div>
                <label className="form-label">Requested Reduced Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="reducedLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 2.0" className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Reason for Reduction <span className="req-star">*</span></label>
                <textarea name="reason" required onChange={handleChange} rows="3" placeholder="Explain the reason for load decrease..." className="form-input"></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Documents
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  <span>Self-declaration of reduced connected load <span className="req-star">*</span></span>
                  <a href="#" className="text-[#d35400] hover:underline text-xs flex items-center gap-1"><span className="material-icons text-[12px]">download</span> Download template</a>
                </label>
                <input type="file" name="declaration" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
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
