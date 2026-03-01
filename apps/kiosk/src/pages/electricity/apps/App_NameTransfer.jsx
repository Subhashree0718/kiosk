import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_NameTransfer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Name Transfer Request initiated for Connection No: ' + formData.serviceNo);
    navigate('/electricity/existing-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Existing Services', 'LT - Name Transfer']}>
      
    <KioskFormCard 
        title="LT Name Transfer" 
        subtitle="Transfer the ownership of your service connection."
        icon="badge"
        theme="blue"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Service Connection Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">tag</span>
                  <input type="text" name="serviceNo" required onChange={handleChange} placeholder="e.g. 1234567890" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#34495e] outline-none transition-all focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">upload_file</span> Required Documents
                </h3>
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Applicant's ID proof (Aadhaar / PAN / Voter ID) <span className="req-star">*</span></label>
                <input type="file" name="idProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Proof of Ownership / Occupancy (Sale deed / rental agrmt) <span className="req-star">*</span></label>
                <input type="file" name="ownershipProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="form-label">Latest Electricity Bill Copy <span className="req-star">*</span></label>
                <input type="file" name="billCopy" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  <span>Form 3 - Indemnity Bond <span className="req-star">*</span></span>
                  <a href="#" className="text-[#34495e] hover:underline text-xs flex items-center gap-1"><span className="material-icons text-[12px]">download</span> Form 3</a>
                </label>
                <input type="file" name="form3" required accept=".pdf" onChange={handleChange} className="form-input" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  <span>Form 4 - Undertaking <span className="req-star">*</span></span>
                  <a href="#" className="text-[#34495e] hover:underline text-xs flex items-center gap-1"><span className="material-icons text-[12px]">download</span> Form 4</a>
                </label>
                <input type="file" name="form4" required accept=".pdf" onChange={handleChange} className="form-input" />
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
