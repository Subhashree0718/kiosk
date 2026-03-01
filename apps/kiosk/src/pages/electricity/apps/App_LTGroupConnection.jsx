import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_LTGroupConnection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('LT Group Connection Application Submitted Successfully!');
    navigate('/electricity/new-service-connection');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'New Service Connection', 'LT Group Connection']}>
      
    <KioskFormCard 
        title="LT Group Connection" 
        subtitle="Please fill out the form below to apply for an LT group connection."
        icon="groups"
        theme="purple"
    >
        <form className="kiosk-form" onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">
              {/* Section 1: Connection & Load Details */}
              <div className="col-span-2">
                <h3 className="form-section-head"><span className="material-icons">electrical_services</span> Connection & Load Details
                </h3>
              </div>

              <div>
                <label className="form-label">Total Connections Required <span className="req-star">*</span></label>
                <input type="number" name="totalConnections" required min="1" onChange={handleChange} placeholder="e.g. 10" className="form-input" />
              </div>

              <div>
                <label className="form-label">Total Load (in kW) <span className="req-star">*</span></label>
                <input type="number" name="totalLoad" required min="0.1" step="0.1" onChange={handleChange} placeholder="e.g. 50" className="form-input" />
              </div>

              <div>
                <label className="form-label">No of Connections Required on Date <span className="req-star">*</span></label>
                <input type="number" name="connectionsOnDate" required min="1" onChange={handleChange} placeholder="e.g. 5" className="form-input" />
              </div>

              <div>
                <label className="form-label">Load to be Applied (in kW) <span className="req-star">*</span></label>
                <input type="number" name="loadToBeApplied" required min="0.1" step="0.1" onChange={handleChange} placeholder="e.g. 25" className="form-input" />
              </div>

              <div>
                <label className="form-label">Proposed Service Connection in Future <span className="req-star">*</span></label>
                <input type="number" name="futureConnections" required min="0" onChange={handleChange} placeholder="e.g. 5" className="form-input" />
              </div>

              <div>
                <label className="form-label">Proposed Load (in kW) <span className="req-star">*</span></label>
                <input type="number" name="proposedLoad" required min="0" step="0.1" onChange={handleChange} placeholder="e.g. 25" className="form-input" />
              </div>

              {/* Section 2: Document Attachments */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="form-section-head"><span className="material-icons">description</span> Required Documents
                </h3>
              </div>

              <div>
                <label className="form-label">Applicant Photo <span className="req-star">*</span></label>
                <input type="file" name="applicantPhoto" required accept="image/*" onChange={handleChange} className="form-input" />
              </div>

              <div>
                <label className="form-label">Property Tax Proof <span className="req-star">*</span></label>
                <input type="file" name="propertyTaxProof" required accept=".pdf,image/*" onChange={handleChange} className="form-input" />
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
