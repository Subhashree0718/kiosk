import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTRefund() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Refund Request Submitted Successfully!');
    navigate('/electricity/new-service-connection');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'New Service Connection', 'LT Online Application Refund']}>
      
    <KioskFormCard 
        title="LT Online Application Refund" 
        subtitle="Request a refund for your online LT application."
        icon="currency_rupee"
        theme="blue"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              <div>
                <label className="form-label">Application Reference Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="applicationRef" required onChange={handleChange} placeholder="Enter your 12-digit reference number" className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#34495E] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Found on your application acknowledgment receipt.</p>
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Request  <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
