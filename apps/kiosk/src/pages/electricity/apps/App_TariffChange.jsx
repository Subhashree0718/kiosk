import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_TariffChange() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Tariff Change Request form initiated for Connection No: ' + formData.serviceNo);
    navigate('/electricity/existing-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Existing Services', 'LT - Tariff Change']}>
      
    <KioskFormCard 
        title="LT Tariff Change" 
        subtitle="Request a change in your electricity tariff plan."
        icon="swap_horiz"
        theme="purple"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8e44ad] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">Current Tariff Category <span className="req-star">*</span></label>
                <select name="currentTariff" required onChange={handleChange} className="form-input">
                  <option value="">Select Current Tariff</option>
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="form-label">Requested Tariff Category <span className="req-star">*</span></label>
                <select name="requestedTariff" required onChange={handleChange} className="form-input">
                  <option value="">Select Requested Tariff</option>
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agriculture">Agriculture</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="form-label">Reason for Change (e.g., residential → commercial) <span className="req-star">*</span></label>
                <textarea name="reason" required onChange={handleChange} rows="3" placeholder="Explain the reason for tariff change..." className="form-input"></textarea>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Supporting Proof (e.g., trade license for commercial use) <span className="req-star">*</span></label>
                <input type="file" name="supportingProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
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
