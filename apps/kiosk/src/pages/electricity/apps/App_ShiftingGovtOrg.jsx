import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_ShiftingGovtOrg() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Shifting Service (Government Org.) Application Submitted!');
    navigate('/electricity/shifting-of-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Shifting of Services', 'Government Organization']}>
      
    <KioskFormCard 
        title="Shifting Services - Govt. Organization" 
        subtitle="Apply for shifting of electrical utilities on behalf of a Government agency."
        icon="account_balance"
        theme="navy"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">

              {/* Personal Details */}
              <div className="col-span-2">
                <h3 className="form-section-head"><span className="material-icons">apartment</span> Organization & Location Details
                </h3>
              </div>

              <div>
                <label className="form-label">Applicant/Dept Name <span className="req-star">*</span></label>
                <input type="text" name="applicantName" required onChange={handleChange} placeholder="Enter department name" className="form-input" />
              </div>

              <div>
                <label className="form-label">Mobile Number (Nodal Auth.) <span className="req-star">*</span></label>
                <input type="tel" name="mobile" required onChange={handleChange} placeholder="10-digit mobile number" className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Communication Address <span className="req-star">*</span></label>
                <textarea name="address" required onChange={handleChange} rows="2" placeholder="Enter complete address" className="form-input"></textarea>
              </div>

              <div>
                <label className="form-label">District <span className="req-star">*</span></label>
                <select name="district" required onChange={handleChange} className="form-input">
                  <option value="">Select District</option>
                  <option value="chennai">Chennai</option>
                  <option value="coimbatore">Coimbatore</option>
                </select>
              </div>

              <div>
                <label className="form-label">Taluk <span className="req-star">*</span></label>
                <select name="taluk" required onChange={handleChange} className="form-input">
                  <option value="">Select Taluk</option>
                  <option value="t1">Taluk 1</option>
                </select>
              </div>

              <div>
                <label className="form-label">Area / Locality <span className="req-star">*</span></label>
                <input type="text" name="areaLocality" required onChange={handleChange} placeholder="Enter Area/Locality" className="form-input" />
              </div>

              <div>
                <label className="form-label">Landmark (If any)</label>
                <input type="text" name="landmark" onChange={handleChange} placeholder="Near prominent location" className="form-input" />
              </div>

              <div>
                <label className="form-label">GST Number (If any)</label>
                <input type="text" name="gst" onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" className="form-input" />
              </div>

              {/* Technical Details */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="form-section-head"><span className="material-icons">build</span> Technical Details
                </h3>
              </div>

              <div>
                <label className="form-label">Voltage of Line Material <span className="req-star">*</span></label>
                <input type="text" name="voltage" required onChange={handleChange} placeholder="e.g. LT / HT" className="form-input" />
              </div>

              <div>
                <label className="form-label">Shifting Works Involve <span className="req-star">*</span></label>
                <input type="text" name="worksInvolve" required onChange={handleChange} placeholder="Pole shifting, Line shifting, etc." className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Description of the Work <span className="req-star">*</span></label>
                <textarea name="description" required onChange={handleChange} rows="3" placeholder="Elaborate on the shifting requirement" className="form-input"></textarea>
              </div>

              {/* Documents */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="form-section-head"><span className="material-icons">description</span> Document Uploads
                </h3>
              </div>

              <div>
                <label className="form-label">Official Identification Proof <span className="req-star">*</span></label>
                <input type="file" name="idProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div>
                <label className="form-label">Sketch/Image of Shifting Location <span className="req-star">*</span></label>
                <input type="file" name="sketchImage" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div className="flex flex-col gap-2 relative group col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  <span>Govt Undertaking Form <span className="req-star">*</span></span>
                  <a href="#" className="text-[#2980b9] hover:underline text-xs flex items-center gap-1"><span className="material-icons text-sm">download</span> Download Format</a>
                </label>
                <input type="file" name="undertakingForm" required accept=".pdf" onChange={handleChange} className="form-input" />
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
