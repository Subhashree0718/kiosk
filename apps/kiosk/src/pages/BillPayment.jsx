import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';

const DEPTS = ['Electricity', 'Water Supply', 'Property Tax', 'Gas'];

export default function BillPayment() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [dept, setDept] = useState('');
    const [consumerNo, setConsumerNo] = useState('');
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function fetchBill(e) {
        e.preventDefault();
        if (!dept || !consumerNo) { setError('All fields are required.'); return; }
        setError(''); setLoading(true);
        try {
            const { data } = await api.get(`/payment/bill?dept=${dept}&consumerNo=${consumerNo}`);
            setBill(data); setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Consumer number not found.');
        } finally { setLoading(false); }
    }

    async function payBill() {
        setLoading(true); setError('');
        try {
            const { data } = await api.post('/payment/pay', {
                dept, consumerNo, amount: bill.amount,
            });
            navigate('/receipt', { state: { receipt: data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally { setLoading(false); }
    }

    const STEP_LABELS = ['Select Department', 'Verify Bill', 'Payment'];

    return (
        <GovLayout breadcrumbs={['Citizen Services', 'Bill Payment']}>
            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>Online Bill Payment</div>
                    <div style={{ fontStyle: 'italic', fontSize: 24, color: '#666', marginBottom: 15 }}>ऑनलाइन बिल भुगतान — सुरक्षित और सरल</div>
                    <p style={{ fontSize: 20, color: '#666', fontWeight: 500 }}>
                        Pay your electricity, water, or property tax bills instantly.
                    </p>
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', gap: 15, marginBottom: 30, maxWidth: 800, margin: '0 auto 30px' }}>
                    {STEP_LABELS.map((label, i) => (
                        <div key={i} style={{
                            flex: 1, padding: '15px', textAlign: 'center', borderRadius: 12,
                            background: step > i ? '#128807' : step === i + 1 ? 'var(--gov-navy)' : '#e0e0e0',
                            color: step >= i + 1 ? '#fff' : '#555', fontWeight: 700, fontSize: 16,
                            boxShadow: step === i + 1 ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}>
                            {step > i ? '✓ ' : `${i + 1}. `}{label}
                        </div>
                    ))}
                </div>

                <div className="kiosk-form">
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

                    {step === 1 && (
                        <form onSubmit={fetchBill}>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Select Department / विभाग चुनें</label>
                                <select className="kiosk-input" value={dept} onChange={e => setDept(e.target.value)} required>
                                    <option value="">-- Click to Select --</option>
                                    {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Consumer / Account Number (उपभोक्ता संख्या)</label>
                                <input
                                    className="kiosk-input"
                                    type="text"
                                    placeholder="Enter your Number"
                                    value={consumerNo}
                                    onChange={e => setConsumerNo(e.target.value)}
                                    required
                                />
                                <div style={{ fontSize: 14, color: '#666', marginTop: 10 }}>* Please find the number on your latest physical bill.</div>
                            </div>
                            <div style={{ marginTop: 40 }}>
                                <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} type="submit" disabled={loading}>
                                    {loading ? 'Fetching Bill...' : 'Fetch Bill Details / विवरण प्राप्त करें'}
                                    <span className="material-icons">arrow_forward</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && bill && (
                        <div style={{ textAlign: 'left' }}>
                            <div style={{
                                background: '#f8fafc', border: '4px solid #e2e8f0',
                                borderRadius: 16, padding: '30px', marginBottom: 25
                            }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 20 }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                            <td style={{ padding: '15px 0', color: '#64748b' }}>Consumer Name</td>
                                            <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>{bill.name || 'N/A'}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                            <td style={{ padding: '15px 0', color: '#64748b' }}>Account No</td>
                                            <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>{consumerNo}</td>
                                        </tr>
                                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                            <td style={{ padding: '15px 0', color: '#64748b' }}>Amount Due</td>
                                            <td style={{ padding: '15px 0', fontWeight: 800, color: '#1e40af', fontSize: 32, textAlign: 'right' }}>
                                                ₹ {bill.amount?.toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '15px 0', color: '#64748b' }}>Due Date</td>
                                            <td style={{ padding: '15px 0', fontWeight: 800, color: '#c2410c', textAlign: 'right' }}>{bill.dueDate || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{
                                background: '#f0f9ff', border: '2px solid #bae6fd',
                                padding: '15px 20px', borderRadius: 12, color: '#0369a1',
                                marginBottom: 30, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16
                            }}>
                                <span className="material-icons">info</span>
                                Verify the details. Payments once made are normally non-refundable.
                            </div>

                            <div style={{ display: 'flex', gap: 20 }}>
                                <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                                    <span className="material-icons">arrow_back</span>
                                    Back / पीछे
                                </button>
                                <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={payBill} disabled={loading}>
                                    {loading ? 'Processing...' : `Pay ₹${bill.amount?.toFixed(2)} / भुगतान करें`}
                                    <span className="material-icons">payment</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: 30, color: '#666', fontSize: 14 }}>
                    🔒 All transactions are secured with 256-bit encryption.
                </div>
            </div>
        </GovLayout>
    );
}
