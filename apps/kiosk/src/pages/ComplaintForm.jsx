import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';

export default function ComplaintForm() {
    const navigate = useNavigate();
    const [depts, setDepts] = useState([]);
    const [form, setForm] = useState({ dept: '', description: '', location: '', lat: '', lng: '' });
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/departments').then(r => setDepts(r.data.data ?? [])).catch(() => { });
    }, []);

    function getLocation() {
        if (!navigator.geolocation) { setError('Geolocation not supported.'); return; }
        setLocLoading(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
                setLocLoading(false);
            },
            () => { setError('Could not fetch location.'); setLocLoading(false); }
        );
    }

    async function submit(e) {
        e.preventDefault();
        if (!form.dept || !form.description) { setError('Department and description are required.'); return; }
        setError(''); setLoading(true);
        try {
            const { data } = await api.post('/complaints', {
                departmentId: form.dept, description: form.description,
                location: form.location, latitude: parseFloat(form.lat) || null,
                longitude: parseFloat(form.lng) || null,
            });
            navigate('/receipt', { state: { receipt: data, type: 'complaint' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally { setLoading(false); }
    }

    return (
        <GovLayout breadcrumbs={['Citizen Services', 'Lodge Complaint']}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <div className="gov-card">
                    <div className="gov-card__header">📢 Lodge Grievance / शिकायत दर्ज करें</div>
                    <div className="gov-card__body">
                        <div className="gov-alert gov-alert--info mb-2" style={{ fontSize: 12 }}>
                            ℹ Under the Grievance Redressal Act, your complaint will be resolved within the SLA period.
                            You will receive an SMS with your Ticket ID.
                        </div>
                        {error && <div className="gov-alert gov-alert--error mb-2">⚠ {error}</div>}

                        <form onSubmit={submit}>
                            <div className="gov-form-group">
                                <label className="gov-form-group__label">Concerned Department <span className="gov-form-group__req">*</span></label>
                                <select className="gov-form-group__field" value={form.dept}
                                    onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} required>
                                    <option value="">-- Select Department --</option>
                                    {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>

                            <div className="gov-form-group">
                                <label className="gov-form-group__label">Complaint Description <span className="gov-form-group__req">*</span></label>
                                <textarea className="gov-form-group__field gov-form-group__field--textarea"
                                    placeholder="Describe your grievance in detail (minimum 20 characters)…"
                                    rows={4} value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                            </div>

                            <div className="gov-form-group">
                                <label className="gov-form-group__label">Location / Address</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input className="gov-form-group__field" type="text"
                                        placeholder="Street / Ward / Landmark"
                                        value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                                    <button type="button" className="gov-btn gov-btn--outline gov-btn--sm"
                                        style={{ whiteSpace: 'nowrap' }} onClick={getLocation} disabled={locLoading}>
                                        {locLoading ? '…' : '📍 GPS'}
                                    </button>
                                </div>
                                {form.lat && (
                                    <span style={{ fontSize: 11.5, color: 'var(--gov-success)' }}>
                                        ✅ GPS captured: {form.lat}, {form.lng}
                                    </span>
                                )}
                            </div>

                            <hr className="gov-divider" />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="button" className="gov-btn gov-btn--outline" onClick={() => navigate('/dashboard')}>
                                    ← Back
                                </button>
                                <button type="submit" className="gov-btn gov-btn--primary gov-btn--full" disabled={loading}>
                                    {loading ? 'Submitting…' : 'Submit Complaint →'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="gov-card__footer" style={{ fontSize: 11.5 }}>
                        🔒 Your complaint is treated as confidential. Reference: IT Act, 2000 §43A
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
