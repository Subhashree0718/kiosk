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
            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>Lodge Grievance / शिकायत दर्ज करें</div>
                    <div style={{ fontStyle: 'italic', fontSize: 24, color: '#666', marginBottom: 15 }}>सरकारी शिकायत निवारण सेवा</div>
                    <p style={{ fontSize: 20, color: '#666', fontWeight: 500 }}>
                        Submit your grievance. We will resolve it within the SLA period.
                    </p>
                </div>

                <div className="kiosk-form" style={{ maxWidth: 900 }}>
                    <div style={{
                        background: '#eff6ff', borderLeft: '10px solid #2563eb',
                        padding: '20px 25px', borderRadius: 12, color: '#1e40af',
                        marginBottom: 30, fontSize: 18, lineHeight: 1.6
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, marginBottom: 5 }}>
                            <span className="material-icons">info</span>
                            IMPORTANT INFORMATION
                        </div>
                        Under the Grievance Redressal Act, your complaint will be resolved within the SLA period.
                        You will receive an SMS with your <strong>Ticket ID</strong>.
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
                        <div className="kiosk-input-group">
                            <label className="kiosk-label">Concerned Department (संबंधित विभाग)</label>
                            <select
                                className="kiosk-input"
                                value={form.dept}
                                onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                                required
                                style={{ fontSize: 22, height: 75 }}
                            >
                                <option value="">-- Select Department / विभाग चुनें --</option>
                                {depts
                                    .filter(d => ['ELEC', 'WATER', 'GAS', 'MUNI'].includes(d.code))
                                    .map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">Detailed Description (शिकायत का विवरण)</label>
                            <textarea
                                className="kiosk-input"
                                style={{ height: 'auto', minHeight: 180, padding: '20px 30px' }}
                                placeholder="Describe your grievance in detail..."
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">Location / Address (स्थान / पता)</label>
                            <div style={{ display: 'flex', gap: 15 }}>
                                <input
                                    className="kiosk-input"
                                    style={{ flex: 1 }}
                                    type="text"
                                    placeholder="Enter Landmark / Building / Street"
                                    value={form.location}
                                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    className="kiosk-btn kiosk-btn--secondary"
                                    style={{ whiteSpace: 'nowrap', height: 75 }}
                                    onClick={getLocation}
                                    disabled={locLoading}
                                >
                                    <span className="material-icons">{locLoading ? 'sync' : 'my_location'}</span>
                                    {locLoading ? 'Wait...' : 'GPS'}
                                </button>
                            </div>
                            {form.lat && (
                                <div style={{
                                    marginTop: 12, fontSize: 16, color: '#15803d',
                                    display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600
                                }}>
                                    <span className="material-icons">check_circle</span>
                                    GPS Co-ordinates captured: {form.lat}, {form.lng}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 50, display: 'flex', gap: 20 }}>
                            <button type="button" className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>
                                <span className="material-icons">arrow_back</span>
                                BACK
                            </button>
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Complaint / शिकायत भेजें'}
                                <span className="material-icons">send</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: 30, color: '#666', fontSize: 16 }}>
                    🔒 All submissions are encrypted and forwarded to the nodal officer under IT Act, 2000.
                </div>
            </div>
        </GovLayout>
    );
}
