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
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
                <div className="gov-card">
                    <div className="gov-card__header">📋 Citizen Service Request Application</div>
                    <div className="gov-card__body">
                        <div className="gov-alert gov-alert--info mb-2" style={{ fontSize: 12 }}>
                            ℹ Submit your application online. You will receive a reference number via SMS for tracking.
                        </div>
                        {error && <div className="gov-alert gov-alert--error mb-2">⚠ {error}</div>}
                        <form onSubmit={submit}>
                            <div className="gov-form-row">
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">Department <span className="gov-form-group__req">*</span></label>
                                    <select className="gov-form-group__field" value={form.dept} onChange={set('dept')} required>
                                        <option value="">-- Select --</option>
                                        {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">Service Type <span className="gov-form-group__req">*</span></label>
                                    <select className="gov-form-group__field" value={form.serviceType} onChange={set('serviceType')} required>
                                        <option value="">-- Select --</option>
                                        {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="gov-form-row">
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">Applicant Name <span className="gov-form-group__req">*</span></label>
                                    <input className="gov-form-group__field" type="text" placeholder="As per Aadhaar"
                                        value={form.name} onChange={set('name')} required />
                                </div>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">Contact Number</label>
                                    <input className="gov-form-group__field" type="tel" placeholder="10-digit mobile"
                                        value={form.phone} onChange={set('phone')} maxLength={10} />
                                </div>
                            </div>

                            <div className="gov-form-group">
                                <label className="gov-form-group__label">Address / Property Details</label>
                                <input className="gov-form-group__field" type="text" placeholder="Door No, Street, Ward"
                                    value={form.address} onChange={set('address')} />
                            </div>

                            <div className="gov-form-group">
                                <label className="gov-form-group__label">Additional Details / Remarks</label>
                                <textarea className="gov-form-group__field gov-form-group__field--textarea"
                                    placeholder="Any additional information…" rows={3}
                                    value={form.details} onChange={set('details')} />
                            </div>

                            <div className="gov-alert gov-alert--info" style={{ fontSize: 11.5, marginBottom: 14 }}>
                                📄 Declaration: I hereby declare that the information provided is true and correct to the best of my knowledge.
                            </div>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="button" className="gov-btn gov-btn--outline" onClick={() => navigate('/dashboard')}>← Back</button>
                                <button type="submit" className="gov-btn gov-btn--primary gov-btn--full" disabled={loading}>
                                    {loading ? 'Submitting Application…' : 'Submit Application →'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
