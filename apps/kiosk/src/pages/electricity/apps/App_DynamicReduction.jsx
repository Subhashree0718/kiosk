import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_DynamicReduction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Dynamic Reduction Request initiated for Connection No: ' + formData.serviceNo);
    navigate('/electricity/existing-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Existing Services', 'LT - Dynamic Reduction']}>
      
    <KioskFormCard 
        title="LT Dynamic Reduction" 
        subtitle="Dynamic load reduction application."
        icon="bolt"
        theme="blue"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b03a2e] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">Present Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="presentLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 10.0" className="form-input" />
              </div>

              <div>
                <label className="form-label">Requested Temporary Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="tempLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 2.0" className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Duration of Reduction Period <span className="req-star">*</span></label>
                <div className="flex items-center gap-4">
                  <input type="date" name="durationStart" required onChange={handleChange} className="p-3.5 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b03a2e] outline-none transition-all focus:bg-white" />
                  <span className="text-gray-500 font-bold">TO</span>
                  <input type="date" name="durationEnd" required onChange={handleChange} className="p-3.5 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b03a2e] outline-none transition-all focus:bg-white" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="form-label">Reason (e.g. factory shutdown, seasonal closure) <span className="req-star">*</span></label>
                <textarea name="reason" required onChange={handleChange} rows="3" placeholder="Explain the reason for dynamic reduction..." className="form-input"></textarea>
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
