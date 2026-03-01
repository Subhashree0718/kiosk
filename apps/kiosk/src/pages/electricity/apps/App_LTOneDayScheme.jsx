import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTOneDayScheme() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT One Day Scheme Application Submitted Successfully!');
    navigate('/electricity/new-service-connection');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'New Service Connection', 'LT One Day Service Connection Scheme']}>
      
    <KioskFormCard 
        title="LT One Day Service Connection Scheme" 
        subtitle="Please fill out the form below to apply under the one day scheme."
        icon="today"
        theme="red"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Section 1: Location Details */}
              <div className="col-span-2">
                <h3 className="form-section-head"><span className="material-icons">location_on</span> Location Details
                </h3>
              </div>

              <div>
                <label className="form-label">District <span className="req-star">*</span></label>
                <select name="district" required onChange={handleChange} className="form-input">
                  <option value="">Select District</option>
                  <option value="chennai">Chennai</option>
                  <option value="coimbatore">Coimbatore</option>
                  <option value="madurai">Madurai</option>
                </select>
              </div>

              <div>
                <label className="form-label">Taluk <span className="req-star">*</span></label>
                <select name="taluk" required onChange={handleChange} className="form-input">
                  <option value="">Select Taluk</option>
                  <option value="t1">Taluk 1</option>
                  <option value="t2">Taluk 2</option>
                </select>
              </div>

              <div>
                <label className="form-label">Town / Village <span className="req-star">*</span></label>
                <input type="text" name="townVillage" required onChange={handleChange} placeholder="Enter Town/Village" className="form-input" />
              </div>

              <div>
                <label className="form-label">Area / Locality <span className="req-star">*</span></label>
                <input type="text" name="areaLocality" required onChange={handleChange} placeholder="Enter Area/Locality" className="form-input" />
              </div>

              {/* Section 2: Applicant & Property Details */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="form-section-head"><span className="material-icons">person</span> Applicant & Property Details
                </h3>
              </div>

              <div>
                <label className="form-label">Applicant's Category <span className="req-star">*</span></label>
                <select name="applicantCategory" required onChange={handleChange} className="form-input">
                  <option value="">Select Category</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="trust">Trust</option>
                </select>
              </div>

              <div>
                <label className="form-label">Ownership Details <span className="req-star">*</span></label>
                <select name="ownership" required onChange={handleChange} className="form-input">
                  <option value="">Select Ownership</option>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                  <option value="lessee">Lessee</option>
                </select>
              </div>

              <div>
                <label className="form-label">Building Type <span className="req-star">*</span></label>
                <select name="buildingType" required onChange={handleChange} className="form-input">
                  <option value="">Select Building Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="form-label">Applicant GST Number (If applicable)</label>
                <input type="text" name="gst" onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" className="form-input" />
              </div>

              {/* Section 3: Technical Details */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="form-section-head"><span className="material-icons">electrical_services</span> Technical Details
                </h3>
              </div>

              <div>
                <label className="form-label">Tariff <span className="req-star">*</span></label>
                <select name="tariff" required onChange={handleChange} className="form-input">
                  <option value="">Select Tariff</option>
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="form-label">Sub Category Under Tariff <span className="req-star">*</span></label>
                <select name="subTariff" required onChange={handleChange} className="form-input">
                  <option value="">Select Sub Category</option>
                  <option value="1a">1A - Domestic</option>
                  <option value="2b">2B - recognized Institutions</option>
                </select>
              </div>

              <div>
                <label className="form-label">Type of Supply <span className="req-star">*</span></label>
                <select name="supplyType" required onChange={handleChange} className="form-input">
                  <option value="">Select Supply Phase</option>
                  <option value="1phase">1 Phase</option>
                  <option value="3phase">3 Phase</option>
                </select>
              </div>

              <div>
                <label className="form-label">Wiring Completed Date <span className="req-star">*</span></label>
                <input type="date" name="wiringDate" required onChange={handleChange} className="form-input" />
              </div>

              <div className="col-span-2">
                <label className="form-label">Whether installation provided with earth protection rod? <span className="req-star">*</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="earthProtection" value="yes" required onChange={handleChange} className="w-5 h-5 text-[#e74c3c] border-gray-300 focus:ring-[#e74c3c] cursor-pointer" />
                    Yes
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="earthProtection" value="no" onChange={handleChange} className="w-5 h-5 text-[#e74c3c] border-gray-300 focus:ring-[#e74c3c] cursor-pointer" />
                    No
                  </label>
                </div>
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
