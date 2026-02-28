import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import {
    wSendOtp, wVerifyOtp, wRegister,
    wFetchBill, wQuickPay, wFindProperty, wMyProperties,
} from '../services/waterApi.js';
import { useKioskStore } from '../store/index.js';
import { useT } from '../hooks/useT.js';


const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const OtpHint = ({ otp }) => otp ? (
    <div style={{ background: '#eafaf1', border: '2px solid #27ae60', borderRadius: 10, padding: '10px 20px', textAlign: 'center', margin: '10px 0' }}>
        <span style={{ fontSize: 13, color: '#217a3c', fontWeight: 600 }}>📱 [DEV] OTP: </span>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#0d5c2e', letterSpacing: 6 }}>{otp}</span>
    </div>
) : null;

const SessionBadge = ({ sessionMobile }) => sessionMobile ? (
    <div style={{ background: '#e8f5e9', border: '1px solid #27ae60', padding: '10px 16px', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="verified_user" size={20} color="#27ae60" />
        <span style={{ fontSize: 15, color: '#2e7d32' }}>
            Session: <strong>+91-XXXXXX{sessionMobile.slice(-4)}</strong>
        </span>
    </div>
) : null;

const KIOSK_SERVICES = [
    { id: 'pay', label: 'Quick Pay', labelHi: 'त्वरित भुगतान', icon: 'payments', color: '#27ae60', desc: 'Auto-load your properties and pay your bill instantly' },
    { id: 'find', label: 'Find Property', labelHi: 'संपत्ति खोजें', icon: 'search', color: '#2980b9', desc: 'Search for Property ID by name or mobile' },
    { id: 'reg', label: 'Registration', labelHi: 'पंजीकरण', icon: 'how_to_reg', color: '#e67e22', desc: 'Register as a new consumer to receive a Property ID' },
    { id: 'login', label: 'Customer Login', labelHi: 'ग्राहक लॉगिन', icon: 'login', color: 'var(--gov-navy)', desc: 'You are already authenticated via kiosk session' },
    { id: 'contact', label: 'Help & Contact', labelHi: 'सहायता एवं संपर्क', icon: 'support_agent', color: '#7f8c8d', desc: 'Need help? Contact our support helplines' },
];

/* ────────── Quick Pay ────────── */
function QuickPay({ sessionMobile, initialPropertyId = '' }) {
    const [propertyId, setPropertyId] = useState(initialPropertyId);
    const [bill, setBill] = useState(null);
    const [noBill, setNoBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState(null);

    // My Properties (Forgot Property ID / auto-load)
    const [myProperties, setMyProperties] = useState(null);
    const [loadingProps, setLoadingProps] = useState(false);

    // On mount, if sessionMobile provided, auto-load their properties
    useEffect(() => {
        if (sessionMobile) {
            fetchMyProperties();
        }
    }, [sessionMobile]);

    const fetchMyProperties = async () => {
        if (!sessionMobile) return;
        setLoadingProps(true);
        try {
            const { data } = await wMyProperties(sessionMobile);
            setMyProperties(data);
            // If exactly one property, auto-fill it
            if (data.properties?.length === 1) {
                setPropertyId(data.properties[0].propertyId);
            }
        } catch (_) { /* non-critical — user can still type manually */ }
        finally { setLoadingProps(false); }
    };

    const handleFetch = async () => {
        if (!propertyId) { setError('कृपया संपत्ति आईडी दर्ज करें | Please enter Property ID'); return; }
        setLoading(true); setError(''); setNoBill(null); setBill(null);
        try {
            const { data } = await wFetchBill({ propertyId, mobile: sessionMobile });
            const result = data.data || data;
            if (result.noBill) {
                setNoBill(result);
            } else {
                setBill(result);
            }
        } catch (err) { setError(err.message || 'बिल नहीं मिला | Bill not found.'); }
        finally { setLoading(false); }
    };

    const handlePay = async () => {
        setLoading(true);
        try {
            const { data } = await wQuickPay({ propertyId, mobile: sessionMobile, amount: bill.total });
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
                <div style={{ fontSize: 24, marginTop: 10, fontWeight: 700 }}>Amount Paid: ₹{receipt.amount}</div>
                <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Please keep this receipt for your records.</div>
            </div>
            <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={() => { setReceipt(null); setPropertyId(''); }}>
                <span className="kiosk-gov-btn-hi">समाप्त</span> | FINISH
            </button>
        </div>
    );

    return (
        <div className="kiosk-form kiosk-gov-card">
            <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: 24, color: 'var(--gov-navy)' }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>त्वरित बिल भुगतान</span>
                Quick Bill Payment
            </h2>
            <SessionBadge sessionMobile={sessionMobile} />
            {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 18, padding: 20, marginBottom: 20 }}>{error}</div>}

            {!bill && !noBill ? (
                <>
                    {/* My Properties — auto-loaded */}
                    {loadingProps && (
                        <div style={{ textAlign: 'center', padding: 16, color: '#555' }}>
                            <Icon name="hourglass_top" size={22} color="#555" /> Loading your properties...
                        </div>
                    )}

                    {myProperties && myProperties.properties?.length > 0 && (
                        <div style={{ background: '#f0f4ff', border: '1px solid #aac', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: 'var(--gov-navy)' }}>
                                <Icon name="home" size={18} color="var(--gov-navy)" /> Your Registered Properties
                            </div>
                            {myProperties.properties.map((p, i) => (
                                <div key={i}
                                    style={{ background: propertyId === p.propertyId ? '#003366' : '#fff', color: propertyId === p.propertyId ? '#fff' : 'inherit', border: '1px solid #dde', borderRadius: 8, padding: '10px 14px', marginBottom: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    onClick={() => setPropertyId(p.propertyId)}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 17 }}>{p.propertyId}</div>
                                        <div style={{ fontSize: 13, opacity: 0.8 }}>Last bill: ₹{p.lastBillAmount} — {p.lastStatus}</div>
                                    </div>
                                    {propertyId === p.propertyId && <Icon name="check_circle" size={24} color="#fff" />}
                                </div>
                            ))}
                        </div>
                    )}

                    {myProperties && myProperties.properties?.length === 0 && (
                        <div style={{ background: '#fff8e1', border: '1px solid #ffc107', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 15, color: '#7c5800' }}>
                            <Icon name="info" size={18} color="#7c5800" /> {myProperties.message || 'No registered properties found.'} Enter your Property ID manually below.
                        </div>
                    )}

                    <div className="kiosk-input-group">
                        <label className="kiosk-label">
                            <span className="kiosk-gov-label-hi">संपत्ति आईडी दर्ज करें</span>
                            Property ID / Consumer ID
                        </label>
                        <input className="kiosk-input" type="text" value={propertyId}
                            onChange={e => setPropertyId(e.target.value)} placeholder="e.g. PROP-12345" />
                    </div>

                    {/* Forgot Property ID */}
                    {!loadingProps && sessionMobile && (
                        <button
                            className="kiosk-btn kiosk-btn--secondary"
                            style={{ width: '100%', marginBottom: 16, background: 'transparent', border: '1px dashed #aaa', color: 'var(--gov-navy)', height: 50, fontSize: 14 }}
                            onClick={fetchMyProperties}
                        >
                            <Icon name="refresh" size={18} color="var(--gov-navy)" /> Forgot Property ID? Reload my registered properties
                        </button>
                    )}

                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleFetch} disabled={loading || !propertyId}>
                        <div style={{ textAlign: 'left' }}>
                            <span className="kiosk-gov-btn-hi">{loading ? 'बिल खोज रहे हैं...' : 'मेरा बिल देखें'}</span>
                            <div style={{ fontSize: 14, opacity: 0.8 }}>FETCH MY BILL</div>
                        </div>
                    </button>
                </>
            ) : noBill ? (
                <div style={{ textAlign: 'center' }}>
                    <Icon name="check_circle_outline" size={80} color="#27ae60" />
                    <h3 style={{ fontSize: 24, margin: '16px 0 8px', color: '#27ae60' }}>
                        <span className="kiosk-gov-label-hi" style={{ display: 'block', fontSize: 26 }}>कोई लंबित बिल नहीं</span>
                        No Pending Bill
                    </h3>
                    <div style={{ background: '#f0f9f4', border: '1px solid #a8e6c1', borderRadius: 12, padding: 24, margin: '16px 0', textAlign: 'left' }}>
                        <div style={{ marginBottom: 8 }}><strong>Consumer:</strong> {noBill.consumerName}</div>
                        <div style={{ marginBottom: 8 }}><strong>Property ID:</strong> {noBill.propertyId}</div>
                        <div style={{ marginTop: 12, color: '#555', fontSize: 15, lineHeight: 1.7 }}>ℹ️ {noBill.details}</div>
                    </div>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%' }} onClick={() => setNoBill(null)}>
                        <span className="kiosk-gov-btn-hi">वापस जाएं</span> | BACK
                    </button>
                </div>
            ) : (
                <div className="kiosk-card">
                    <div className="kiosk-card__header">बिल सारांश | Bill Summary</div>
                    <div className="kiosk-card__body">
                        <table className="kiosk-result-table">
                            <tbody>
                                <tr><td>उपभोक्ता का नाम | Consumer Name</td><td>{bill.consumerName}</td></tr>
                                <tr><td>संपत्ति आईडी | Property ID</td><td>{bill.propertyId}</td></tr>
                                {bill.units && <tr><td>उपयोग (KL) | Units Consumed</td><td>{bill.units} KL</td></tr>}
                                <tr><td>बिल का महीना | Bill Month</td><td>{bill.billMonth}</td></tr>
                                <tr><td>देय तिथि | Due Date</td><td style={{ color: '#c0392b' }}>{bill.dueDate}</td></tr>
                                {bill.arrears > 0 && <tr><td>बकाया | Arrears</td><td>₹{bill.arrears}</td></tr>}
                                <tr><td>कुल देय राशि | Total Payable</td><td style={{ color: '#c0392b', fontWeight: 800, fontSize: 28 }}>₹{bill.total}</td></tr>
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => setBill(null)}>
                                <span className="kiosk-gov-btn-hi">रद्द करें</span> | CANCEL
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

/* ────────── Find Property (5 Search Modes) ────────── */
function FindProperty({ onPayNow }) {
    const MODES = [
        { id: 'billNumber', icon: 'receipt', label: 'Bill Number', labelHi: 'बिल नंबर से', fields: ['zone', 'ward', 'address'] },
        { id: 'existingBill', icon: 'assignment', label: 'Existing Bill No', labelHi: 'मौजूदा बिल नंबर', fields: ['zone', 'ward', 'billNumber', 'subCode'] },
        { id: 'name', icon: 'person_search', label: 'Owner Name', labelHi: 'नाम से', fields: ['zone', 'ward', 'name'] },
        { id: 'address', icon: 'home_pin', label: 'Address', labelHi: 'पते से', fields: ['zone', 'ward', 'address'] },
        { id: 'mobile', icon: 'phone_iphone', label: 'Mobile Number', labelHi: 'मोबाइल से', fields: ['mobile'] },
    ];

    const [mode, setMode] = useState('mobile');
    const [zone, setZone] = useState('');
    const [ward, setWard] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [subCode, setSubCode] = useState('');
    const [searchMobile, setSearchMobile] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noResultMsg, setNoResultMsg] = useState('');

    const selectedMode = MODES.find(m => m.id === mode);

    const resetFields = (newMode) => {
        setMode(newMode); setResults(null); setError(''); setNoResultMsg('');
        setZone(''); setWard(''); setName(''); setAddress('');
        setBillNumber(''); setSubCode(''); setSearchMobile('');
    };

    const handleSearch = async () => {
        setError(''); setNoResultMsg('');
        const payload = { searchMode: mode };
        if (selectedMode.fields.includes('zone') && zone) payload.zone = zone;
        if (selectedMode.fields.includes('ward') && ward) payload.ward = ward;
        if (selectedMode.fields.includes('name')) payload.name = name;
        if (selectedMode.fields.includes('address')) payload.address = address;
        if (selectedMode.fields.includes('billNumber')) payload.billNumber = billNumber;
        if (selectedMode.fields.includes('subCode')) payload.subCode = subCode;
        if (selectedMode.fields.includes('mobile')) payload.mobile = searchMobile;

        setLoading(true);
        try {
            const { data } = await wFindProperty(payload);
            const list = data.results || [];
            setResults(list);
            if (!list.length) setNoResultMsg(data.message || 'No consumer found. Please check your search criteria.');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Search failed.');
        } finally { setLoading(false); }
    };

    const Field = ({ label, hi, value, onChange, type = 'text', placeholder = '' }) => (
        <div className="kiosk-input-group" style={{ flex: 1, minWidth: 180 }}>
            <label className="kiosk-label"><span className="kiosk-gov-label-hi">{hi}</span>{label}</label>
            <input className="kiosk-input" type={type} value={value} onChange={e => onChange(e.target.value)}
                placeholder={placeholder} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        </div>
    );

    return (
        <div className="kiosk-form kiosk-gov-card" style={{ maxWidth: 1000 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 6, fontSize: 24, color: 'var(--gov-navy)' }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>अपनी संपत्ति खोजें</span>
                Find My Property
            </h2>
            <p style={{ textAlign: 'center', color: '#777', marginBottom: 24, fontSize: 15 }}>
                Search using any of the 5 methods below | नीचे दिए किसी भी तरीके से खोजें
            </p>

            {/* Mode selector tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
                {MODES.map((m, i) => (
                    <button key={m.id}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                            borderRadius: 30, border: mode === m.id ? '2px solid var(--gov-navy)' : '2px solid #ddd',
                            background: mode === m.id ? 'var(--gov-navy)' : '#fafafa',
                            color: mode === m.id ? '#fff' : '#555', cursor: 'pointer',
                            fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                        }}
                        onClick={() => resetFields(m.id)}>
                        <span className="material-icons" style={{ fontSize: 18 }}>{m.icon}</span>
                        <div>
                            <div style={{ fontSize: 11, opacity: mode === m.id ? 0.8 : 0.6 }}>({i + 1})</div>
                            <div>{m.label}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Dynamic fields based on mode */}
            <div style={{ background: '#f8f9ff', border: '1px solid #e0e6ff', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
                    <span className="material-icons" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>{selectedMode.icon}</span>
                    {selectedMode.labelHi} | Search by {selectedMode.label}
                </div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {/* Zone & Ward — shown for all modes except mobile */}
                    {selectedMode.fields.includes('zone') && (
                        <>
                            <Field label="Zone Number" hi="जोन नंबर" value={zone} onChange={setZone} placeholder="e.g. 2" />
                            <Field label="Ward Number" hi="वार्ड नंबर" value={ward} onChange={setWard} placeholder="e.g. 5" />
                        </>
                    )}

                    {/* Mode-specific fields */}
                    {selectedMode.fields.includes('name') && (
                        <Field label="Consumer Name (min. 2 chars)" hi="उपभोक्ता का नाम" value={name} onChange={setName} placeholder="e.g. Ramesh Kumar" />
                    )}
                    {selectedMode.fields.includes('address') && (
                        <Field label="Address / Street / Area" hi="पता / मोहल्ला" value={address} onChange={setAddress} placeholder="e.g. Gandhi Nagar, Street 4" />
                    )}
                    {selectedMode.fields.includes('billNumber') && (
                        <Field label={mode === 'existingBill' ? 'Bill / Receipt Number' : 'Property / Consumer Number'} hi="बिल / संपत्ति नंबर" value={billNumber} onChange={setBillNumber} placeholder="e.g. PROP-12345" />
                    )}
                    {selectedMode.fields.includes('subCode') && (
                        <Field label="Sub Code (optional)" hi="सब कोड" value={subCode} onChange={setSubCode} placeholder="e.g. A1" />
                    )}
                    {selectedMode.fields.includes('mobile') && (
                        <Field label="Registered Mobile Number" hi="मोबाइल नंबर" value={searchMobile} onChange={setSearchMobile} type="tel" placeholder="Enter 10-digit mobile" />
                    )}
                </div>
            </div>

            {error && <div className="gov-alert gov-alert--error" style={{ fontSize: 15, padding: 14, marginBottom: 16 }}>{error}</div>}
            {noResultMsg && <div className="gov-alert gov-alert--warning" style={{ fontSize: 15, padding: 14, marginBottom: 16 }}>{noResultMsg}</div>}

            <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 80 }} onClick={handleSearch} disabled={loading}>
                <div style={{ textAlign: 'left' }}>
                    <span className="kiosk-gov-btn-hi">{loading ? 'खोज जारी है...' : 'संपत्ति खोजें'}</span>
                    <div style={{ fontSize: 14, opacity: 0.8 }}>{loading ? 'Please wait...' : 'SEARCH REGISTERED CONSUMERS'}</div>
                </div>
                <span className="material-icons" style={{ fontSize: 32, marginLeft: 'auto' }}>{loading ? 'hourglass_top' : 'search'}</span>
            </button>

            {/* Results */}
            {results && results.length > 0 && (
                <div style={{ marginTop: 30 }}>
                    <h3 style={{ fontSize: 20, marginBottom: 16, color: 'var(--gov-navy)' }}>
                        {results.length} Consumer(s) Found | {results.length} उपभोक्ता मिले
                    </h3>
                    {results.map((r, i) => (
                        <div key={i} style={{ background: '#fff', border: r.hasPropertyId ? '2px solid #27ae60' : '2px solid #e67e22', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                                <div style={{ flex: 1, minWidth: 250 }}>
                                    {/* Property ID — most important */}
                                    {r.propertyId ? (
                                        <div style={{ background: 'var(--gov-navy)', color: '#fff', padding: '6px 16px', borderRadius: 8, display: 'inline-block', fontSize: 18, fontWeight: 900, letterSpacing: 2, marginBottom: 10 }}>
                                            🏠 {r.propertyId}
                                        </div>
                                    ) : (
                                        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: '6px 16px', borderRadius: 8, display: 'inline-block', fontSize: 14, fontWeight: 700, color: '#856404', marginBottom: 10 }}>
                                            ⚠ No Property ID — Please complete registration
                                        </div>
                                    )}
                                    <table style={{ fontSize: 14, width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                                        <tbody>
                                            {[
                                                ['Consumer ID', r.consumerId?.slice(0, 16) + '…'],
                                                ['Name', r.consumerName],
                                                ['Mobile', r.mobile],
                                                r.email && ['Email', r.email],
                                                ['Zone', r.zone],
                                                ['Ward', r.ward],
                                                ['Registered On', r.registeredOn ? new Date(r.registeredOn).toLocaleDateString('en-IN') : '—'],
                                                ['Total Payments Made', r.totalPayments],
                                                r.lastTransactionId && ['Last Receipt No.', r.lastTransactionId],
                                                ['Last Bill Amount', r.lastBillAmount ? `₹${r.lastBillAmount}` : '—'],
                                                ['Last Amount Paid', r.lastAmountPaid ? `₹${r.lastAmountPaid}` : '—'],
                                                r.lastPaymentDate && ['Last Payment Date', new Date(r.lastPaymentDate).toLocaleDateString('en-IN')],
                                            ].filter(Boolean).map(([k, v]) => (
                                                <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                    <td style={{ padding: '5px 0', color: '#888', width: 180 }}>{k}</td>
                                                    <td style={{ padding: '5px 0', fontWeight: 600 }}>{v}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 150 }}>
                                    <span style={{ background: r.lastStatus === 'SUCCESS' ? '#d4edda' : '#fff3cd', color: r.lastStatus === 'SUCCESS' ? '#155724' : '#856404', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                                        {r.lastStatus}
                                    </span>
                                    {r.propertyId && (
                                        <button className="kiosk-btn kiosk-btn--primary" style={{ minWidth: 150, height: 60 }}
                                            onClick={() => onPayNow(r.propertyId)}>
                                            <span className="kiosk-gov-btn-hi" style={{ display: 'block', fontSize: 13 }}>भुगतान करें</span>
                                            PAY NOW
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



/* ────────── Registration ────────── */
function Registration({ onGoToPay, onGoToLogin, sessionMobile }) {
    const [step, setStep] = useState(1); // 1=name-only, 2=otp, 4=success
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [propertyId, setPropertyId] = useState('');
    const [consumerName, setConsumerName] = useState('');
    const [otpHint, setOtpHint] = useState('');

    const handleSend = async () => {
        if (!sessionMobile) { setError('Session not found. Please return to the main login screen.'); return; }
        if (!name.trim() || name.trim().length < 2) { setError('कृपया अपना पूरा नाम दर्ज करें | Please enter your full name'); return; }
        setLoading(true); setError(''); setAlreadyRegistered(false);
        try {
            // Use sessionMobile — no mobile input from user
            const { data } = await wSendOtp(sessionMobile);
            setOtpHint(data.otp || '');
            setStep(2);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleVerifyAndRegister = async () => {
        if (!otp || otp.length < 6) { setError('Please enter the complete 6-digit OTP'); return; }
        setLoading(true); setError('');
        try {
            await wVerifyOtp(sessionMobile, otp);
            const { data } = await wRegister({ mobile: sessionMobile, name: name.trim() });
            const result = data.data || data;
            setPropertyId(result.propertyId || '');
            setConsumerName(result.consumerName || name);
            setStep(4);
        } catch (err) {
            if (err.message && (err.message.includes('already registered') || err.message.includes('409'))) {
                setAlreadyRegistered(true);
                setError('इस मोबाइल नंबर से एक खाता पहले से मौजूद है। | This mobile is already registered.');
            } else {
                setError(err.message);
            }
        }
        finally { setLoading(false); }
    };

    return (
        <div className="kiosk-form kiosk-gov-card">
            {step !== 4 && (
                <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: 'var(--gov-navy)' }}>
                    <span className="kiosk-gov-label-hi" style={{ fontSize: 28 }}>उपभोक्ता पंजीकरण</span>
                    Consumer Registration
                </h2>
            )}

            {error && (
                <div className="gov-alert gov-alert--error" style={{ fontSize: 17, padding: 20, marginBottom: 20 }}>
                    {error}
                    {alreadyRegistered && (
                        <button className="kiosk-btn kiosk-btn--primary" style={{ marginTop: 16, width: '100%' }}
                            onClick={() => onGoToLogin && onGoToLogin()}>
                            <span className="kiosk-gov-btn-hi">लॉगिन करें</span> | VIEW YOUR BILL INSTEAD
                        </button>
                    )}
                </div>
            )}

            {step === 1 && !alreadyRegistered && (
                <>
                    {/* Session mobile indicator — no input */}
                    {sessionMobile ? (
                        <div style={{ background: '#e8f5e9', border: '1px solid #27ae60', padding: '12px 16px', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name="verified_user" size={22} color="#27ae60" />
                            <div>
                                <div style={{ fontSize: 13, color: '#555' }}>Registering with mobile</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#2e7d32' }}>+91-XXXXXX{sessionMobile.slice(-4)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="gov-alert gov-alert--error" style={{ marginBottom: 20 }}>
                            Session not found. Please login from the main kiosk screen first.
                        </div>
                    )}

                    <div className="kiosk-input-group">
                        <label className="kiosk-label">
                            <span className="kiosk-gov-label-hi">पूरा नाम *</span>
                            Full Name *
                        </label>
                        <input className="kiosk-input" type="text" value={name}
                            onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
                    </div>

                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleSend} disabled={loading || !sessionMobile}>
                        <span className="kiosk-gov-btn-hi">{loading ? 'भेज रहे हैं...' : 'ओटीपी भेजें'}</span> | SEND OTP TO VERIFY
                    </button>
                </>
            )}

            {step === 2 && !alreadyRegistered && (
                <>
                    <label className="kiosk-label" style={{ textAlign: 'center' }}>
                        <span className="kiosk-gov-label-hi">ओटीपी दर्ज करें (+91-XXXXXX{sessionMobile?.slice(-4)} पर भेजा गया)</span>
                        Enter 6-Digit OTP sent to your registered mobile
                    </label>
                    <OtpHint otp={otpHint} />
                    <input
                        className="kiosk-input"
                        type="number"
                        value={otp}
                        onChange={e => setOtp(e.target.value.slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, letterSpacing: 12 }}
                    />
                    <button className="kiosk-btn kiosk-btn--primary" style={{ width: '100%' }} onClick={handleVerifyAndRegister} disabled={loading}>
                        <span className="kiosk-gov-btn-hi">{loading ? 'प्रक्रिया जारी है...' : 'पंजीकरण करें'}</span> | REGISTER
                    </button>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', marginTop: 15 }} onClick={() => { setStep(1); setOtp(''); setOtpHint(''); }}>
                        <span className="kiosk-gov-btn-hi">वापस जाएं</span> | BACK
                    </button>
                </>
            )}

            {step === 4 && (
                <div style={{ textAlign: 'center' }}>
                    <Icon name="verified_user" size={80} color="var(--gov-green)" />
                    <h3 style={{ fontSize: 28, margin: '20px 0', color: 'var(--gov-green)' }}>
                        <span className="kiosk-gov-label-hi" style={{ fontSize: 32 }}>पंजीकरण पूरा हुआ!</span>
                        Registration Complete!
                    </h3>
                    <div style={{ background: '#f0f9f4', border: '2px solid #27ae60', padding: 25, borderRadius: 12, margin: '20px 0' }}>
                        <p style={{ fontSize: 16, color: '#555', marginBottom: 4 }}>नाम | Name</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 16 }}>{consumerName || name}</p>
                        <p style={{ fontSize: 16, color: '#555', marginBottom: 8 }}>आपकी संपत्ति आईडी | Your Property ID</p>
                        <p style={{ fontSize: 44, fontWeight: 900, color: 'var(--gov-navy)', letterSpacing: 3 }}>{propertyId}</p>
                        <p style={{ fontSize: 15, marginTop: 10, color: '#666' }}>📌 Note this ID — use it for all future payments.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <button className="kiosk-btn kiosk-btn--secondary" style={{ flex: 1 }} onClick={() => window.location.reload()}>
                            <span className="kiosk-gov-btn-hi">होम</span> | HOME
                        </button>
                        <button className="kiosk-btn kiosk-btn--primary" style={{ flex: 2 }}
                            onClick={() => onGoToPay(propertyId)}>
                            <span className="kiosk-gov-btn-hi">तत्काल भुगतान करें</span> | PAY BILL NOW
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ────────── Customer Login — Already Authenticated ────────── */
function CustomerLogin({ sessionMobile }) {
    return (
        <div className="kiosk-form kiosk-gov-card" style={{ textAlign: 'center' }}>
            <Icon name="verified_user" size={80} color="var(--gov-green)" />
            <h2 style={{ fontSize: 28, margin: '20px 0', color: 'var(--gov-green)' }}>
                <span className="kiosk-gov-label-hi" style={{ fontSize: 32, display: 'block' }}>आप पहले से लॉगिन हैं</span>
                You Are Already Authenticated
            </h2>
            <p style={{ fontSize: 18, color: '#555', marginBottom: 20 }}>
                Your session is active for mobile{' '}
                <strong>+91-XXXXXX{sessionMobile?.slice(-4) || '****'}</strong>
            </p>
            <div style={{ background: '#f0f9f4', border: '1px solid #a8e6c1', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <p style={{ fontSize: 15, color: '#2e7d32', lineHeight: 1.8 }}>
                    ✅ Your mobile number is verified and active for this kiosk session.<br />
                    ✅ All Water Department services will automatically use your mobile number.<br />
                    ✅ No re-authentication is required.
                </p>
            </div>
            <p style={{ fontSize: 15, color: '#888' }}>Use <strong>Quick Pay</strong> to pay your bill, or go back to the menu.</p>
        </div>
    );
}

/* ────────── Help Contact ────────── */
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

/* ────────── Main Page ────────── */
export default function WaterTaxCharges() {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionMobile = useKioskStore(s => s.sessionMobile);

    // If coming from WaterDepartment registration prompt, open 'reg' directly
    const [activeService, setActiveService] = useState(
        location.state?.action === 'register' ? 'reg' : null
    );
    const [initialPropertyId, setInitialPropertyId] = useState('');

    const goToPayWith = (propertyId = '') => {
        setInitialPropertyId(propertyId);
        setActiveService('pay');
    };

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
                        {activeService === 'pay' && (
                            <QuickPay
                                sessionMobile={sessionMobile}
                                initialPropertyId={initialPropertyId}
                                key={initialPropertyId}
                            />
                        )}
                        {activeService === 'find' && (
                            <FindProperty onPayNow={(id) => goToPayWith(id)} />
                        )}
                        {activeService === 'reg' && (
                            <Registration
                                sessionMobile={sessionMobile}
                                onGoToPay={(id) => goToPayWith(id)}
                                onGoToLogin={() => setActiveService('login')}
                            />
                        )}
                        {activeService === 'login' && (
                            <CustomerLogin sessionMobile={sessionMobile} />
                        )}
                        {activeService === 'contact' && <HelpContact />}

                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <button className="kiosk-btn kiosk-btn--secondary" onClick={() => { setActiveService(null); setInitialPropertyId(''); }}>
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
