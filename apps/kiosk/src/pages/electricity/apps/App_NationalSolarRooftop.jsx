import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_NationalSolarRooftop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ alreadyHavingSolar: 'No' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('National Solar Rooftop Application submitted for ' + formData.consumerName);
    navigate('/electricity/solar-service-connections');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Solar', 'National Rooftop Portal']}>
      
    <KioskFormCard 
        title="National Solar Rooftop Portal" 
        subtitle="Apply for domestic solar panel subsidy."
        icon="solar_power"
        theme="teal"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Is the consumer already having a solar panel installation? <span className="req-star">*</span></label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl flex-1 bg-gray-50 hover:bg-orange-50 transition-colors">
                    <input type="radio" name="alreadyHavingSolar" value="Yes" checked={formData.alreadyHavingSolar === 'Yes'} onChange={handleChange} className="accent-[#e67e22] w-5 h-5" />
                    <span className="font-bold text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl flex-1 bg-gray-50 hover:bg-orange-50 transition-colors">
                    <input type="radio" name="alreadyHavingSolar" value="No" checked={formData.alreadyHavingSolar === 'No'} onChange={handleChange} className="accent-[#e67e22] w-5 h-5" />
                    <span className="font-bold text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Monitoring charges for solar panel installation / other location</label>
                <input type="text" name="monitoringCharges" onChange={handleChange} placeholder="Enter details..." className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white text-lg" />
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">person</span> Consumer Details
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group md:col-span-2">
                <label className="form-label">Consumer Name <span className="req-star">*</span></label>
                <input type="text" name="consumerName" required onChange={handleChange} placeholder="Full Name" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div>
                <label className="form-label">Consumer Number <span className="req-star">*</span></label>
                <input type="text" name="consumerNumber" required onChange={handleChange} placeholder="Service Connection No" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div>
                <label className="form-label">Electricity Distribution Company <span className="req-star">*</span></label>
                <input type="text" name="discom" required onChange={handleChange} placeholder="e.g. BESCOM" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div>
                <label className="form-label">Mobile Number / Phone Number <span className="req-star">*</span></label>
                <input type="tel" name="mobile" required onChange={handleChange} placeholder="10-digit mobile" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input type="email" name="email" onChange={handleChange} placeholder="email@example.com" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Installation Address <span className="req-star">*</span></label>
                <textarea name="address" required onChange={handleChange} rows="3" placeholder="Full address" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e67e22] outline-none transition-all focus:bg-white"></textarea>
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
