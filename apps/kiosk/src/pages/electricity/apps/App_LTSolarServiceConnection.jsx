import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTSolarServiceConnection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Solar Service Connection (Non CFA) request submitted.');
    navigate('/electricity/solar-service-connections');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'LT Solar Service']}>
      
    <KioskFormCard 
        title="LT Solar Service Connection" 
        subtitle="(Non CFA) Application for new solar connections."
        icon="wb_sunny"
        theme="blue"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Consumer Name <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">person</span>
                  <input type="text" name="consumerName" required onChange={handleChange} placeholder="Full Name" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Installation Address <span className="req-star">*</span></label>
                <textarea name="address" required onChange={handleChange} rows="3" placeholder="Full installation address" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white"></textarea>
              </div>

              <div>
                <label className="form-label">Existing Sanctioned Load (kW) <span className="req-star">*</span></label>
                <input type="number" name="existingLoad" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 5.0" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div>
                <label className="form-label">Proposed Solar Capacity (kW) <span className="req-star">*</span></label>
                <input type="number" name="solarCapacity" min="0.1" step="0.1" required onChange={handleChange} placeholder="e.g. 3.0" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Type of Solar System <span className="req-star">*</span></label>
                <select name="systemType" required onChange={handleChange} className="form-input">
                  <option value="">Select System Type</option>
                  <option value="on-grid">On-Grid System</option>
                  <option value="net-metering">Net-Metering System</option>
                  <option value="gross-metering">Gross-Metering System</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Solar Panel & Inverter Details (Make, Model, Capacity) <span className="req-star">*</span></label>
                <textarea name="panelDetails" required onChange={handleChange} rows="2" placeholder="e.g. Luminous 1kW/12V, Model XYZ..." className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white"></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Document Uploads
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Single Line Diagram (SLD) <span className="req-star">*</span></label>
                <input type="file" name="sld" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">CEIG / Electrical Inspector Approval <span className="req-star">*</span></label>
                <input type="file" name="ceigApproval" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Application  <span className="material-icons text-sm">send</span>
              </button>
            </div>

          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
