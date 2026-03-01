import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_AadhaarLink() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Aadhaar linking request submitted successfully for Service No: ' + formData.serviceNo);
    navigate('/electricity/services-and-complaints');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Services', 'Aadhaar Link']}>
      
    <KioskFormCard 
        title="Aadhaar Link Verification" 
        subtitle="Link your Aadhaar number to your service connection safely."
        icon="fingerprint"
        theme="blue"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a085] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-1">
                <label className="form-label">Aadhaar Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">badge</span>
                  <input type="text" name="aadhaarNo" pattern="[0-9]{12}" maxLength="12" required onChange={handleChange} placeholder="12-digit Aadhaar Number" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a085] outline-none transition-all focus:bg-white text-lg tracking-widest" />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-1">
                <label className="form-label">Registered Mobile Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">phone_iphone</span>
                  <input type="tel" name="mobile" pattern="[0-9]{10}" maxLength="10" required onChange={handleChange} placeholder="10-digit mobile number" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a085] outline-none transition-all focus:bg-white text-lg" />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 mt-4">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex gap-4 text-teal-800">
                  <span className="material-icons text-teal-600">verified_user</span>
                  <p className="text-sm">By submitting this form, you consent to allow the State Electricity Board to verify your Aadhaar details with UIDAI for KYC purposes only.</p>
                </div>
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
