import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

const FILE_CLS = 'p-2.5 bg-gray-50 border border-gray-200 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#c0392b]/10 file:text-[#c0392b] hover:file:bg-[#c0392b]/20 file:cursor-pointer';
const INPUT_CLS = 'p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c0392b]/30 outline-none transition-all focus:bg-white w-full';

const DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Virudhunagar', 'Salem', 'Tirunelveli', 'Tiruchirappalli'];
const TALUKS = ['Sivakasi', 'Aruppukottai', 'Sattur', 'Sankarankovil', 'Rajapalayam'];
const TOWNS = ['THIRUTHANGAL', 'SIVAKASI', 'ARUPPUKOTTAI', 'SATTUR'];
const LOCALITIES = ['SENGAMALANACHIYARPURAM', 'WARD 1', 'WARD 2', 'NORTH STREET'];

export default function App_MisuseOfElectricity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ willingToGiveDetails: 'NO' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Misuse of Electricity Complaint submitted successfully. Reference number: MIS' + Math.floor(Math.random() * 1000000));
    navigate('/electricity/services-and-complaints');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Services & Complaints', 'Report Misuse of Electricity']}>
      <div className="max-w-4xl mx-auto my-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#c0392b] to-[#e74c3c] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
              <span className="material-icons" style={{ fontSize: '150px' }}>report_problem</span>
            </div>
            <h2 className="text-4xl font-extrabold relative z-10 tracking-tight">Report Misuse of Electricity</h2>
            <p className="text-lg opacity-90 mt-2 relative z-10 font-medium">Report illegal use or theft of electricity to the concerned authority.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="form-grid">

              {/* Section: Location Details */}
              <div className="col-span-2">
                <h3 className="form-section-head"><span className="material-icons">location_on</span> Location Details of Misuse
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">District <span className="req-star">*</span></label>
                <select name="district" required onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Taluk <span className="req-star">*</span></label>
                <select name="taluk" required onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Select Taluk</option>
                  {TALUKS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Town / Village <span className="req-star">*</span></label>
                <select name="town" required onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Select Town/Village</option>
                  {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Area / Locality <span className="req-star">*</span></label>
                <select name="area" required onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Select Area/Locality</option>
                  {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <label className="form-label">Exact Address <span className="req-star">*</span></label>
                <textarea name="exactAddress" required onChange={handleChange} rows="3" placeholder="Enter the exact address where misuse is occurring..." className={INPUT_CLS + ' resize-none'} />
              </div>

              {/* Section: Nature of Misuse */}
              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">bolt</span> Nature of Misuse
                </h3>
              </div>

              <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <label className="form-label">Type of Misuse <span className="req-star">*</span></label>
                <select name="misuseType" required onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Select Type</option>
                  <option value="theft">Direct Theft (Meter Bypass)</option>
                  <option value="tampering">Meter Tampering</option>
                  <option value="unauthorized">Unauthorized Connection</option>
                  <option value="commercial_as_domestic">Commercial Use Under Domestic Tariff</option>
                  <option value="agricultural_misuse">Agricultural Connection Misuse</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <label className="form-label">Detailed Description of Misuse <span className="req-star">*</span></label>
                <textarea name="natureOfMisuse" required onChange={handleChange} rows="4" placeholder="Describe the misuse in detail (estimated duration, approximate electricity load, etc.)..." className={INPUT_CLS + ' resize-none'} />
              </div>

              <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <label className="form-label">Supporting Evidence (Photo/Video/PDF)</label>
                <input type="file" name="evidence" accept=".pdf,image/*,video/*" onChange={handleChange} className={FILE_CLS} />
                <p className="text-xs text-gray-400 mt-1">Optional — Attach any photographic or documentary evidence. Max 5MB.</p>
              </div>

              {/* Section: Complainant Details */}
              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="form-section-head"><span className="material-icons">person</span> Complainant Details (Optional)
                </h3>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <label className="text-sm font-semibold text-gray-700 flex-shrink-0">Are you willing to share your details? <span className="req-star">*</span></label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input type="radio" name="willingToGiveDetails" value="YES" checked={formData.willingToGiveDetails === 'YES'} onChange={handleChange} className="w-4 h-4 accent-[#c0392b]" />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input type="radio" name="willingToGiveDetails" value="NO" checked={formData.willingToGiveDetails === 'NO'} onChange={handleChange} className="w-4 h-4 accent-[#c0392b]" />
                    No (Anonymous)
                  </label>
                </div>
              </div>

              {formData.willingToGiveDetails === 'YES' && (<>
                <div className="flex flex-col gap-2">
                  <label className="form-label">Your Name</label>
                  <input type="text" name="complainantName" onChange={handleChange} placeholder="Enter your full name" className={INPUT_CLS} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="form-label">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">phone_iphone</span>
                    <input type="tel" name="mobile" maxLength="10" pattern="[0-9]{10}" onChange={handleChange} placeholder="10-digit mobile" className={INPUT_CLS + ' pl-12'} />
                  </div>
                </div>
              </>)}

              {/* Confidentiality Notice */}
              <div className="col-span-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-yellow-800">
                  <span className="material-icons text-yellow-500 flex-shrink-0">privacy_tip</span>
                  <p className="text-sm">Your identity will be kept confidential. Complaint details will be shared only with the concerned field officer for investigation purposes.</p>
                </div>
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-submit">Submit Complaint  <span className="material-icons text-sm">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </GovLayout>
  );
}
