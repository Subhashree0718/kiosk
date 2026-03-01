import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';
import { useT } from '../hooks/useT.js';

const Icon = ({ name, size = 24, color, style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>
        {name}
    </span>
);

/* ── Data ──────────────────────────────────────────────────────── */
const BANNER_SLIDES = [
    {
        id: 1,
        bg: 'linear-gradient(135deg, #002147 0%, #003d7a 60%, #005099 100%)',
        icon: 'account_balance',
        title: 'SUVIDHA Kiosk – Citizen Services',
        subtitle: 'Fast · Transparent · Paperless Government Services at Your Fingertips',
        tag: 'Digital India Initiative',
    },
    {
        id: 2,
        bg: 'linear-gradient(135deg, #7d1a00 0%, #c0392b 60%, #e74c3c 100%)',
        icon: 'assignment',
        title: 'e-Shram Registration Available',
        subtitle: 'Register as an unorganized worker and avail government welfare schemes.',
        tag: 'New Service',
    },
    {
        id: 3,
        bg: 'linear-gradient(135deg, #0a3d1f 0%, #117a3d 60%, #1abc6d 100%)',
        icon: 'receipt',
        title: 'Electricity & Utility Bill Payment',
        subtitle: 'Pay your electricity, water, and gas bills instantly without standing in queues.',
        tag: 'Citizen Convenience',
    },
    {
        id: 4,
        bg: 'linear-gradient(135deg, #4a1a6e 0%, #6c3483 60%, #8e44ad 100%)',
        icon: 'campaign',
        title: 'Grievance Redressal Portal',
        subtitle: 'Submit complaints against any government department. Track resolution status online.',
        tag: 'Your Right',
    },
];

const CITIZEN_SERVICES = [
    {
        icon: 'electric_bolt', label: 'Electricity', labelHi: 'विद्युत',
        path: '/electricity', color: '#1a5276',
        desc: 'New connection, bill pay & service requests',
        descHi: 'नया कनेक्शन, बिल भुगतान और सेवा अनुरोध',
    },
    {
        icon: 'water_drop', label: 'Water Supply', labelHi: 'जल सेवा',
        path: '/water', color: '#117a65',
        desc: 'Pay water tax, complaints & new connection',
        descHi: 'जल कर भुगतान, शिकायत और नया कनेक्शन',
    },
    {
        icon: 'local_fire_department', label: 'Gas Service', labelHi: 'गैस सेवा',
        path: null, color: '#c0392b',
        desc: 'New connection, safety check & bill payment',
        descHi: 'नया कनेक्शन, सुरक्षा जांच और बिल भुगतान',
        comingSoon: true,
    },
    {
        icon: 'home_work', label: 'Property Tax', labelHi: 'संपत्ति कर',
        path: null, color: '#7d6608',
        desc: 'Pay house & commercial property tax online',
        descHi: 'घरेलू और वाणिज्यिक संपत्ति कर ऑनलाइन दें',
        comingSoon: true,
    },
    {
        icon: 'report_problem', label: 'Grievance', labelHi: 'शिकायत',
        path: '/complaint', color: '#6c3483',
        desc: 'Lodge a complaint against any department',
        descHi: 'किसी विभाग के खिलाफ शिकायत दर्ज करें',
    },
    {
        icon: 'location_city', label: 'Municipal', labelHi: 'नगर निगम',
        path: '/departments', color: '#003366',
        desc: 'All departments, notices & civic services',
        descHi: 'सभी विभाग, सूचनाएं और नागरिक सेवाएं',
    },
    {
        icon: 'description', label: 'Certificates', labelHi: 'प्रमाणपत्र',
        path: null, color: '#1e8449',
        desc: 'Birth, death, income & residence certificates',
        descHi: 'जन्म, मृत्यु, आय और निवास प्रमाणपत्र',
        comingSoon: true,
    },
    {
        icon: 'manage_search', label: 'Track Status', labelHi: 'आवेदन स्थिति',
        path: '/status', color: '#2e4057',
        desc: 'Track any application by Ticket / Complaint ID',
        descHi: 'टिकट / शिकायत ID द्वारा आवेदन की स्थिति जानें',
    },
];

const NEWS_ITEMS = [
    { date: 'TODAY', text: 'SUVIDHA Kiosk services now available in 500+ locations across India.', isNew: true },
    { date: '21 Feb', text: 'e-Shram card beneficiaries: avail accident insurance of Rs. 2 lakh.', isNew: true },
    { date: '20 Feb', text: 'Pradhan Mantri Awas Yojana (Urban) – new applications open for EWS/LIG category.' },
    { date: '18 Feb', text: 'Electricity connection for new households: apply online, get connected in 7 days.' },
    { date: '15 Feb', text: 'Water supply timings updated for summer months. Check department page.' },
    { date: '10 Feb', text: 'Property tax last date extended to 31 March. Pay now to avail 5% rebate.' },
];

const SCHEMES = [
    { icon: 'engineering', name: 'e-Shram', desc: 'Unorganized workers welfare & registration', color: '#003366' },
    { icon: 'apartment', name: 'PM Awas Yojana', desc: 'Affordable housing for urban poor', color: '#117a65' },
    { icon: 'local_hospital', name: 'PM Jan Arogya', desc: 'Health insurance coverage upto Rs. 5 lakh', color: '#c0392b' },
    { icon: 'school', name: 'National Scholarship', desc: 'Financial support for students', color: '#8e44ad' },
    { icon: 'bolt', name: 'Saubhagya Scheme', desc: 'Free electricity connection to households', color: '#d4ac0d' },
    { icon: 'water', name: 'Jal Jeevan Mission', desc: 'Piped water to every rural household', color: '#2980b9' },
];

const HELPLINES = [
    { label: 'General Enquiry', number: '1800-11-0001', icon: 'info' },
    { label: 'Electricity', number: '1912', icon: 'electric_bolt' },
    { label: 'Water Supply', number: '1916', icon: 'water_drop' },
    { label: 'Gas Emergency', number: '1906', icon: 'local_fire_department' },
    { label: 'Municipal', number: '14420', icon: 'location_city' },
];

const STATS = [
    { num: '12,483', label: 'Tickets Resolved', icon: 'task_alt' },
    { num: '8,291', label: 'Payments Processed', icon: 'payments' },
    { num: '500+', label: 'Kiosk Locations', icon: 'location_on' },
    { num: '24x7', label: 'Service Availability', icon: 'schedule' },
];

const QUICK_ACCESS = [
    { label: 'Lodge Complaint', icon: 'campaign', path: '/complaint', bg: '#c0392b' },
    { label: 'Bill Payment', icon: 'credit_card', path: '/bill-payment', bg: '#1a5276' },
    { label: 'Service Request', icon: 'assignment', path: '/service-request', bg: '#117a65' },
    { label: 'Track Status', icon: 'manage_search', path: '/status', bg: '#6c3483' },
];

const USEFUL_LINKS = [
    ['india.gov.in', 'https://www.india.gov.in'],
    ['labour.gov.in', 'https://www.labour.gov.in'],
    ['epfindia.gov.in', 'https://www.epfindia.gov.in'],
    ['eshram.gov.in', 'https://eshram.gov.in'],
    ['digitalindia.gov.in', 'https://www.digitalindia.gov.in'],
];

/* ── Component ─────────────────────────────────────────────────── */
export default function Dashboard() {
    const navigate = useNavigate();
    const logout = useKioskStore(s => s.logout);
    const user = useKioskStore(s => s.user);
    const { t } = useT();

    const [slide, setSlide] = useState(0);
    const [trackId, setTrackId] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => setSlide(s => (s + 1) % BANNER_SLIDES.length), 5000);
        return () => clearInterval(timerRef.current);
    }, []);

    function goSlide(i) {
        clearInterval(timerRef.current);
        setSlide(i);
        timerRef.current = setInterval(() => setSlide(s => (s + 1) % BANNER_SLIDES.length), 5000);
    }

    return (
        <GovLayout breadcrumbs={[]} showSidebar={false}>
            {/* 1. ELITE TOP TICKER (UPGRADED) */}
            <div className="kiosk-ticker-elite" style={{ height: 'var(--kiosk-ticker-h, 60px)', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 100 }}>
                <div style={{ background: 'var(--gov-saffron)', color: '#fff', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: 13, zIndex: 10, boxShadow: '10px 0 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
                    <Icon name="campaign" size={18} style={{ marginRight: 8 }} />
                    <span className="desktop-only">LATEST UPDATES / नवीनतम अपडेट</span>
                    <span className="mobile-only">UPDATES</span>
                </div>
                <div className="gov-ticker" style={{ flex: 1, whiteSpace: 'nowrap', color: '#fff', fontSize: 14, fontWeight: 700 }}>
                    {NEWS_ITEMS.map((n, i) => (
                        <span key={i} style={{ margin: '0 30px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></div>
                            {n.text}
                        </span>
                    ))}
                </div>
            </div>

            <div className="kiosk-gradient-patriotic" style={{ padding: '20px 0', minHeight: '100vh' }}>
                <div className="kiosk-container">

                    {/* 2. PREMIUM WELCOME HEADER */}
                    <div className="kiosk-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--kiosk-gap)', padding: 'var(--kiosk-p-md)', borderRadius: 24, border: '2px solid rgba(255,255,255,0.5)', flexWrap: 'wrap', gap: 20 }}>
                        <div style={{ minWidth: 280, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gov-navy)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    <span className="lang-en">KIOSK UNIT SVDH-001 — ACTIVE</span>
                                    <span className="lang-hi">किओस्क इकाई SVDH-001 — सक्रिय</span>
                                </div>
                            </div>
                            <h1 className="kiosk-text-display" style={{ fontSize: 'var(--kiosk-title-size)', color: 'var(--gov-navy)', margin: 0, lineHeight: 1.15 }}>
                                <span className="lang-en" style={{ display: 'block' }}>SUVIDHA Gateway</span>
                                <span className="lang-hi" style={{ display: 'block' }}>सुविधा पोर्टल</span>
                                <span style={{ display: 'block', fontSize: 'calc(var(--kiosk-subtitle-size) * 0.8)', color: 'var(--gov-saffron)', fontWeight: 800, marginTop: 6 }}>
                                    <span className="lang-en">Welcome to the Citizen Service Centre</span>
                                    <span className="lang-hi">जन सेवा केंद्र में आपका स्वागत है</span>
                                </span>
                            </h1>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', gap: 20, alignItems: 'center', marginLeft: 'auto' }}>
                            <div className="desktop-only" style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--gov-navy)', fontFamily: 'monospace', lineHeight: 1 }}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, marginTop: 5 }}>
                                    {new Date().toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                                </div>
                            </div>
                            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.5)', borderRadius: 20, border: '1.5px solid #fff' }}>
                                <Icon name="wifi_tethering" size={32} color="var(--gov-navy)" />
                            </div>
                        </div>
                    </div>

                    {/* 3. HERO SHOWCASE CAROUSEL (UPGRADED) */}
                    <div style={{ marginBottom: 'var(--kiosk-gap)', position: 'relative', height: 'var(--kiosk-hero-h, 320px)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.2)' }}>
                        {BANNER_SLIDES.map((s, i) => (
                            <div key={s.id} style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: s.bg, opacity: slide === i ? 1 : 0, transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                padding: 'var(--kiosk-p-lg)', color: '#fff', display: 'flex', alignItems: 'center', pointerEvents: slide === i ? 'auto' : 'none'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: 100, fontSize: 10, fontWeight: 900, width: 'fit-content', marginBottom: 10, backdropFilter: 'blur(10px)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                        {s.tag}
                                    </div>
                                    <h2 style={{ fontSize: 'calc(var(--kiosk-title-size) * 0.7)', fontWeight: 900, margin: '0 0 10px 0', textShadow: '0 4px 15px rgba(0,0,0,0.3)', lineHeight: 1.1 }}>{s.title}</h2>
                                    <p className="desktop-only" style={{ fontSize: 16, opacity: 0.8, maxWidth: 600, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{s.subtitle}</p>
                                </div>
                                <div className="desktop-only" style={{ width: 140, height: 140, background: 'rgba(255,255,255,0.2)', borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.4)' }}>
                                    <Icon name={s.icon} size={70} color="#fff" />
                                </div>
                            </div>
                        ))}
                        <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 10 }}>
                            {BANNER_SLIDES.map((_, i) => (
                                <button key={i} onClick={() => goSlide(i)} style={{
                                    width: slide === i ? 40 : 10, height: 10, borderRadius: 10, background: slide === i ? '#fff' : 'rgba(255,255,255,0.4)',
                                    border: 'none', transition: 'all 0.4s ease', cursor: 'pointer'
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* 4. MAIN SERVICE CORE */}
                    <div style={{ marginBottom: 'var(--kiosk-gap)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 20 }}>
                            <div style={{ borderLeft: '8px solid var(--gov-saffron)', paddingLeft: 20 }}>
                                <h2 className="kiosk-text-display" style={{ fontSize: 'calc(var(--kiosk-subtitle-size) * 0.9)', color: 'var(--gov-navy)', margin: 0 }}>
                                    <span className="lang-en">Citizen Services Center</span>
                                    <span className="lang-hi">नागरिक सेवा केंद्र</span>
                                </h2>
                                <p style={{ fontSize: 15, color: '#334155', margin: '4px 0 0 0', fontWeight: 600 }}>
                                    <span className="lang-en">Select a category to begin.</span>
                                    <span className="lang-hi">शुरू करने हेतु श्रेणी चुनें।</span>
                                </p>
                            </div>
                            <button className="kiosk-btn-premium" style={{ background: 'var(--gov-navy)', color: '#fff', height: 60, padding: '0 24px', fontSize: 14 }} onClick={() => navigate('/departments')}>
                                <span className="lang-en">ALL DEPARTMENTS</span>
                                <span className="lang-hi">सभी विभाग</span>
                                <span className="material-icons">apps</span>
                            </button>
                        </div>

                        {/* Equal-height tiles — grid uses align-items:stretch */}
                        <div className="kiosk-grid" style={{ gridTemplateColumns: 'var(--kiosk-grid-main)', gap: 'var(--kiosk-gap)', alignItems: 'stretch' }}>
                            {CITIZEN_SERVICES.map(svc => (
                                <div key={svc.label}
                                    className="kiosk-glass"
                                    style={{
                                        padding: '24px 16px', borderRadius: 24, position: 'relative',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        cursor: svc.comingSoon ? 'default' : 'pointer',
                                        transition: 'all 0.3s ease', textAlign: 'center',
                                        opacity: svc.comingSoon ? 0.72 : 1,
                                        minHeight: 'var(--kiosk-tile-min-h, 220px)',
                                    }}
                                    onClick={() => !svc.comingSoon && svc.path && navigate(svc.path)}
                                    onMouseEnter={e => {
                                        if (svc.comingSoon) return;
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.borderColor = svc.color;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                                    }}
                                >
                                    {svc.comingSoon && (
                                        <div style={{ position: 'absolute', top: 10, right: 10, background: '#f39c12', color: '#fff', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 10 }}>
                                            SOON
                                        </div>
                                    )}
                                    {/* Icon */}
                                    <div style={{
                                        color: svc.color, background: `${svc.color}15`, width: 70, height: 70,
                                        borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 12, flexShrink: 0,
                                        border: `2px solid ${svc.color}25`
                                    }}>
                                        <Icon name={svc.icon} size={40} color={svc.color} />
                                    </div>
                                    {/* Label — language-switching */}
                                    <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--gov-navy)', textTransform: 'uppercase', marginBottom: 4 }}>
                                        <span className="lang-en">{svc.label}</span>
                                        <span className="lang-hi kiosk-gov-tile-hi" style={{ textTransform: 'none', fontSize: 18 }}>{svc.labelHi}</span>
                                    </div>
                                    {/* Desc — pinned to bottom via flex-grow spacer */}
                                    <div style={{ flex: 1 }} />
                                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, lineHeight: 1.4 }}>
                                        <span className="lang-en">{svc.desc}</span>
                                        <span className="lang-hi">{svc.descHi}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. QUICK TRACK & EMERGENCY */}
                    <div className="kiosk-grid" style={{ gridTemplateColumns: 'var(--kiosk-grid-side)', gap: 'var(--kiosk-gap)', marginBottom: 'var(--kiosk-gap)' }}>
                        {/* Quick Track Card */}
                        <div className="kiosk-glass-dark" style={{ borderRadius: 24, padding: 'var(--kiosk-p-lg)', position: 'relative', overflow: 'hidden' }}>
                            <div className="desktop-only" style={{ position: 'absolute', top: -150, right: -150, width: 400, height: 400, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                                    <div style={{ padding: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 15 }}>
                                        <Icon name="track_changes" size={32} color="var(--gov-saffron)" />
                                    </div>
                                    <div>
                                        <div className="kiosk-text-display" style={{ fontSize: 'calc(var(--kiosk-subtitle-size) * 0.9)', color: '#fff', lineHeight: 1.2 }}>
                                            <span className="lang-en">Track Application</span>
                                            <span className="lang-hi">आवेदन स्थिति</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 15, marginTop: 25, flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        placeholder="SVDH-0000"
                                        className="kiosk-input-elite"
                                        style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', padding: '15px 20px', borderRadius: 16, color: '#fff', fontSize: 24, fontWeight: 900, fontFamily: 'monospace', outline: 'none' }}
                                        value={trackId}
                                        onChange={e => setTrackId(e.target.value.toUpperCase())}
                                    />
                                    <button
                                        className="kiosk-btn-premium"
                                        style={{ width: 'var(--kiosk-btn-w, 200px)', background: 'var(--gov-saffron)', color: '#fff', fontSize: 18, height: 60 }}
                                        onClick={() => navigate(`/status?id=${trackId}`)}
                                        disabled={!trackId.trim()}
                                    >
                                        TRACK
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="kiosk-glass" style={{ border: '3px solid #fee2e2', borderRadius: 24, padding: 'var(--kiosk-p-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', marginBottom: 4 }}>
                                <span className="lang-en">Emergency</span>
                                <span className="lang-hi">आपातकाल</span>
                            </div>
                            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--gov-navy)', lineHeight: 1 }}>112</div>
                        </div>
                    </div>

                    {/* 6. ELITE FOOTER BAR (GLASSMORPHISM) */}
                    <div className="kiosk-glass" style={{ padding: 'var(--kiosk-p-lg)', borderRadius: 24, border: '2px dashed rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: 40 }}>
                        <div className="desktop-only" style={{ display: 'flex', justifyContent: 'center', gap: 60, marginBottom: 40 }}>
                            {STATS.map(s => (
                                <div key={s.label} style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--gov-navy)', lineHeight: 1 }}>{s.num}</div>
                                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginTop: 5 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                            <button
                                className="kiosk-btn-premium"
                                onClick={() => { logout(); navigate('/login'); }}
                                style={{ width: '100%', maxWidth: 400, height: 80, background: '#fff', border: '2px solid #fee2e2', borderRadius: 20 }}
                            >
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <span className="kiosk-gov-btn-hi" style={{ color: '#ef4444', fontSize: 18 }}>लॉगआउट करें</span>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>SECURE LOGOUT</div>
                                </div>
                                <Icon name="logout" size={32} color="#ef4444" />
                            </button>
                        </div>

                        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 20, opacity: 0.6, flexWrap: 'wrap' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png" alt="Digital India" style={{ height: 40 }} />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem" style={{ height: 50 }} />
                        </div>

                        <div style={{ marginTop: 20, fontSize: 13, color: '#64748b', fontWeight: 700 }}>
                            SUVIDHA Platform v4.2.0 | Ministry of Electronics & IT
                        </div>
                    </div>

                </div>
            </div>
        </GovLayout>
    );
}
