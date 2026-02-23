import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import {
    wSendOtp, wVerifyOtp, wRegister, wLogin,
    wFetchBill, wQuickPay, wFindProperty,
} from '../services/waterApi.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const KIOSK_SERVICES = [
    { id: 'pay', label: 'Quick Pay', labelHi: 'त्वरित भुगतान', icon: 'payments', color: '#27ae60', desc: 'Pay your water bill instantly using Property ID' },
    { id: 'find', label: 'Find Property', labelHi: 'संपत्ति खोजें', icon: 'search', color: '#2980b9', desc: 'Search for your Property ID by address or mobile' },
    { id: 'reg', label: 'Registration', labelHi: 'पंजीकरण', icon: 'how_to_reg', color: '#e67e22', desc: 'Register as a new consumer to view monthly bills' },
    { id: 'login', label: 'Customer Login', labelHi: 'ग्राहक लॉगिन', icon: 'login', color: 'var(--gov-navy)', desc: 'Login to your account to view payment history' },
    { id: 'contact', label: 'Help & Contact', labelHi: 'सहायता एवं संपर्क', icon: 'support_agent', color: '#7f8c8d', desc: 'Need help? Contact our support helplines' },
];

function QuickPay() {
    const [propertyId, setPropertyId] = useState('');
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState(null);

    const handleFetch = async () => {
        if (!propertyId) { setError('Please enter Property ID | कृपया संपत्ति आईडी दर्ज करें।'); return; }
        setLoading(true); setError('');
        try {
            const { data } = await wFetchBill({ propertyId });
            setBill(data.data || data);
        } catch (err) { setError(err.message || 'Bill not found | बिल नहीं मिला।'); }
        finally { setLoading(false); }
    };

    const handlePay = async () => {
        setLoading(true);
        try {
            const { data } = await wQuickPay({ propertyId, amount: bill.total });
            setReceipt(data);
            setBill(null);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    if (receipt) return (
        <div className="kiosk-form kiosk-gov-card" style={{ textAlign: 'center' }}>
            <Icon name="check_circle" size={100} color="var(--gov-green)" />
            <h2 className="kiosk-title" style={{ color: 'var(--gov-green)', marginTop: 20 }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 32 }}>भुगतान सफल!</span>
                Payment Successful!
            </h2>
            <div style={{ background: '#f8f9fa', padding: 30, borderRadius: 15, margin: '20px 0', border: '2px solid #ddd' }}>
                <div style={{ fontSize: 18, color: '#666' }}>Receipt Number / रसीद संख्या</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--gov-navy)' }}>{receipt.receiptNo}</div>
                <div style={{ fontSize: 24, marginTop: 10, fontWeight: 700 }}>Amount: ₹{receipt.amount}</div>
            </div>
            <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={() => { setReceipt(null); setPropertyId(''); }}>
                <span className="kiosk-gov-btn-hi">समाप्त</span> | FINISH
            </button>
        </div>
    );

    return (
        <div className="kiosk-form kiosk-gov-card">
            <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>त्वरित बिल भुगतान</span>
                Quick Bill Payment
            </h2>
            {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, marginBottom: 20 }}>{error}</div>}

            {!bill ? (
                <>
                    <div className="kiosk-input-group">
                        <label className="kiosk-label">
                            <span className="kiosk-gov-label-hi">संपत्ति आईडी / उपभोक्ता आईडी दर्ज करें</span>
                            Enter Property ID / Consumer ID
                        </label>
                        <input className="kiosk-input" type="text" value={propertyId} onChange={e => setPropertyId(e.target.value)} placeholder="e.g. PROP12345" />
                    </div>
                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleFetch} disabled={loading}>
                        <div style={{ textAlign: 'left' }}>
                            <span className="kiosk-gov-btn-hi">{loading ? 'बिल खोज रहे हैं...' : 'मेरा बिल देखें'}</span>
                            <div style={{ fontSize: 14, opacity: 0.8 }}>FETCH MY BILL</div>
                        </div>
                    </button>
                </>
            ) : (
                <div className="kiosk-card">
                    <div className="kiosk-card__header">बिल सारांश | Bill Summary</div>
                    <div className="kiosk-card__body">
                        <table className="kiosk-result-table">
                            <tbody>
                                <tr><td>उपभोक्ता का नाम | Consumer Name</td><td>{bill.consumerName}</td></tr>
                                <tr><td>बिल का महीना | Bill Month</td><td>{bill.billMonth}</td></tr>
                                <tr><td>कुल देय राशि | Total Payable</td><td style={{ color: '#c0392b', fontWeight: 800, fontSize: 32 }}>₹{bill.total}</td></tr>
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => setBill(null)}>
                                <span className="kiosk-gov-btn-hi">रद्द करें</span>
                            </button>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }} onClick={handlePay} disabled={loading}>
                                <div style={{ textAlign: 'left' }}>
                                    <span className="kiosk-gov-btn-hi">{loading ? 'प्रक्रिया जारी है...' : `₹${bill.total} का भुगतान करें`}</span>
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>PAY NOW</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FindProperty() {
    const [name, setName] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const { data } = await wFindProperty({ method: 'name', name });
            setResults(data.results || []);
        } catch (err) { }
        finally { setLoading(false); }
    };

    return (
        <div className="kiosk-form kiosk-gov-card" style={{ maxWidth: 900 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>अपनी संपत्ति आईडी खोजें</span>
                Find Your Property ID
            </h2>
            <div className="kiosk-input-group">
                <label className="kiosk-label">
                    <span className="kiosk-gov-label-hi">मालिक का नाम दर्ज करें</span>
                    Enter Owner Name
                </label>
                <input className="kiosk-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Type name to search..." />
            </div>
            <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleSearch} disabled={loading}>
                <div style={{ textAlign: 'left' }}>
                    <span className="kiosk-gov-btn-hi">{loading ? 'खोज रहे हैं...' : 'संपत्ति खोजें'}</span>
                    <div style={{ fontSize: 14, opacity: 0.8 }}>SEARCH PROPERTIES</div>
                </div>
            </button>

            {results && (
                <div style={{ marginTop: 30 }}>
                    <h3 style={{ fontSize: 20, marginBottom: 15 }}>{results.length} Properties Found / संपत्तियां मिलीं</h3>
                    {results.map((r, i) => (
                        <div key={i} className="kiosk-card" style={{ marginBottom: 15 }}>
                            <div className="kiosk-card__body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gov-navy)' }}>{r.propertyId}</div>
                                    <div style={{ fontSize: 16, color: '#666' }}>{r.address}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 14 }}>Zone: {r.zoneNumber}</div>
                                    <div style={{ fontSize: 14 }}>Ward: {r.wardNumber}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Registration() {
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        try { await wSendOtp(mobile); setStep(2); } catch (err) { }
        finally { setLoading(false); }
    };

    const handleVerify = async () => {
        setLoading(true);
        try { await wVerifyOtp(mobile, otp); setStep(4); } catch (err) { }
        finally { setLoading(false); }
    };

    return (
        <div className="kiosk-form kiosk-gov-card">
            <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>उपभोक्ता पंजीकरण</span>
                Consumer Registration
            </h2>

            {step === 1 && (
                <>
                    <div className="kiosk-input-group">
                        <label className="kiosk-label">
                            <span className="kiosk-gov-label-hi">मोबाइल नंबर</span>
                            Mobile Number
                        </label>
                        <input className="kiosk-input" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile number" />
                    </div>
                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleSend} disabled={loading}>
                        <span className="kiosk-gov-btn-hi">ओटीपी भेजें</span> | SEND OTP
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <label className="kiosk-label" style={{ textAlign: 'center' }}>
                        <span className="kiosk-gov-label-hi">ओटीपी दर्ज करें (मोबाइल {mobile} पर भेजा गया)</span>
                        Enter 6-Digit OTP sent to {mobile}
                    </label>
                    <div className="kiosk-otp-container">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <input key={i} className="kiosk-otp-box" type="text" maxLength={1} value={otp[i] || ''} onChange={e => {
                                const newOtp = otp.split('');
                                newOtp[i] = e.target.value;
                                setOtp(newOtp.join(''));
                            }} />
                        ))}
                    </div>
                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleVerify} disabled={loading}>
                        <span className="kiosk-gov-btn-hi">सत्यापित करें</span> | VERIFY
                    </button>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', marginTop: 15 }} onClick={() => setStep(1)}>
                        <span className="kiosk-gov-btn-hi">नंबर बदलें</span> | CHANGE NUMBER
                    </button>
                </>
            )}

            {step === 4 && (
                <div style={{ textAlign: 'center' }}>
                    <Icon name="verified_user" size={80} color="var(--gov-green)" />
                    <h3 style={{ fontSize: 28, margin: '20px 0' }}>पंजीकरण पूरा हुआ! | Registration Complete!</h3>
                    <p style={{ fontSize: 18, marginBottom: 30 }}>You can now login to manage your water connections.</p>
                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={() => window.location.reload()}>HOME | होम</button>
                </div>
            )}
        </div>
    );
}

