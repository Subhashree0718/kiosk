import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_TariffConversion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Tariff Conversion Request initiated for Connection No: ' + formData.serviceNo);
    navigate('/electricity/existing-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Existing Services', 'LT - Tariff Conversion']}>
      
    <KioskFormCard 
        title="LT - Tariff Conversion" 
        subtitle="from Domestic Common Supply(1D) to Common facilities in Multitenements W/O Lift(1E)"
        icon="apartment"
        theme="blue"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c0392b] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">No. of Dwelling Units <span className="req-star">*</span></label>
                <input type="number" name="dwellingUnits" min="1" required onChange={handleChange} placeholder="e.g. 10" className="form-input" />
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Document Uploads
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Building Type Proof (Apartment declaration / plan copy) <span className="req-star">*</span></label>
                <input type="file" name="buildingProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Proof that no lift is installed <span className="req-star">*</span></label>
                <input type="file" name="noLiftProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Owner / Association Authorization Letter <span className="req-star">*</span></label>
                <input type="file" name="authLetter" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
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
