import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../../components/GovLayout.jsx';
import KioskFormCard from '../../../components/KioskFormCard.jsx';

const INPUT_CLS = 'p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a5276]/30 outline-none transition-all focus:bg-white w-full';

export default function App_ConsumerComplaints() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const [lat, setLat] = useState('12.971273');
  const [lng, setLng] = useState('80.043253');
  const [showInfo, setShowInfo] = useState(false);
  const [contactMobile, setContactMobile] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapInstance.current && mapRef.current && window.L) {
        mapInstance.current = window.L.map(mapRef.current).setView([12.971273, 80.043253], 15);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        const customIcon = window.L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        });

        markerRef.current = window.L.marker([12.971273, 80.043253], { draggable: true, icon: customIcon }).addTo(mapInstance.current);
        markerRef.current.on('dragend', () => {
          const p = markerRef.current.getLatLng();
          setLat(p.lat.toFixed(6)); setLng(p.lng.toFixed(6)); setShowInfo(false);
        });
        mapInstance.current.on('click', (e) => {
          markerRef.current.setLatLng(e.latlng);
          setLat(e.latlng.lat.toFixed(6)); setLng(e.latlng.lng.toFixed(6)); setShowInfo(false);
        });
        setTimeout(() => mapInstance.current.invalidateSize(), 500);
      }
    };

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else { initMap(); }

    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  const handleSave = () => {
    if (!contactMobile || !subCategory || !complaintDetails || !serviceAddress) {
      alert('Please fill in all required fields: Contact Mobile, Sub Category, Complaint Details, and Service Address.');
      return;
    }
    alert('Power Failure Complaint registered successfully!\nReference: PF' + Math.floor(Math.random() * 1000000));
    navigate('/electricity/services-and-complaints');
  };

  return (
    <GovLayout breadcrumbs={['Departments', 'Electricity', 'Services & Complaints', 'Consumer Complaints']}>
      <div className="max-w-5xl mx-auto my-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2980b9] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
              <span className="material-icons" style={{ fontSize: '150px' }}>bolt</span>
            </div>
            <h2 className="text-4xl font-extrabold relative z-10 tracking-tight">File a Power Failure Complaint</h2>
            <p className="text-lg opacity-90 mt-2 relative z-10 font-medium">Report electricity outages, sparks, line snaps, or supply issues in your area.</p>
          </div>

          <div className="p-8">

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3 text-blue-800">
              <span className="material-icons text-blue-500 flex-shrink-0 text-xl">info</span>
              <p className="text-sm leading-relaxed">Select the location of your complaint on the map below (click or drag the pin), then click <strong>Get Info</strong> to identify the responsible section office before submitting.</p>
            </div>

            {/* Map Section */}
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 mb-6 relative" style={{ height: '280px' }}>
              <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            </div>

            {/* Coordinates Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <span className="material-icons text-gray-400 text-base">my_location</span>
                <span className="font-mono text-sm font-bold text-gray-600">{lat}, {lng}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1a3a5c] to-[#2980b9] text-white font-bold rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-icons text-base">search</span> Get Info
              </button>
              {!showInfo && <span className="text-xs text-gray-400 italic">Click or drag pin on map, then click Get Info</span>}
            </div>

            {/* Office Info Card */}
            {showInfo && (
              <div className="mb-6 bg-teal-50 border border-teal-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#16a085] to-[#1abc9c] px-4 py-2.5 text-white font-bold text-sm">
                  Responsible Office Details
                </div>
                <div className="grid grid-cols-3 divide-x divide-teal-200 text-sm">
                  {[['Section Office', 'SOMANGALAM'], ['Mobile', '9445850279'], ['Email', 'chs266ae@tnebnet.org']].map(([k, v]) => (
                    <div key={k} className="p-3">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{k}</div>
                      <div className="font-semibold text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaint Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <label className="form-label">Complaint Category <span className="req-star">*</span></label>
                <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className={INPUT_CLS}>
                  <option value="">Select Category...</option>
                  <option value="line_snap">Line Snap</option>
                  <option value="spark">Spark / Fire</option>
                  <option value="no_power">No Power Supply</option>
                  <option value="fluctuation">Voltage Fluctuation</option>
                  <option value="transformer">Transformer Failure</option>
                  <option value="pole_damage">Pole / Cable Damage</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="form-label">Contact Mobile Number <span className="req-star">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 material-icons">phone_iphone</span>
                  <input type="tel" maxLength="10" placeholder="10-digit mobile" value={contactMobile} onChange={e => setContactMobile(e.target.value)} className={INPUT_CLS + ' pl-12'} />
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                  <span>Complaint Details <span className="req-star">*</span></span>
                  <span className="font-normal text-gray-400 text-xs">{250 - complaintDetails.length} chars left</span>
                </label>
                <textarea maxLength="250" rows="4" value={complaintDetails} onChange={e => setComplaintDetails(e.target.value)} placeholder="Describe the issue clearly..." className={INPUT_CLS + ' resize-none'} />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                  <span>Service Address <span className="req-star">*</span></span>
                  <span className="font-normal text-gray-400 text-xs">{250 - serviceAddress.length} chars left</span>
                </label>
                <textarea maxLength="250" rows="3" value={serviceAddress} onChange={e => setServiceAddress(e.target.value)} placeholder="Full address where the complaint applies..." className={INPUT_CLS + ' resize-none'} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                  <span>Landmark (Optional)</span>
                  <span className="font-normal text-gray-400 text-xs">{50 - landmark.length} chars left</span>
                </label>
                <input type="text" maxLength="50" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="Near school, temple, etc." className={INPUT_CLS} />
              </div>

            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Cancel</button>
              <button type="button" onClick={handleSave} className="btn-submit">Submit Complaint  <span className="material-icons text-sm">send</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </GovLayout>
  );
}
