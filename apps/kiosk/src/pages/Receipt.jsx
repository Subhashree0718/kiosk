import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

export default function Receipt() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const receipt = state?.receipt || {};
    const type = state?.type || 'payment';

    const titles = {
        payment: '💳 Payment Receipt (Official)',
        complaint: '📨 Complaint Acknowledgement',
        service: '📋 Service Request Acknowledgement',
    };

    return (
        <GovLayout breadcrumbs={['Services', 'Receipt / Acknowledgement']}>
            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 36 }}>{titles[type]?.replace(/💳 |📨 |📋 /, '') || 'Transaction Receipt'}</div>
                    <div style={{ fontStyle: 'italic', fontSize: 24, color: '#666', marginBottom: 15 }}>आधिकारिक पावती / रसीद</div>
                    <p style={{ fontSize: 20, color: '#666', fontWeight: 500 }}>
                        Thank you for using SUVIDHA Kiosk. Your request has been processed.
                    </p>
                </div>

                <div className="kiosk-form" style={{ maxWidth: 850, textAlign: 'center' }}>

                    {/* Success Icon & Message */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{
                            width: 120, height: 120, background: '#dcfce7', color: '#166534',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', fontSize: 60
                        }}>
                            <span className="material-icons" style={{ fontSize: 80 }}>check_circle</span>
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: '#166534' }}>
                            {type === 'payment' ? 'Payment Successful!' : 'Submitted Successfully!'}
                        </div>
                        <div style={{ fontSize: 20, color: '#666', marginTop: 5 }}>सफलतापूर्वक जमा किया गया</div>
                    </div>

                    {receipt.ticketId && (
                        <div style={{
                            background: 'var(--gov-navy)', color: '#fff',
                            padding: '30px', borderRadius: 20, marginBottom: 35,
                            boxShadow: '0 10px 25px rgba(0,33,71,0.2)'
                        }}>
                            <div style={{ fontSize: 16, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
                                Reference / Ticket ID
                            </div>
                            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: 3, fontFamily: 'monospace' }}>
                                {receipt.ticketId}
                            </div>
                            <div style={{ fontSize: 16, marginTop: 15, opacity: 0.9 }}>
                                * Please keep this ID for tracking. An SMS has been sent.
                            </div>
                        </div>
                    )}

                    <div style={{
                        background: '#f8fafc', border: '3px solid #e2e8f0',
                        borderRadius: 16, padding: '30px', marginBottom: 35, textAlign: 'left'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 20 }}>
                            <tbody>
                                {receipt.transactionId && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Transaction ID</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right', fontFamily: 'monospace' }}>{receipt.transactionId}</td>
                                    </tr>
                                )}
                                {receipt.department && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Department</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>{receipt.department}</td>
                                    </tr>
                                )}
                                {receipt.consumerNo && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Consumer No.</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>{receipt.consumerNo}</td>
                                    </tr>
                                )}
                                {receipt.amountPaid && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Amount Paid</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, color: 'var(--gov-navy)', fontSize: 32, textAlign: 'right' }}>
                                            ₹ {Number(receipt.amountPaid).toFixed(2)}
                                        </td>
                                    </tr>
                                )}
                                {receipt.createdAt && (
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b' }}>Date & Time</td>
                                        <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>
                                            {new Date(receipt.createdAt).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td style={{ padding: '15px 0', color: '#64748b' }}>Status</td>
                                    <td style={{ padding: '15px 0', fontWeight: 800, textAlign: 'right' }}>
                                        <span className="gov-badge gov-badge--resolved" style={{ fontSize: 18, padding: '8px 20px' }}>SUCCESSFUL</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        background: '#eff6ff', border: '1px solid #bfdbfe',
                        padding: '15px 20px', borderRadius: 12, color: '#1e40af',
                        marginBottom: 40, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10
                    }}>
                        <span className="material-icons">verified</span>
                        This is a computer-generated receipt valid as per Information Technology Act, 2000.
                    </div>

                    <div style={{ display: 'flex', gap: 20 }}>
                        <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => window.print()}>
                            <span className="material-icons">print</span>
                            PRINT / प्रिंट
                        </button>
                        <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={() => navigate('/dashboard')}>
                            <span className="material-icons">home</span>
                            DONE / पूर्ण
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 30, color: '#666', fontSize: 16 }}>
                    🏢 SUVIDHA Kiosk Initiative | Powered by Digital India
                </div>
            </div>
        </GovLayout>
    );
}
