import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';

/* ── Helper: Material Icon ─────────────────────────────────────── */
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

    /* ── Sidebar ──────────────────────────────────────────────── */
    const SidebarContent = (
        <>
            {/* Emergency Helplines */}
            <div className="gov-widget">
                <div className="gov-widget__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="phone_in_talk" size={16} />
                    Emergency Helplines
                </div>
                <div className="gov-widget__body">
                    <div style={{ fontSize: 11.5, color: 'var(--gov-text-muted)', marginBottom: 8 }}>
                        Toll-free &nbsp;|&nbsp; 24x7 Available
                    </div>
                    {HELPLINES.map(h => (
                        <div key={h.label} className="gov-helpline-row">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                                <Icon name={h.icon} size={15} color="var(--gov-navy)" />
                                {h.label}
                            </span>
                            <span className="gov-helpline-num">{h.number}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 8, padding: '6px 0', borderTop: '1px solid var(--gov-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#c0392b', fontSize: 13 }}>
                            <Icon name="emergency" size={16} color="#c0392b" />
                            Emergency
                        </span>
                        <span className="gov-helpline-num" style={{ color: '#c0392b', fontSize: 16 }}>112</span>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="gov-widget">
                <div className="gov-widget__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="flash_on" size={16} />
                    Quick Access
                </div>
                <div className="gov-widget__body" style={{ padding: 8 }}>
                    {QUICK_ACCESS.map(b => (
                        <button key={b.label} onClick={() => navigate(b.path)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                width: '100%', margin: '4px 0',
                                background: b.bg, color: '#fff', border: 'none',
                                padding: '9px 12px', borderRadius: 'var(--gov-radius)',
                                cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                                fontFamily: 'var(--gov-font)', transition: 'filter 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                        >
                            <Icon name={b.icon} size={17} />
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Useful Links */}
            <div className="gov-widget">
                <div className="gov-widget__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="link" size={16} />
                    Government Links
                </div>
                <div className="gov-widget__body">
                    {USEFUL_LINKS.map(([label, url]) => (
                        <div key={label} style={{ padding: '5px 0', borderBottom: '1px dashed #dde3ee', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon name="open_in_new" size={13} color="var(--gov-text-muted)" />
                            <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: 'var(--gov-navy)' }}>
                                {label}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    /* ── Render ───────────────────────────────────────────────── */
    return (
        <GovLayout breadcrumbs={[]} showSidebar sidebar={SidebarContent}>

            {/* Hero Slider */}
            <div style={{ position: 'relative', marginBottom: 16, borderRadius: 'var(--gov-radius)', overflow: 'hidden', boxShadow: 'var(--gov-shadow)' }}>
                {BANNER_SLIDES.map((s, i) => (
                    <div key={s.id} style={{ display: i === slide ? 'flex' : 'none', background: s.bg, height: 270, alignItems: 'center', padding: '0 40px', gap: 30 }}>
                        <div style={{
                            width: 90, height: 90, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)',
                        }}>
                            <Icon name={s.icon} size={48} color="#fff" />
                        </div>
                        <div>
                            <div style={{
                                display: 'inline-block', background: 'var(--gov-saffron)',
                                color: '#fff', fontSize: 11, fontWeight: 700,
                                padding: '3px 10px', borderRadius: 2, marginBottom: 10,
                                letterSpacing: '0.8px', textTransform: 'uppercase',
                            }}>{s.tag}</div>
                            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{s.title}</div>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6 }}>{s.subtitle}</div>
                        </div>
                    </div>
                ))}
                <button className="gov-hero__prev" onClick={() => goSlide((slide - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)}>
                    <Icon name="chevron_left" size={24} />
                </button>
                <button className="gov-hero__next" onClick={() => goSlide((slide + 1) % BANNER_SLIDES.length)}>
                    <Icon name="chevron_right" size={24} />
                </button>
                <div className="gov-hero__indicators">
                    {BANNER_SLIDES.map((_, i) => (
                        <button key={i} className={`gov-hero__dot${i === slide ? ' gov-hero__dot--active' : ''}`}
                            onClick={() => goSlide(i)} />
                    ))}
                </div>
            </div>

            {/* Stats Strip */}
            <div className="gov-stats-strip" style={{ marginBottom: 16, borderRadius: 'var(--gov-radius)', overflow: 'hidden' }}>
                {STATS.map(s => (
                    <div key={s.label} className="gov-stat-item">
                        <Icon name={s.icon} size={22} color="var(--gov-saffron)" style={{ marginBottom: 4 }} />
                        <div className="gov-stat-item__num">{s.num}</div>
                        <div className="gov-stat-item__label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Citizen Services */}
            <div className="gov-card" style={{ marginBottom: 16 }}>
                <div className="gov-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="account_balance" size={18} />
                        Citizen Services / नागरिक सेवाएं
                    </span>
                    <span className="gov-section-title__more" onClick={() => navigate('/departments')}>
                        View All Departments
                    </span>
                </div>
                <div className="gov-service-grid">
                    {CITIZEN_SERVICES.map(svc => (
                        <div key={svc.label} className="gov-service-tile" onClick={() => navigate(svc.path)}>
                            <div style={{
                                width: 54, height: 54, borderRadius: '50%',
                                background: svc.color + '18',
                                border: `2px solid ${svc.color}35`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon name={svc.icon} size={26} color={svc.color} />
                            </div>
                            <div>
                                <div className="gov-service-tile__label" style={{ color: svc.color }}>{svc.label}</div>
                                <div className="gov-service-tile__desc">{svc.labelHi}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News & Announcements */}
            <div className="gov-card" style={{ marginBottom: 16 }}>
                <div className="gov-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="newspaper" size={18} />
                        Latest News & Announcements
                    </span>
                    <span className="gov-section-title__more">View All</span>
                </div>
                <ul className="gov-news-list">
                    {NEWS_ITEMS.map((n, i) => (
                        <li key={i} className="gov-news-item">
                            <span className={`gov-news-date${n.isNew ? ' gov-news-date--new' : ''}`}>{n.date}</span>
                            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1 }}>
                                <Icon name="arrow_right" size={18} color="var(--gov-navy)" style={{ flexShrink: 0, marginTop: 1 }} />
                                <span className="gov-news-link">
                                    {n.text}
                                    {n.isNew && <span className="gov-badge-new">NEW</span>}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Government Schemes */}
            <div className="gov-card" style={{ marginBottom: 16 }}>
                <div className="gov-card__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="star_border" size={18} />
                    Government Schemes / सरकारी योजनाएं
                </div>
                <div className="gov-scheme-grid">
                    {SCHEMES.map(sc => (
                        <div key={sc.name} className="gov-scheme-card">
                            <div className="gov-scheme-card__banner" style={{ background: sc.color }} />
                            <div className="gov-scheme-card__body">
                                <Icon name={sc.icon} size={28} color={sc.color} style={{ marginBottom: 8, display: 'block' }} />
                                <div className="gov-scheme-card__name">{sc.name}</div>
                                <div className="gov-scheme-card__desc">{sc.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <div style={{ textAlign: 'right', marginBottom: 8 }}>
                <button
                    className="gov-btn gov-btn--outline gov-btn--sm"
                    onClick={() => { logout(); navigate('/login'); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                    <Icon name="logout" size={16} />
                    {user?.mobile ? `Logout (${user.mobile})` : 'Logout'}
                </button>
            </div>

        </GovLayout>
    );
}
