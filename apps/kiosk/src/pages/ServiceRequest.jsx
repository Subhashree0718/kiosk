import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';

const SERVICE_TYPES = [
    'New Electricity Connection',
    'New Water Connection',
    'Birth Certificate',
    'Death Certificate',
    'Trade License',
    'Building Plan Approval',
    'Property Tax Registration',
    'Other',
];

export default function ServiceRequest() {
    const navigate = useNavigate();
    const [depts, setDepts] = useState([]);
    const [form, setForm] = useState({ dept: '', serviceType: '', name: '', address: '', phone: '', details: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/departments').then(r => setDepts(r.data.data ?? [])).catch(() => { });
    }, []);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    async function submit(e) {
        e.preventDefault();
        if (!form.dept || !form.serviceType || !form.name) {
            setError('Department, Service Type and Applicant Name are required.');
            return;
        }
        setError(''); setLoading(true);
        try {
            const { data } = await api.post('/service-requests', {
                departmentId: form.dept, serviceType: form.serviceType,
                formData: { name: form.name, address: form.address, phone: form.phone, details: form.details },
            });
            navigate('/receipt', { state: { receipt: data, type: 'service' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally { setLoading(false); }
    }

    return (
        <GovLayout breadcrumbs={['Citizen Services', 'Service Request']}>
            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>Service Application / सेवा आवेदन</div>
                    <div style={{ fontStyle: 'italic', fontSize: 24, color: '#666', marginBottom: 15 }}>नागरिक सेवा अनुरोध पत्र</div>
                    <p style={{ fontSize: 20, color: '#666', fontWeight: 500 }}>
                        Apply for new connections, certificates, and other municipal services.
                    </p>
                </div>

                <div className="kiosk-form" style={{ maxWidth: 1000 }}>
                    <div style={{
                        background: '#f0fdf4', borderLeft: '10px solid #16a34a',
                        padding: '20px 25px', borderRadius: 12, color: '#166534',
                        marginBottom: 30, fontSize: 18, lineHeight: 1.6
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, marginBottom: 5 }}>
                            <span className="material-icons">info</span>
                            PROCESS INFORMATION
                        </div>
                        Submit your application online. You will receive a reference number via SMS for tracking.
                        Please ensure all details match your official documents.
                    </div>

                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '2px solid #ef4444',
                            padding: '15px 20px', borderRadius: 12, color: '#b91c1c',
                            marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 600
                        }}>
                            <span className="material-icons">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Concerned Department (विभाग)</label>
                                <select className="kiosk-input" value={form.dept} onChange={set('dept')} required>
                                    <option value="">-- Select --</option>
                                    {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Service Type (सेवा का प्रकार)</label>
                                <select className="kiosk-input" value={form.serviceType} onChange={set('serviceType')} required>
                                    <option value="">-- Select --</option>
                                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Applicant Name (आवेदक का नाम)</label>
                                <input className="kiosk-input" type="text" placeholder="As per Aadhaar"
                                    value={form.name} onChange={set('name')} required />
                            </div>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Contact Number (संपर्क नंबर)</label>
                                <input className="kiosk-input" type="tel" placeholder="10-digit mobile"
                                    value={form.phone} onChange={set('phone')} maxLength={10} />
                            </div>
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">Address / Property Details (पता / संपत्ति का विवरण)</label>
                            <input className="kiosk-input" type="text" placeholder="Door No, Street, Ward, Landmark"
                                value={form.address} onChange={set('address')} />
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">Additional Details / Remarks (अतिरिक्त विवरण)</label>
                            <textarea className="kiosk-input" style={{ height: 'auto', minHeight: 120, padding: '20px 30px' }}
                                placeholder="Any additional information..."
                                value={form.details} onChange={set('details')} />
                        </div>

                        <div style={{
                            background: '#fff7ed', border: '1px solid #fed7aa',
                            padding: '15px 20px', borderRadius: 12, color: '#9a3412',
                            marginBottom: 40, fontSize: 16, display: 'flex', alignItems: 'flex-start', gap: 10
                        }}>
                            <span className="material-icons" style={{ fontSize: 20, marginTop: 2 }}>verified</span>
                            <span><strong>Declaration:</strong> I hereby declare that the information provided is true and correct to the best of my knowledge. Misrepresentation of facts is a punishable offense.</span>
                        </div>

                        <div style={{ display: 'flex', gap: 20 }}>
                            <button type="button" className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>
                                <span className="material-icons">arrow_back</span>
                                BACK
                            </button>
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} disabled={loading}>
                                {loading ? 'Processing...' : 'Submit Application / आवेदन जमा करें'}
                                <span className="material-icons">fact_check</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: 30, color: '#666', fontSize: 16 }}>
                    📄 All applications are processed as per the Citizens Charter of the respective department.
                </div>
            </div>
        </GovLayout>
    );
}
