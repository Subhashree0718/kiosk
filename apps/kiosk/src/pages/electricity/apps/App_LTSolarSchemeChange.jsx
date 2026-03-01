import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTSolarSchemeChange() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Solar Scheme Change request submitted.');
    navigate('/electricity/solar-service-connections');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'Scheme Change']}>
      
    <KioskFormCard 
        title="LT Solar - Scheme Change" 
        subtitle="Eg: Change from Net Metering to Gross Metering."
        icon="published_with_changes"
        theme="teal"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3498db] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-1">
                <label className="form-label">Existing Scheme <span className="req-star">*</span></label>
                <select name="existingScheme" required onChange={handleChange} className="form-input">
                  <option value="">Select current scheme...</option>
                  <option value="net-metering">Net Metering</option>
                  <option value="gross-metering">Gross Metering</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-1">
                <label className="form-label">Requested Scheme <span className="req-star">*</span></label>
                <select name="requestedScheme" required onChange={handleChange} className="form-input">
                  <option value="">Select target scheme...</option>
                  <option value="net-metering">Net Metering</option>
                  <option value="gross-metering">Gross Metering</option>
                </select>
              </div>


              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Reason for Change <span className="req-star">*</span></label>
                <textarea name="reason" required onChange={handleChange} rows="3" placeholder="Briefly explain why you wish to change your scheme..." className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3498db] outline-none transition-all focus:bg-white"></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Documentation
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Updated Agreement Copy <span className="req-star">*</span></label>
                <input type="file" name="agreementCopy" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Change Request  <span className="material-icons text-sm">send</span>
              </button>
            </div>

          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
