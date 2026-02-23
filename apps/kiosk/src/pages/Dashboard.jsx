import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';

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
    { icon: 'electric_bolt', label: 'Electricity', labelHi: 'विद्युत', path: '/service-request', color: '#1a5276' },
    { icon: 'water_drop', label: 'Water Supply', labelHi: 'जल सेवा', path: '/service-request', color: '#117a65' },
    { icon: 'local_fire_department', label: 'Gas Service', labelHi: 'गैस सेवा', path: '/service-request', color: '#c0392b' },
    { icon: 'home_work', label: 'Property Tax', labelHi: 'संपत्ति कर', path: '/bill-payment', color: '#7d6608' },
    { icon: 'report_problem', label: 'Grievance', labelHi: 'शिकायत', path: '/complaint', color: '#6c3483' },
    { icon: 'location_city', label: 'Municipal', labelHi: 'नगर निगम', path: '/departments', color: '#003366' },
    { icon: 'description', label: 'Certificates', labelHi: 'प्रमाणपत्र', path: '/service-request', color: '#1e8449' },
    { icon: 'manage_search', label: 'Track Status', labelHi: 'स्थिति', path: '/status', color: '#2e4057' },
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

    const [slide, setSlide] = useState(0);
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
            <div className="kiosk-ticker-elite" style={{ height: 60, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 100 }}>
                <div style={{ background: 'var(--gov-saffron)', color: '#fff', padding: '0 30px', height: '100%', display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: 16, zIndex: 10, boxShadow: '10px 0 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
                    <Icon name="campaign" size={24} style={{ marginRight: 10 }} />
                    LATEST UPDATES / नवीनतम अपडेट
                </div>
                <div className="gov-ticker" style={{ flex: 1, whiteSpace: 'nowrap', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                    {NEWS_ITEMS.map((n, i) => (
                        <span key={i} style={{ margin: '0 50px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gov-saffron)', boxShadow: '0 0 10px var(--gov-saffron)' }}></div>
                            {n.text}
                        </span>
                    ))}
                </div>
            </div>

            <div className="kiosk-gradient-patriotic" style={{ padding: '40px 0', minHeight: '100vh' }}>
                <div className="kiosk-container">

                    {/* 2. PREMIUM WELCOME HEADER (GLASSMORPHISM) */}
                    <div className="kiosk-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50, padding: '40px 60px', borderRadius: 40, border: '2px solid rgba(255,255,255,0.5)' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 10 }}>
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }}></div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gov-navy)', textTransform: 'uppercase', letterSpacing: 2 }}>KIOSK UNIT SVDH-001 (ACTIVE)</div>
                            </div>
                            <h1 className="kiosk-text-display" style={{ fontSize: 56, color: 'var(--gov-navy)', margin: 0 }}>
                                SUVIDHA Gateway
                                <span style={{ display: 'block', fontSize: 36, color: 'var(--gov-saffron)', fontWeight: 800, marginTop: 5 }}>जन सेवा केंद्र में आपका स्वागत है</span>
                            </h1>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', gap: 30, alignItems: 'center' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--gov-navy)', fontFamily: 'monospace', lineHeight: 1 }}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ fontSize: 20, color: '#64748b', fontWeight: 700, marginTop: 5 }}>
                                    {new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                                </div>
                            </div>
                            <div style={{ padding: '25px', background: 'rgba(255,255,255,0.5)', borderRadius: 30, border: '1.5px solid #fff' }}>
                                <Icon name="wifi_tethering" size={48} color="var(--gov-navy)" />
                            </div>
                        </div>
                    </div>

                    {/* 3. HERO SHOWCASE CAROUSEL (UPGRADED) */}
                    <div style={{ marginBottom: 60, position: 'relative', height: 320, borderRadius: 50, overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)' }}>
                        {BANNER_SLIDES.map((s, i) => (
                            <div key={s.id} style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: s.bg, opacity: slide === i ? 1 : 0, transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                padding: '60px 80px', color: '#fff', display: 'flex', alignItems: 'center', pointerEvents: slide === i ? 'auto' : 'none'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ background: 'rgba(255,255,255,0.25)', padding: '10px 25px', borderRadius: 100, fontSize: 16, fontWeight: 900, width: 'fit-content', marginBottom: 20, backdropFilter: 'blur(10px)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                        {s.tag}
                                    </div>
                                    <h2 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 15px 0', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>{s.title}</h2>
                                    <p style={{ fontSize: 26, opacity: 0.9, maxWidth: 800, fontWeight: 600, lineHeight: 1.4 }}>{s.subtitle}</p>
                                </div>
                                <div style={{ width: 180, height: 180, background: 'rgba(255,255,255,0.2)', borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}>
                                    <Icon name={s.icon} size={90} color="#fff" />
                                </div>
                            </div>
                        ))}
                        <div style={{ position: 'absolute', bottom: 40, right: 80, display: 'flex', gap: 15 }}>
                            {BANNER_SLIDES.map((_, i) => (
                                <button key={i} onClick={() => goSlide(i)} style={{
                                    width: slide === i ? 60 : 16, height: 16, borderRadius: 10, background: slide === i ? '#fff' : 'rgba(255,255,255,0.4)',
                                    border: 'none', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer'
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* 4. MAIN SERVICE CORE (ELITE GLASS TILES) */}
                    <div style={{ marginBottom: 60 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                            <div style={{ borderLeft: '12px solid var(--gov-saffron)', paddingLeft: 25 }}>
                                <h2 className="kiosk-text-display" style={{ fontSize: 42, color: 'var(--gov-navy)', margin: 0 }}>Citizen Services Center / नागरिक सेवा केंद्र</h2>
                                <p style={{ fontSize: 22, color: '#334155', margin: '5px 0 0 0', fontWeight: 700 }}>Select a category to begin your application process.</p>
                            </div>
                            <button className="kiosk-btn-premium" style={{ background: 'var(--gov-navy)', color: '#fff', height: 80, padding: '0 40px' }} onClick={() => navigate('/departments')}>
                                ALL DEPARTMENTS
                                <span className="material-icons">apps</span>
                            </button>
                        </div>

                        <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 35 }}>
                            {CITIZEN_SERVICES.map(svc => (
                                <div key={svc.label}
                                    className="kiosk-glass"
                                    style={{
                                        padding: '50px 30px', borderRadius: 40,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center'
                                    }}
                                    onClick={() => navigate(svc.path)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-15px)';
                                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.borderColor = svc.color;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                                    }}
                                >
                                    <div style={{
                                        color: svc.color, background: `${svc.color}15`, width: 120, height: 120,
                                        borderRadius: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30,
                                        boxShadow: `0 15px 30px ${svc.color}20`, border: `2px solid ${svc.color}30`
                                    }}>
                                        <Icon name={svc.icon} size={70} color={svc.color} />
                                    </div>
                                    <div className="kiosk-gov-tile-hi" style={{ fontSize: 28, color: svc.color, marginBottom: 8 }}>{svc.labelHi}</div>
                                    <div className="kiosk-tile__label" style={{ fontSize: 24, fontWeight: 900, color: 'var(--gov-navy)', textTransform: 'uppercase' }}>{svc.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. QUICK TRACK & EMERGENCY (ULTRA HIGH IMPACT) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 40, marginBottom: 60 }}>
                        {/* Quick Track Card */}
                        <div className="kiosk-glass-dark" style={{ borderRadius: 50, padding: 60, position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,33,71,0.3)' }}>
                            <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 15 }}>
                                    <div style={{ padding: 15, background: 'rgba(255,255,255,0.15)', borderRadius: 20 }}>
                                        <Icon name="track_changes" size={48} color="var(--gov-saffron)" />
                                    </div>
                                    <div>
                                        <div className="kiosk-text-display" style={{ fontSize: 36, color: '#fff' }}>Track Status / आवेदन स्थिति</div>
                                        <p style={{ fontSize: 20, opacity: 0.8, margin: 0, fontWeight: 600 }}>Enter your Ticket ID for real-time verification.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                                    <input
                                        type="text"
                                        placeholder="SVDH-0000-0000"
                                        className="kiosk-input-elite"
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '3.5px solid rgba(255,255,255,0.2)', padding: '30px 40px', borderRadius: 28, color: '#fff', fontSize: 32, fontWeight: 900, fontFamily: 'monospace', outline: 'none', textAlign: 'center' }}
                                    />
                                    <button className="kiosk-btn-premium" style={{ width: 280, background: 'var(--gov-saffron)', color: '#fff', fontSize: 24 }} onClick={() => navigate('/status')}>
                                        TRACK NOW
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="kiosk-glass" style={{ border: '4px solid #fee2e2', borderRadius: 50, padding: 60, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ width: 100, height: 100, background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 15px 30px rgba(239, 68, 68, 0.2)' }}>
                                <Icon name="emergency" size={54} color="#ef4444" />
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 2 }}>Emergency</div>
                            <div style={{ fontSize: 72, fontWeight: 900, color: 'var(--gov-navy)', margin: '10px 0', lineHeight: 1 }}>112</div>
                            <p style={{ fontSize: 18, color: '#64748b', fontWeight: 700 }}>Toll-free Central Line</p>
                        </div>
                    </div>

                    {/* 6. ELITE FOOTER BAR (GLASSMORPHISM) */}
                    <div className="kiosk-glass" style={{ padding: '60px 80px', borderRadius: 50, border: '2.5px dashed rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: 40 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 80, marginBottom: 50 }}>
                            {STATS.map(s => (
                                <div key={s.label} style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--gov-navy)', lineHeight: 1 }}>{s.num}</div>
                                    <div style={{ fontSize: 16, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginTop: 10 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
                            <button
                                className="kiosk-btn-premium"
                                onClick={() => { logout(); navigate('/login'); }}
                                style={{ width: 450, height: 100, background: '#fff', border: '3.5px solid #fee2e2', borderRadius: 30 }}
                            >
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <span className="kiosk-gov-btn-hi" style={{ color: '#ef4444', fontSize: 24 }}>लॉगआउट करें</span>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>SECURE LOGOUT ({user?.mobile || '99XXXXXX'})</div>
                                </div>
                                <Icon name="logout" size={42} color="#ef4444" />
                            </button>
                        </div>

                        <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', gap: 40, opacity: 0.6 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png" alt="Digital India" style={{ height: 50 }} />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem" style={{ height: 60 }} />
                        </div>

                        <div style={{ marginTop: 30, fontSize: 16, color: '#64748b', fontWeight: 700 }}>
                            Official SUVIDHA Digital Platform v4.2.0 | Ministry of Electronics & IT | Digital India Initiative
                        </div>
                    </div>

                </div>
            </div>
        </GovLayout>
    );
}