function HelpContact() {
    return (
        <div className="kiosk-grid">
            <div className="kiosk-tile" style={{ minHeight: 180 }}>
                <Icon name="call" size={60} color="#27ae60" />
                <div className="kiosk-tile__label">
                    <span className="kiosk-gov-tile-hi">डायल 1916</span>
                    Dial 1916
                </div>
                <div className="kiosk-tile__desc">Toll-Free (24x7)</div>
            </div>
            <div className="kiosk-tile" style={{ minHeight: 180 }}>
                <Icon name="support_agent" size={60} color="#2980b9" />
                <div className="kiosk-tile__label">
                    <span className="kiosk-gov-tile-hi">सहायता डेस्क</span>
                    Help Desk
                </div>
                <div className="kiosk-tile__desc">Counter #4 at HQ</div>
            </div>
            <div className="kiosk-tile" style={{ minHeight: 180 }}>
                <Icon name="email" size={60} color="#e67e22" />
                <div className="kiosk-tile__label">
                    <span className="kiosk-gov-tile-hi">ईमेल सहायता</span>
                    Email Support
                </div>
                <div className="kiosk-tile__desc">help@waterboard.gov.in</div>
            </div>
        </div>
    );
}

export default function WaterTaxCharges() {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);

    return (
        <GovLayout breadcrumbs={['Departments', 'Water Supply Board', 'Tax & Bills']}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <Icon name="receipt_long" size={50} color="#fff" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">जल कर एवं बिल सेवाएं</div>
                    <div className="kiosk-gov-text-en">Water Tax & Bill Services</div>
                </div>
            </div>

            <div className="kiosk-container">

                {!activeService ? (
                    <div className="kiosk-grid">
                        {KIOSK_SERVICES.map(s => (
                            <div key={s.id} className="kiosk-tile" style={{ borderTop: `8px solid ${s.color}` }} onClick={() => setActiveService(s.id)}>
                                <div className="kiosk-tile__icon" style={{ color: s.color }}>
                                    <Icon name={s.icon} size={80} color={s.color} />
                                </div>
                                <div className="kiosk-tile__label">
                                    <span className="kiosk-gov-tile-hi">{s.labelHi}</span>
                                    {s.label}
                                </div>
                                <div className="kiosk-tile__desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {activeService === 'pay' && <QuickPay />}
                        {activeService === 'find' && <FindProperty />}
                        {activeService === 'reg' && <Registration />}
                        {activeService === 'contact' && <HelpContact />}
                        {activeService === 'login' && (
                            <div className="kiosk-form kiosk-gov-card">
                                <h2 style={{ textAlign: 'center', marginBottom: 20 }}>लॉगिन पोर्टल | Login Portal</h2>
                                <p style={{ textAlign: 'center', color: '#666', fontSize: 18, marginBottom: 30 }}>
                                    This feature is for registered users only.
                                </p>
                                <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={() => setActiveService('reg')}>
                                    <span className="kiosk-gov-btn-hi">पंजीकृत नहीं? अभी पंजीकरण करें</span>
                                    REGISTER NOW
                                </button>
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" onClick={() => setActiveService(null)}>
                                <Icon name="arrow_back" size={24} color="#fff" /> BACK TO MENU | वापस जाएं
                            </button>
                        </div>
                    </div>
                )}

                {!activeService && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60 }} onClick={() => navigate('/water')}>
                            <Icon name="home" size={24} color="#fff" /> EXIT BOARD | बाहर निकलें
                        </button>
                    </div>
                )}

            </div>
        </GovLayout>
    );
}
