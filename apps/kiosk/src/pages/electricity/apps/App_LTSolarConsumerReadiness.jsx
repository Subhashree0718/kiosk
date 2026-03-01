import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTSolarConsumerReadiness() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Solar Consumer Readiness (Non CFA) request submitted.');
    navigate('/electricity/solar-service-connections');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'Consumer Readiness']}>
      
    <KioskFormCard 
        title="LT Solar Consumer Readiness" 
        subtitle="(Non CFA) Submit your solar readiness confirmation details."
        icon="check_circle"
        theme="green"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27ae60] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Installed Solar Capacity (kW) <span className="req-star">*</span></label>
                <input type="number" name="installedCapacity" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 5.0" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27ae60] outline-none transition-all focus:bg-white" />
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Document & Confirmation Uploads
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Installation Completion Certificate <span className="req-star">*</span></label>
                <input type="file" name="completionCert" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Net Meter Readiness Confirmation Document <span className="req-star">*</span></label>
                <input type="file" name="netMeterReadiness" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Test Report (from authorized agency) <span className="req-star">*</span></label>
                <input type="file" name="testReport" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Photographs of the solar installation (Upload ZIP or Image) <span className="req-star">*</span></label>
                <input type="file" name="photographs" required accept=".zip,.rar,image/*" multiple onChange={handleChange} className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Readiness Form  <span className="material-icons text-sm">send</span>
              </button>
            </div>

          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
