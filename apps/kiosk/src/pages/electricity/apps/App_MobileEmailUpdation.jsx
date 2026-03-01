import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_MobileEmailUpdation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Contact Details Update request submitted for Service No: ' + formData.serviceNo);
    navigate('/electricity/services-and-complaints');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Services', 'Mobile/Email Updation']}>
      
    <KioskFormCard 
        title="Update Contact Details" 
        subtitle="Update your Mobile Number and Email ID for LT Services."
        icon="contact_phone"
        theme="blue"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3498db] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="col-span-1 border-b border-gray-100 my-2"></div>

              <div>
                <label className="form-label">New Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">phone_iphone</span>
                  <input type="tel" name="newMobile" pattern="[0-9]{10}" maxLength="10" onChange={handleChange} placeholder="10-digit mobile number" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3498db] outline-none transition-all focus:bg-white text-lg" />
                </div>
              </div>

              <div>
                <label className="form-label">New Email ID</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">email</span>
                  <input type="email" name="newEmail" onChange={handleChange} placeholder="email@example.com" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3498db] outline-none transition-all focus:bg-white text-lg" />
                </div>
              </div>

              <div className="col-span-1 mt-2">
                <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-center gap-2">
                  <span className="material-icons text-blue-600">info</span>
                  Leave a field blank if you do not wish to update it.
                </div>
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Update Details  <span className="material-icons text-sm">send</span>
              </button>
            </div>
          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
