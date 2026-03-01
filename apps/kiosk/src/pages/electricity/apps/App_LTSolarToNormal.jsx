import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTSolarToNormal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Solar Service to Normal Service request submitted.');
    navigate('/electricity/solar-service-connections');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'Solar to Normal']}>
      
    <KioskFormCard 
        title="Solar Service to Normal Service" 
        subtitle="Application for complete removal of solar tracking meters."
        icon="compare_arrows"
        theme="teal"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7f8c8d] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Reason for Solar Removal <span className="req-star">*</span></label>
                <textarea name="reason" required onChange={handleChange} rows="3" placeholder="Briefly explain why you wish to revert to normal service..." className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7f8c8d] outline-none transition-all focus:bg-white"></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Documentation & Declarations
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Solar Dismantling Declaration <span className="req-star">*</span></label>
                <input type="file" name="dismantleDeclaration" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Net Meter Surrender Details Form <span className="req-star">*</span></label>
                <input type="file" name="netMeterSurrender" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Final Settlement Confirmation <span className="req-star">*</span></label>
                <input type="file" name="settlementConfirmation" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Updated Load Details Document (After Solar Removal) <span className="req-star">*</span></label>
                <input type="file" name="updatedLoadDetails" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Transfer Request  <span className="material-icons text-sm">send</span>
              </button>
            </div>

          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
