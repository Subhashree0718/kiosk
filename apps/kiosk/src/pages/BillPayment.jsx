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
            {/* Stepper */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, fontSize: 12 }}>
                {STEP_LABELS.map((label, i) => (
                    <div key={i} style={{
                        flex: 1, padding: '6px', textAlign: 'center', borderRadius: 2,
                        background: step > i ? 'var(--gov-success)' : step === i + 1 ? 'var(--gov-navy)' : '#e0e0e0',
                        color: step >= i + 1 ? '#fff' : '#555', fontWeight: 600,
                    }}>{step > i ? '✓ ' : `${i + 1}. `}{label}</div>
                ))}
            </div>

            <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div className="gov-card">
                    <div className="gov-card__header">
                        💡 Online Bill Payment | ऑनलाइन बिल भुगतान
                    </div>
                    <div className="gov-card__body">
                        {error && <div className="gov-alert gov-alert--error mb-2">⚠ {error}</div>}

                        {step === 1 && (
                            <form onSubmit={fetchBill}>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">Department <span className="gov-form-group__req">*</span></label>
                                    <select className="gov-form-group__field" value={dept} onChange={e => setDept(e.target.value)} required>
                                        <option value="">-- Select Department --</option>
                                        {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">Consumer / Account Number <span className="gov-form-group__req">*</span></label>
                                    <input className="gov-form-group__field" type="text" placeholder="e.g. KA-123456789"
                                        value={consumerNo} onChange={e => setConsumerNo(e.target.value)} required />
                                </div>
                                <button className="gov-btn gov-btn--primary gov-btn--full" type="submit" disabled={loading}>
                                    {loading ? 'Fetching Bill…' : 'Fetch Bill Details →'}
                                </button>
                            </form>
                        )}

                        {step === 2 && bill && (
                            <div>
                                <table className="gov-table" style={{ marginBottom: 16 }}>
                                    <tbody>
                                        <tr><td><b>Consumer Name</b></td><td>{bill.name || 'N/A'}</td></tr>
                                        <tr><td><b>Consumer No</b></td><td>{consumerNo}</td></tr>
                                        <tr><td><b>Department</b></td><td>{dept}</td></tr>
                                        <tr><td><b>Bill Amount</b></td>
                                            <td style={{ fontWeight: 700, color: 'var(--gov-navy)', fontSize: 17 }}>
                                                ₹ {bill.amount?.toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr><td><b>Due Date</b></td><td style={{ color: 'var(--gov-error)' }}>{bill.dueDate || 'N/A'}</td></tr>
                                    </tbody>
                                </table>
                                <div className="gov-alert gov-alert--info mb-2" style={{ fontSize: 12 }}>
                                    ℹ Payment will be processed securely. Please verify the details before proceeding.
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="gov-btn gov-btn--outline" onClick={() => setStep(1)}>← Back</button>
                                    <button className="gov-btn gov-btn--saffron gov-btn--full" onClick={payBill} disabled={loading}>
                                        {loading ? 'Processing Payment…' : `Pay ₹${bill.amount?.toFixed(2)} →`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="gov-card__footer" style={{ fontSize: 11.5 }}>
                        🔒 Payments are processed securely via the Government Payment Gateway (GeM)
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
