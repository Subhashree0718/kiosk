import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ── Icon helper ─────────────────────────────────────────────────── */
const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>
        {name}
    </span>
);

/* ── Nav items ───────────────────────────────────────────────────── */
const NAV_ITEMS = [
    { label: 'Home', path: '/dashboard', icon: 'home' },
    { label: 'Services', path: '/dashboard', icon: null },
    { label: 'Departments', path: '/departments', icon: null },
    { label: 'Track Status', path: '/status', icon: null },
    { label: 'Grievances', path: '/complaint', icon: null },
    { label: 'Contact Us', path: '/contact', icon: null },
];

const TICKER_TEXT =
    'SUVIDHA Kiosk — Citizen Services Portal. ' +
    'e-Shram Registration now available at all kiosk locations. ' +
    'New: Gas subsidy transfer online — apply via Gas Service department. ' +
    'Property Tax dues can be paid at this kiosk. ' +
    'For grievance status, use Track Status with your Ticket ID.';

export default function GovLayout({ children, breadcrumbs = [], showSidebar = false, sidebar = null }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [fontSize, setFontSize] = useState(14);
    const [lang, setLang] = useState('en');

    useEffect(() => { document.body.style.fontSize = fontSize + 'px'; }, [fontSize]);

    return (
        <div className="gov-shell">

            {/* ══ 1. TOP UTILITY BAR ════════════════════════════════ */}
            <div className="gov-utility-bar">
                <div className="gov-utility-bar__left">
                    <a href="#main-content">Skip to Main Content</a>
                    <span className="gov-utility-bar__sep">|</span>
                    <a href="/contact">Screen Reader Access</a>
                    <span className="gov-utility-bar__sep">|</span>
                    <a href="/contact">Sitemap</a>
                </div>
                <div className="gov-utility-bar__right">
                    <span style={{ color: '#aaa', fontSize: 11 }}>Text Size:</span>
                    <button className="gov-font-btn" onClick={() => setFontSize(f => Math.max(11, f - 1))}>A-</button>
                    <button className="gov-font-btn" onClick={() => setFontSize(14)}>A</button>
                    <button className="gov-font-btn" onClick={() => setFontSize(f => Math.min(18, f + 1))}>A+</button>
                    <span className="gov-utility-bar__sep">|</span>
                    <button className="gov-lang-btn"
                        onClick={() => setLang('hi')}
                        style={lang === 'hi' ? { background: 'var(--gov-saffron)', color: '#fff', borderRadius: 2, padding: '2px 6px' } : {}}
                    >हिन्दी</button>
                    <button className="gov-lang-btn"
                        onClick={() => setLang('en')}
                        style={lang === 'en' ? { background: 'var(--gov-saffron)', color: '#fff', borderRadius: 2, padding: '2px 6px' } : {}}
                    >English</button>
                </div>
            </div>

            {/* ══ 2. SITE HEADER ════════════════════════════════════ */}
            <header className="gov-header">
                <img
                    className="gov-header__emblem"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/240px-Emblem_of_India.svg.png"
                    alt="State Emblem of India"
                    onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="gov-header__titles">
                    <div className="gov-header__hi">भारत सरकार | Government of India</div>
                    <div className="gov-header__name">SUVIDHA – सुविधा</div>
                    <div className="gov-header__subtitle">
                        Smart Urban Virtual Interactive Digital Helpdesk Assistant
                    </div>
                </div>
                <div className="gov-header__right">
                    <img
                        className="gov-header__logo-right"
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png"
                        alt="Digital India"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="gov-header__search">
                        <input type="text" placeholder="Search…" aria-label="Search" />
                        <button aria-label="Search">
                            <Icon name="search" size={16} color="#fff" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ══ 3. PRIMARY NAV ════════════════════════════════════ */}
            <nav className="gov-navbar" role="navigation" aria-label="Main Navigation">
                {NAV_ITEMS.map((item, idx) => {
                    const isActive =
                        location.pathname === item.path ||
                        (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    return (
                        <button
                            key={item.label}
                            className={[
                                'gov-navbar__item',
                                idx === 0 ? 'gov-navbar__item--home' : '',
                                isActive && idx !== 0 ? 'gov-navbar__item--active' : '',
                            ].join(' ').trim()}
                            onClick={() => navigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {idx === 0 && <Icon name="home" size={16} color="#fff" style={{ marginRight: 5 }} />}
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* ══ 4. TICKER BAR ═════════════════════════════════════ */}
            <div className="gov-ticker">
                <span className="gov-ticker__label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="campaign" size={14} color="#fff" />
                    NOTICE
                </span>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                    <span className="gov-ticker__content">{TICKER_TEXT}</span>
                </div>
            </div>

            {/* ══ 5. PAGE CONTENT ═══════════════════════════════════ */}
            <main className="gov-page" id="main-content" role="main">
                <div className="gov-container">

                    {/* Breadcrumb */}
                    {breadcrumbs.length > 0 && (
                        <nav className="gov-breadcrumb" aria-label="Breadcrumb">
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gov-navy)', fontSize: 'inherit', padding: 0, display: 'flex', alignItems: 'center', gap: 3 }}
                                onClick={() => navigate('/dashboard')}
                            >
                                <Icon name="home" size={14} />
                                Home
                            </button>
                            {breadcrumbs.map((crumb, i) => (
                                <React.Fragment key={i}>
                                    <span className="gov-breadcrumb__sep">
                                        <Icon name="chevron_right" size={16} />
                                    </span>
                                    {i === breadcrumbs.length - 1
                                        ? <span className="gov-breadcrumb__current">{crumb}</span>
                                        : <span>{crumb}</span>}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}

                    {showSidebar ? (
                        <div className="gov-main-content">
                            <div>{children}</div>
                            <aside>{sidebar}</aside>
                        </div>
                    ) : children}

                </div>
            </main>

            {/* ══ 6. FOOTER ═════════════════════════════════════════ */}
            <footer className="gov-footer" role="contentinfo">
                <div className="gov-footer__main">

                    {/* About */}
                    <div>
                        <div className="gov-footer__heading">About SUVIDHA</div>
                        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#b0bec5' }}>
                            SUVIDHA (Smart Urban Virtual Interactive Digital Helpdesk Assistant) is a
                            citizen services kiosk initiative under the Ministry of Housing &amp; Urban Affairs,
                            Government of India, providing easy access to civic services for all citizens.
                        </p>
                        <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/240px-Emblem_of_India.svg.png"
                                alt="Emblem" style={{ height: 34, filter: 'brightness(0.65) grayscale(0.3)' }}
                                onError={e => e.target.style.display = 'none'}
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png"
                                alt="Digital India" style={{ height: 32, filter: 'brightness(0.65) grayscale(0.3)' }}
                                onError={e => e.target.style.display = 'none'}
                            />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="gov-footer__heading">Quick Links</div>
                        <ul className="gov-footer__links">
                            {[
                                ['Dashboard', '/dashboard'],
                                ['Departments', '/departments'],
                                ['Track Status', '/status'],
                                ['Lodge Complaint', '/complaint'],
                                ['Service Request', '/service-request'],
                                ['Contact Us', '/contact'],
                            ].map(([label, path]) => (
                                <li key={label}>
                                    <button
                                        onClick={() => navigate(path)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0bec5', fontSize: 12.5, padding: 0, fontFamily: 'var(--gov-font)', display: 'flex', alignItems: 'center', gap: 5 }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--gov-saffron)'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#b0bec5'}
                                    >
                                        <Icon name="arrow_right" size={16} />
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <div className="gov-footer__heading">Policies</div>
                        <ul className="gov-footer__links">
                            {['Terms & Conditions', 'Privacy Policy', 'Disclaimer',
                                'Accessibility Statement', 'Website Policy', 'Copyright Policy'].map(label => (
                                    <li key={label}>
                                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <Icon name="arrow_right" size={16} />{label}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="gov-footer__heading">Contact Us</div>
                        <div style={{ fontSize: 12.5, color: '#b0bec5', lineHeight: 2 }}>
                            {[
                                { icon: 'location_on', text: 'Nirman Bhavan, New Delhi — 110 001' },
                                { icon: 'phone', text: '1800-11-0001 (Toll Free)' },
                                { icon: 'print', text: '011-2306-1234' },
                                { icon: 'email', text: 'helpdesk@suvidha.gov.in' },
                            ].map(r => (
                                <div key={r.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <Icon name={r.icon} size={14} color="#78909c" style={{ marginTop: 3, flexShrink: 0 }} />
                                    <span>{r.text}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: 8, fontSize: 11.5, color: '#78909c' }}>
                                Mon–Fri: 9:00 AM – 5:30 PM<br />Sat: 9:00 AM – 1:00 PM
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="gov-footer__bottom">
                    <div>
                        &copy; {new Date().getFullYear()} SUVIDHA Kiosk Initiative, Government of India.
                        &nbsp;|&nbsp;<a href="/">Terms</a>
                        &nbsp;|&nbsp;<a href="/">Privacy</a>
                        &nbsp;|&nbsp;<a href="/">Disclaimer</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#78909c' }}>
                            <Icon name="visibility" size={14} />
                            Visitors: <span style={{ background: '#0a2540', padding: '2px 8px', borderRadius: 3, color: '#4fc3f7', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>1,24,839</span>
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="update" size={14} />
                            Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </footer>

        </div>
    );
}
