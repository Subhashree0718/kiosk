import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { wSubmitComplaint, wGetComplaintStatus } from '../services/waterApi.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

export default function WaterComplaints() {
    const navigate = useNavigate();
    const [mode, setMode] = useState(null); // 'register' | 'check'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    // Form states
    const [propertyId, setPropertyId] = useState('');
    const [mobile, setMobile] = useState('');
    const [description, setDescription] = useState('');
    const [complaintId, setComplaintId] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!propertyId || !mobile || !description) {
            setError('Please fill in all required fields | कृपया सभी आवश्यक जानकारी भरें।');
            return;
        }
        setLoading(true);
        try {
            const { data } = await wSubmitComplaint({ propertyId, mobile, description });
            setResult({ type: 'success', id: data.complaintId, msg: 'Complaint registered successfully!' });
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        setError('');
        if (!complaintId) {
            setError('Please enter a Complaint ID | कृपया शिकायत संख्या दर्ज करें।');
            return;
        }
        setLoading(true);
        try {
            const { data } = await wGetComplaintStatus(complaintId);
            setResult({ type: 'status', data: data.data || data });
        } catch (err) {
            setError(err.message || 'Complaint not found.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setMode(null);
        setResult(null);
        setError('');
        setPropertyId('');
        setMobile('');
        setDescription('');
        setComplaintId('');
    };

    return (
        <GovLayout breadcrumbs={['Departments', 'Water Supply Board', 'Complaints']}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <Icon name="report_problem" size={50} color="#fff" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">शिकायत पंजीकरण एवं ट्रैकिंग</div>
                    <div className="kiosk-gov-text-en">Grievance Registration & Tracking</div>
                </div>
            </div>

            <div className="kiosk-container">

                {!mode && (
                    <div className="kiosk-grid" style={{ marginTop: 40 }}>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid #e67e22' }} onClick={() => setMode('register')}>
                            <Icon name="add_task" size={80} color="#e67e22" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">नई शिकायत</span>
                                Register New
                            </div>
                            <div className="kiosk-tile__desc">Report leakage, supply pipe damage, or water quality issues.</div>
                        </div>
                        <div className="kiosk-tile" style={{ borderTop: '8px solid var(--gov-navy)' }} onClick={() => setMode('check')}>
                            <Icon name="fact_check" size={80} color="var(--gov-navy)" />
                            <div className="kiosk-tile__label">
                                <span className="kiosk-gov-tile-hi">स्थिति जाँचें</span>
                                Check Status
                            </div>
                            <div className="kiosk-tile__desc">Enter your Complaint ID to track progress and view remarks.</div>
                        </div>
                    </div>
                )}

                {mode === 'register' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ fontSize: 28, marginBottom: 30, color: 'var(--gov-navy)', textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block', fontSize: 32 }}>नई शिकायत पंजीकरण</span>
                            New Complaint Registration
                        </h2>

                        {error && (
                            <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, marginBottom: 25 }}>
                                <Icon name="error" size={24} style={{ marginRight: 10 }} /> {error}
                            </div>
                        )}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">संपत्ति आईडी / उपभोक्ता संख्या</span>
                                Property ID / Consumer ID <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input className="kiosk-input" type="text" placeholder="Enter ID" value={propertyId} onChange={e => setPropertyId(e.target.value)} />
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">मोबाइल नंबर</span>
                                Mobile Number <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input className="kiosk-input" type="tel" maxLength={10} placeholder="10-digit mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
                        </div>

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">शिकायत का विवरण</span>
                                Complaint Description <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea className="kiosk-input" style={{ height: 120, paddingTop: 15 }} placeholder="Describe the issue..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">रद्द करें</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>CANCEL</div>
                                </div>
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleRegister} disabled={loading}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'जमा हो रहा है...' : 'शिकायत दर्ज करें'}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>REGISTER COMPLAINT</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'check' && !result && (
                    <div className="kiosk-form kiosk-gov-card">
                        <h2 style={{ fontSize: 28, marginBottom: 30, color: 'var(--gov-navy)', textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block', fontSize: 32 }}>शिकायत की स्थिति</span>
                            Check Complaint Status
                        </h2>

                        {error && (
                            <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, marginBottom: 25 }}>
                                <Icon name="error" size={24} style={{ marginRight: 10 }} /> {error}
                            </div>
                        )}

                        <div className="kiosk-input-group">
                            <label className="kiosk-label">
                                <span className="kiosk-gov-label-hi">शिकायत संख्या</span>
                                Complaint ID
                            </label>
                            <input className="kiosk-input" type="text" placeholder="e.g. COMP-XXXXXX" value={complaintId} onChange={e => setComplaintId(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={reset}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">वापस</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>BACK</div>
                                </div>
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handleCheck} disabled={loading}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'खोज रहे हैं...' : 'स्थिति जाँचें'}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>CHECK STATUS</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {result && result.type === 'success' && (
                    <div className="kiosk-form kiosk-gov-card" style={{ textAlign: 'center' }}>
                        <Icon name="check_circle" size={100} color="var(--gov-green)" />
                        <h2 style={{ fontSize: 36, margin: '20px 0', color: 'var(--gov-green)' }}>
                            <span style={{ fontFamily: 'Noto Sans Devanagari', display: 'block' }}>सफल!</span>
                            Success!
                        </h2>
                        <p style={{ fontSize: 22, marginBottom: 30 }}>Complaint registered successfully | शिकायत सफलतापूर्वक दर्ज की गई।</p>

                        <div style={{ background: '#f8f9fa', padding: 30, borderRadius: 15, marginBottom: 30, border: '2px solid #ddd' }}>
                            <div style={{ fontSize: 16, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Your Complaint ID / आपकी शिकायत संख्या</div>
                            <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--gov-navy)', marginTop: 10 }}>{result.id}</div>
                        </div>

                        <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={reset}>
                            <span className="kiosk-gov-btn-hi">पूर्ण (समाप्त)</span> | DONE
                        </button>
                    </div>
                )}

                {result && result.type === 'status' && (
                    <div className="kiosk-card kiosk-gov-card">
                        <div className="kiosk-card__header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
                            <span>शिकायत विवरण | Complaint Details</span>
                            <span>{result.data.complaintId}</span>
                        </div>
                        <div className="kiosk-card__body">
                            <table className="kiosk-result-table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">स्थिति</span>
                                            Status
                                        </td>
                                        <td><span className="gov-badge gov-badge--info" style={{ fontSize: 22, padding: '8px 20px' }}>{result.data.status}</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">संपत्ति आईडी</span>
                                            Property ID
                                        </td>
                                        <td>{result.data.propertyId}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">विवरण</span>
                                            Description
                                        </td>
                                        <td>{result.data.description}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="kiosk-gov-label-hi">टिप्पणी</span>
                                            Remarks
                                        </td>
                                        <td>{result.data.remarks || 'No remarks recorded yet.'}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', marginTop: 30 }} onClick={reset}>
                                <span className="kiosk-gov-btn-hi">मुख्य मेनू पर वापस जाएं</span> | BACK TO MENU
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60 }} onClick={() => navigate('/water')}>
                        <Icon name="home" size={24} color="#fff" /> EXIT BOARD | बाहर निकलें
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
