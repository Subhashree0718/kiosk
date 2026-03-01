import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

export default function App_GiveFeedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! (Mobile: ' + formData.mobile + ')');
    navigate('/electricity/lt-application-tracking');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Tracking', 'Give Feedback']}>
      
    <KioskFormCard 
        title="Give Feedback" 
        subtitle="Please let us know how we can improve our services."
        icon="feedback"
        theme="blue"
    >
        <form className="kiosk-form p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              <div>
                <label className="form-label">Applicant's Mobile Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">phone_iphone</span>
                  <input type="tel" pattern="[0-9]{10}" name="mobile" required onChange={handleChange} placeholder="10-digit mobile number" className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4db] outline-none transition-all flex-[1] focus:bg-white text-lg font-medium" />
                </div>
              </div>

              <div>
                <label className="form-label">Feedback <span className="req-star">*</span></label>
                <textarea name="feedbackText" required onChange={handleChange} rows="5" placeholder="Write your feedback here..." className="form-input"></textarea>
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Feedback  <span className="material-icons text-sm">send</span>
              </button>
            </div>
          </form>
    </KioskFormCard>
    </GovLayout>
  );
}
