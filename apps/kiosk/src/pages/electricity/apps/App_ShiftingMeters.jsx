import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_ShiftingMeters() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Shifting of Meters Application Submitted!');
    navigate('/electricity/shifting-of-services');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Shifting of Services', 'LT Shifting of Meters']}>
      
    <KioskFormCard 
        title="LT Shifting of Meters" 
        subtitle="Apply for moving or shifting of electricity meters to a different spot."
        icon="speed"
        theme="navy"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              {/* Personal Details */}
              <div className="col-span-2">
                <h3 className="form-section-head"><span className="material-icons">person</span> Applicant & Location Details
                </h3>
              </div>

              <div>
                <label className="form-label">Applicant's Name <span className="req-star">*</span></label>
                <input type="text" name="applicantName" required onChange={handleChange} placeholder="Enter full name" className="form-input" />
              </div>

              <div>
                <label className="form-label">Mobile Number <span className="req-star">*</span></label>
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
                <input type="text" name="worksInvolve" required onChange={handleChange} placeholder="Meter board shifting, wire rerouting..." className="form-input" />
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
                <label className="form-label">Identification Proof <span className="req-star">*</span></label>
                <input type="file" name="idProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
              </div>

              <div>
                <label className="form-label">White Card Document <span className="req-star">*</span></label>
                <input type="file" name="whiteCard" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
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
