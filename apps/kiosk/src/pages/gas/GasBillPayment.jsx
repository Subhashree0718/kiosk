import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#2980b9';
const inputStyle = { width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' };
const labelStyle = { display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 };

export default function GasBillPayment() {
    const navigate = useNavigate();
    const { t } = useT();
    const [lpgId, setLpgId] = useState('');
    const [fetched, setFetched] = useState(false);
    const [paid, setPaid] = useState(false);
    const [paymentMode, setPaymentMode] = useState('upi');
    const req = <span style={{ color: '#c0392b' }}>*</span>;

    if (paid) {
        return (
            <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Bill & Payment', 'बिल और भुगतान')]}>
                <div className="kiosk-gov-strip"></div>
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Icon name="check_circle" size={64} color="#27ae60" />
                    </div>
                    <h2 style={{ fontSize: 32, color: 'var(--gov-navy)', marginBottom: 12 }}>{t('Payment Successful!', 'भुगतान सफल!')}</h2>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Transaction ID:', 'लेनदेन आईडी:')} <strong style={{ color: COLOR }}>TXN-{Math.random().toString(36).substr(2, 10).toUpperCase()}</strong></p>
                    <p style={{ fontSize: 16, color: '#888' }}>{t('Receipt sent to registered mobile', 'रसीद पंजीकृत मोबाइल पर भेजी गई')}</p>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60, padding: '0 40px', marginTop: 36 }} onClick={() => navigate('/gas')}>
                        {t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </GovLayout>
        );
    }

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Bill & Payment', 'बिल और भुगतान')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">गैस बिल और भुगतान</div>
                    <div className="kiosk-gov-text-en">Gas Bill & Payment</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('View and pay your gas bills', 'अपने गैस बिल देखें और भुगतान करें')}</div>
                </div>
            </div>
            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('Bill Payment', 'बिल भुगतान')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Enter your LPG ID to view bills', 'बिल देखने के लिए अपना एलपीजी आईडी दर्ज करें')}</p>
                </div>

                <div className="gov-card" style={{ maxWidth: 720, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="receipt_long" size={18} color="#fff" style={{ marginRight: 8 }} />{t('Fetch Bill', 'बिल प्राप्त करें')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={e => { e.preventDefault(); setFetched(true); }} style={{ display: 'flex', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>{t('LPG ID / Consumer Number', 'एलपीजी आईडी / उपभोक्ता संख्या')} {req}</label>
                                <input type="text" value={lpgId} onChange={e => setLpgId(e.target.value)} placeholder={t('Enter LPG ID', 'एलपीजी आईडी दर्ज करें')} required style={inputStyle} />
                            </div>
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ height: 52, padding: '0 32px', fontSize: 16, alignSelf: 'flex-end' }}>
                                <Icon name="search" size={20} color="#fff" style={{ marginRight: 6 }} />{t('FETCH', 'खोजें')}
                            </button>
                        </form>
                    </div>
                </div>

                {fetched && (
                    <div className="gov-card" style={{ maxWidth: 720, margin: '24px auto 0' }}>
                        <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                            <Icon name="payments" size={18} color="#fff" style={{ marginRight: 8 }} />{t('Bill Summary', 'बिल सारांश')}
                        </div>
                        <div className="gov-card__body" style={{ padding: 28 }}>
                            <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                                {[
                                    { label: t('Consumer Name', 'उपभोक्ता नाम'), value: 'Rajesh Kumar', icon: 'person' },
                                    { label: t('Bill Period', 'बिल अवधि'), value: 'Jan 2026 - Feb 2026', icon: 'date_range' },
                                    { label: t('Amount Due', 'देय राशि'), value: '₹ 1,053.50', icon: 'currency_rupee', highlight: true },
                                    { label: t('Due Date', 'देय तिथि'), value: '15 Mar 2026', icon: 'event' },
                                    { label: t('Last Payment', 'अंतिम भुगतान'), value: '₹ 989.00 on 12 Jan 2026', icon: 'history' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 4 ? '1px solid #e8e8e8' : 'none' }}>
                                        <Icon name={item.icon} size={22} color={COLOR} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, color: '#888' }}>{item.label}</div>
                                            <div style={{ fontSize: item.highlight ? 22 : 17, fontWeight: 700, color: item.highlight ? '#c0392b' : 'var(--gov-navy)' }}>{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>{t('Payment Mode', 'भुगतान मोड')} {req}</label>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {[
                                        { value: 'upi', label: 'UPI', icon: 'qr_code' },
                                        { value: 'card', label: t('Card', 'कार्ड'), icon: 'credit_card' },
                                        { value: 'netbanking', label: t('Net Banking', 'नेट बैंकिंग'), icon: 'account_balance' },
                                    ].map(pm => (
                                        <label key={pm.value} style={{
                                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                                            border: paymentMode === pm.value ? `2px solid ${COLOR}` : '2px solid #ddd',
                                            borderRadius: 10, cursor: 'pointer',
                                            background: paymentMode === pm.value ? COLOR + '10' : '#fff',
                                        }}>
                                            <input type="radio" name="payMode" value={pm.value} checked={paymentMode === pm.value}
                                                onChange={() => setPaymentMode(pm.value)} style={{ display: 'none' }} />
                                            <Icon name={pm.icon} size={20} color={paymentMode === pm.value ? COLOR : '#888'} />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: paymentMode === pm.value ? COLOR : '#555' }}>{pm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 60, fontSize: 18 }} onClick={() => setPaid(true)}>
                                <Icon name="payments" size={22} color="#fff" style={{ marginRight: 8 }} />{t('PAY ₹ 1,053.50', '₹ 1,053.50 भुगतान करें')}
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 70, padding: '0 50px' }} onClick={() => navigate('/gas')}>
                        <Icon name="arrow_back" size={26} color="#fff" />&nbsp;&nbsp;{t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
