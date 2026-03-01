import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_GSTUpdation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('GST Number Updation request submitted for Service No: ' + formData.serviceNo);
    navigate('/electricity/services-and-complaints');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Services', 'GST Updation']}>
      
    <KioskFormCard 
        title="GST Number Updation" 
        subtitle="Update your GST number linked to your electricity service connection."
        icon="receipt"
        theme="blue"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="flex flex-col gap-6">

              <div className="flex flex-col gap-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c0392b] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">New GST Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">receipt_long</span>
                  <input type="text" name="gstNumber" required onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" maxLength="15" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c0392b] outline-none transition-all focus:bg-white text-lg tracking-widest" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">GST Certificate Upload <span className="req-star">*</span></label>
                <input type="file" name="gstCertificate" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="bg-red-50 text-red-800 text-sm p-3 rounded-lg flex items-center gap-2">
                <span className="material-icons text-red-600">info</span>
                Please upload a valid GST Registration Certificate (PDF or image).
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
