import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKioskStore } from '../store/index.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { HEADER_LANGUAGES } from '../config/languages.js';

/* ── Icon helper ─────────────────────────────────────────────────── */
const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>
        {name}
    </span>
);

/* ── Nav items ───────────────────────────────────────────────────── */
const NAV_DEFS = [
    { key: 'home', path: '/dashboard', icon: 'home' },
    { key: 'services', path: '/departments', icon: 'widgets' },
    { key: 'departments', path: '/departments', icon: 'business' },
    { key: 'trackStatus', path: '/status', icon: 'track_changes' },
    { key: 'grievances', path: '/complaint', icon: 'campaign' },
    { key: 'profile', path: '/profile', icon: 'account_circle' },
    { key: 'contactUs', path: '/contact', icon: 'support_agent' },
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
    const storeLanguage = useKioskStore(s => s.language);
    const setStoreLanguage = useKioskStore(s => s.setLanguage);
    const { t } = useTranslation();

    useEffect(() => { document.body.style.fontSize = fontSize + 'px'; }, [fontSize]);

    return (
        <div className="gov-shell">

            {/* ══ 1. TOP UTILITY BAR ════════════════════════════════ */}
            <div className="kiosk-gov-strip"></div>
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
                    {HEADER_LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            className={
                                'gov-lang-btn' +
                                (storeLanguage === lang.code ? ' gov-lang-btn--active' : '')
                            }
                            onClick={() => setStoreLanguage(lang.code)}
                        >
                            {lang.headerLabel}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ 2. SITE HEADER ════════════════════════════════════ */}
            <header className="kiosk-gov-header">
                <img
                    className="kiosk-gov-emblem"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                    alt="State Emblem of India"
                    onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">{t('layout.header.suvidhaTitle')}</div>
                    <div className="kiosk-gov-text-en">{t('layout.header.tagline')}</div>
                    <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{t('layout.header.govOfIndia')}</div>
                </div>
            </header>

            {/* ══ 3. PRIMARY NAV ════════════════════════════════════ */}
            <nav className="gov-navbar" role="navigation" aria-label="Main Navigation">
                {NAV_DEFS.map((item, idx) => {
                    const label = storeLanguage === 'hi' ? item.hi : item.en;
                    const isActive =
                        location.pathname === item.path ||
                        (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    return (
                        <button
                            key={item.en}
                            className={[
                                'gov-navbar__item',
                                idx === 0 ? 'gov-navbar__item--home' : '',
                                isActive && idx !== 0 ? 'gov-navbar__item--active' : '',
                            ].join(' ').trim()}
                            onClick={() => navigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {idx === 0 && <Icon name="home" size={16} color="#fff" style={{ marginRight: 5 }} />}
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* ══ 4. TICKER BAR ═════════════════════════════════════ */}
            <div className="gov-ticker">
                <span className="gov-ticker__label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="campaign" size={14} color="#fff" />
                    {t('layout.ticker.label')}
                </span>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                    <span className="gov-ticker__content">{t('layout.ticker.text')}</span>
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
                                {t('layout.breadcrumb.home')}
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
                        <div className="gov-footer__heading">{t('layout.footer.aboutTitle')}</div>
                        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#b0bec5' }}>
                            SUVIDHA (Smart Urban Virtual Interactive Digital Helpdesk Assistant) is a
                            citizen services kiosk initiative organized by C-DAC for the SUVIDHA Hackathon 2026 under the Ministry of Electronics &amp; Information Technology (MeitY),
                            Government of India, providing easy access to civic services for all citizens.
                        </p>
                        <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/240px-Emblem_of_India.svg.png"
                                alt="Emblem" style={{ height: 34, filter: 'brightness(0.65) grayscale(0.3)' }}
                                onError={e => e.target.style.display = 'none'}
                            />
                            <img
                                src="/digital-india.svg"
                                alt="Digital India" style={{ height: 32, filter: 'brightness(0.65) grayscale(0.3)' }}
                                onError={e => e.target.style.display = 'none'}
                            />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="gov-footer__heading">{t('layout.footer.quickLinksTitle')}</div>
                        <ul className="gov-footer__links">
                            {[
                                ['dashboard', '/dashboard'],
                                ['departments', '/departments'],
                                ['trackStatus', '/status'],
                                ['lodgeComplaint', '/complaint'],
                                ['serviceRequest', '/service-request'],
                                ['contactUs', '/contact'],
                            ].map(([key, path]) => (
                            <li key={key}>
                                    <button
                                        onClick={() => navigate(path)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0bec5', fontSize: 12.5, padding: 0, fontFamily: 'var(--gov-font)', display: 'flex', alignItems: 'center', gap: 5 }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--gov-saffron)'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#b0bec5'}
                                    >
                                        <Icon name="arrow_right" size={16} />
                                        {t(`layout.footer.quickLinks.${key}`)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <div className="gov-footer__heading">{t('layout.footer.policiesTitle')}</div>
                        <ul className="gov-footer__links">
                            {['terms', 'privacy', 'disclaimer',
                                'accessibility', 'websitePolicy', 'copyright'].map(key => (
                                    <li key={key}>
                                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <Icon name="arrow_right" size={16} />{t(`layout.footer.policies.${key}`)}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="gov-footer__heading">{t('layout.footer.contactTitle')}</div>
                        <div style={{ fontSize: 12.5, color: '#b0bec5', lineHeight: 2 }}>
                            {[
                                { icon: 'location_on', text: 'C-DAC Centers: Bangalore, Delhi, Hyderabad, and CINE' },
                                { icon: 'phone', text: '1800-11-0001 (Toll Free)' },
                                { icon: 'email', text: 'smartcities.challenges@cdac.in' },
                                { icon: 'email', text: 'isc-smartcity2v0@cdac.in' },
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
                        &copy; {new Date().getFullYear()} {t('layout.footer.bottom.copyright')}
                        &nbsp;|&nbsp;<a href="/">{t('layout.footer.bottom.terms')}</a>
                        &nbsp;|&nbsp;<a href="/">{t('layout.footer.bottom.privacy')}</a>
                        &nbsp;|&nbsp;<a href="/">{t('layout.footer.bottom.disclaimer')}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#78909c' }}>
                            <Icon name="visibility" size={14} />
                            {t('layout.footer.bottom.visitors')}: <span style={{ background: '#0a2540', padding: '2px 8px', borderRadius: 3, color: '#4fc3f7', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>1,24,839</span>
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="update" size={14} />
                            {t('layout.footer.bottom.lastUpdated')}: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </footer>

        </div >
    );
}
