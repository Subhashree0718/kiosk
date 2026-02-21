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
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div className="gov-card" id="receipt-card">
                    {/* Official header band */}
                    <div style={{
                        background: 'var(--gov-navy)', color: '#fff',
                        textAlign: 'center', padding: '14px 16px',
                        borderLeft: '4px solid var(--gov-saffron)',
                    }}>
                        <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 2 }}>
                            GOVERNMENT OF INDIA — SUVIDHA KIOSK INITIATIVE
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>
                            {titles[type] || '📄 Transaction Receipt'}
                        </div>
                    </div>

                    <div className="gov-card__body">
                        {/* Success Banner */}
                        <div style={{
                            background: '#eaf7ea', border: '1px solid #82e0aa',
                            borderRadius: 4, padding: '12px 16px', marginBottom: 16, textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 2 + 'rem', marginBottom: 6 }}>✅</div>
                            <div style={{ fontWeight: 700, color: 'var(--gov-success)', fontSize: 15 }}>
                                {type === 'payment' ? 'Payment Successful!' : 'Submitted Successfully!'}
                            </div>
                            {receipt.ticketId && (
                                <div className="mt-1">
                                    <div style={{ fontSize: 12, color: 'var(--gov-text-muted)', marginBottom: 6 }}>Your Reference / Ticket ID</div>
                                    <span className="gov-ticket-id">{receipt.ticketId}</span>
                                    <div style={{ fontSize: 11, marginTop: 6, color: 'var(--gov-text-muted)' }}>
                                        Please save this ID for future reference. An SMS has been sent to your mobile.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details table */}
                        <table className="gov-table" style={{ marginBottom: 16 }}>
                            <tbody>
                                {receipt.ticketId && <tr><td><b>Reference No.</b></td><td><code>{receipt.ticketId}</code></td></tr>}
                                {receipt.transactionId && <tr><td><b>Transaction ID</b></td><td><code>{receipt.transactionId}</code></td></tr>}
                                {receipt.department && <tr><td><b>Department</b></td><td>{receipt.department}</td></tr>}
                                {receipt.consumerNo && <tr><td><b>Consumer No.</b></td><td>{receipt.consumerNo}</td></tr>}
                                {receipt.amountPaid && (
                                    <tr>
                                        <td><b>Amount Paid</b></td>
                                        <td style={{ fontWeight: 700, color: 'var(--gov-navy)', fontSize: 16 }}>
                                            ₹ {Number(receipt.amountPaid).toFixed(2)}
                                        </td>
                                    </tr>
                                )}
                                {receipt.createdAt && (
                                    <tr>
                                        <td><b>Date & Time</b></td>
                                        <td>{new Date(receipt.createdAt).toLocaleString('en-IN')}</td>
                                    </tr>
                                )}
                                <tr><td><b>Status</b></td>
                                    <td><span className="gov-badge gov-badge--resolved">Successful</span></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="gov-alert gov-alert--info" style={{ fontSize: 11.5, marginBottom: 14 }}>
                            ℹ This is a computer-generated receipt. No signature is required.
                            This receipt is valid as per the Information Technology Act, 2000.
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button className="gov-btn gov-btn--outline" onClick={() => window.print()}>
                                🖨 Print Receipt
                            </button>
                            <button className="gov-btn gov-btn--primary gov-btn--full" onClick={() => navigate('/dashboard')}>
                                ← Back to Services
                            </button>
                        </div>
                    </div>

                    {/* Official footer */}
                    <div style={{
                        background: '#f8f9fa', borderTop: '1px solid var(--gov-border)',
                        padding: '10px 16px', fontSize: 11, color: 'var(--gov-text-muted)', textAlign: 'center'
                    }}>
                        SUVIDHA Kiosk | Powered by Digital India Initiative | Govt. of India
                    </div>
                </div>
            </div>
        </GovLayout>
    );
}
