import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>
        {name}
    </span>
);

/* ── Department data ─────────────────────────────────────────────── */
const DEPT_DATA = {
    gas: {
        slug: 'gas',
        name: 'Gas Service',
        nameHi: 'गैस सेवा',
        icon: 'local_fire_department',
        accentColor: '#c0392b',
        nodal: 'Ministry of Petroleum & Natural Gas',
        helpline: '1906',
        sla: '48 hours',
        description:
            'The Gas Service department manages LPG distribution, new connection approvals, cylinder booking, ' +
            'and subsidy transfers under the Pradhan Mantri Ujjwala Yojana (PMUY) scheme.',
        services: [
            { id: 's1', icon: 'add_circle', name: 'New LPG Connection', desc: 'Apply for a new domestic/commercial LPG connection.', fee: 'Rs. 0 (PMUY) / Rs. 750', sla: '15 days' },
            { id: 's2', icon: 'local_shipping', name: 'Cylinder Booking', desc: 'Book your next refill cylinder online.', fee: 'Market rate', sla: '24 hours' },
            { id: 's3', icon: 'account_balance_wallet', name: 'Subsidy Transfer', desc: 'Transfer LPG subsidy directly to your bank account.', fee: 'Free', sla: '3 days' },
            { id: 's4', icon: 'report_problem', name: 'Leakage Complaint', desc: 'Report gas leakage or pipeline issue urgently.', fee: 'Free', sla: '4 hours' },
            { id: 's5', icon: 'swap_horiz', name: 'Distributor Transfer', desc: 'Transfer your connection to a different distributor.', fee: 'Rs. 50', sla: '30 days' },
            { id: 's6', icon: 'person_add', name: 'Name Change', desc: 'Change registered name on the LPG account.', fee: 'Rs. 25', sla: '10 days' },
        ],
        faqs: [
            { q: 'How do I book a refill?', a: 'Call 1906, use the app, or visit this kiosk. Enter your Consumer ID and confirm.' },
            { q: 'When will I get the subsidy?', a: 'Subsidy is credited to your Aadhaar-linked bank account within 3 working days of refill.' },
            { q: 'What if I smell gas?', a: 'Immediately call 1906 (24x7), open windows, turn off appliances, and do NOT use electrical switches.' },
        ],
        notices: [
            { date: '21 Feb', text: 'PMUY Ujjwala 2.0 connection applications now open for BPL families.' },
            { date: '15 Feb', text: 'LPG price revision effective 1st March. Check updated rates on distributor portal.' },
        ],
    },
    electricity: {
        slug: 'electricity',
        name: 'Electricity Department',
        nameHi: 'विद्युत विभाग',
        icon: 'electric_bolt',
        accentColor: '#1a5276',
        nodal: 'State Electricity Board',
        helpline: '1912',
        sla: '24 hours',
        description:
            'The Electricity Department handles new connections, bill payment, power outage reporting, ' +
            'meter calibration, and industrial/commercial load extensions under the state electricity framework.',
        services: [
            { id: 's1', icon: 'power', name: 'New Connection', desc: 'Apply for a new residential or commercial electricity connection.', fee: 'Rs. 200–2000', sla: '7 days' },
            { id: 's2', icon: 'receipt', name: 'Bill Payment', desc: 'Pay your monthly electricity bill instantly.', fee: 'Convenience fee', sla: 'Instant' },
            { id: 's3', icon: 'flash_off', name: 'Outage Complaint', desc: 'Report a power cut or transformer failure in your area.', fee: 'Free', sla: '4 hours' },
            { id: 's4', icon: 'speed', name: 'Meter Complaint', desc: 'Report a faulty, running fast, or stopped meter.', fee: 'Free', sla: '48 hours' },
            { id: 's5', icon: 'upgrade', name: 'Load Enhancement', desc: 'Request an increase in sanctioned load for your connection.', fee: 'Rs. 500 onwards', sla: '30 days' },
            { id: 's6', icon: 'name_badge', name: 'Name Transfer', desc: 'Transfer electricity connection after property purchase/inheritance.', fee: 'Rs. 100', sla: '15 days' },
        ],
        faqs: [
            { q: 'How do I pay my bill online?', a: 'Enter your Consumer Number on the Bill Payment page. You can pay via UPI, card, or net banking.' },
            { q: 'When will power be restored?', a: 'Call 1912 to register an outage. Typical restoration time is 4 hours for residential areas.' },
            { q: 'What is the scheduled maintenance slot?', a: 'Maintenance is usually 10 AM–12 PM on Tuesdays. Your distributor will issue prior notice.' },
        ],
        notices: [
            { date: '20 Feb', text: 'Smart meter installation drive in Ward 12–18 this month. No power disruption for more than 2 hours.' },
            { date: '10 Feb', text: 'Electricity bill last date extended to 5th of every month.' },
        ],
    },
    water: {
        slug: 'water',
        name: 'Water Supply Board',
        nameHi: 'जल आपूर्ति विभाग',
        icon: 'water_drop',
        accentColor: '#117a65',
        nodal: 'Urban Water Authority',
        helpline: '1916',
        sla: '72 hours',
        description:
            'The Water Supply Board manages piped water connections, pipeline maintenance, water quality testing, ' +
            'sewage and drainage, and billing for all urban and peri-urban households.',
        services: [
            { id: 's1', icon: 'plumbing', name: 'New Water Connection', desc: 'Apply for a new domestic or commercial piped water connection.', fee: 'Rs. 500 onwards', sla: '30 days' },
            { id: 's2', icon: 'water_damage', name: 'Pipeline Leakage', desc: 'Report a burst pipe, leakage, or roadside water wastage.', fee: 'Free', sla: '24 hours' },
            { id: 's3', icon: 'timer_off', name: 'Supply Disruption', desc: 'Report a complete stoppage of water supply in your area.', fee: 'Free', sla: '12 hours' },
            { id: 's4', icon: 'science', name: 'Quality Complaint', desc: 'Report discoloured, smelly, or contaminated water supply.', fee: 'Free', sla: '48 hours' },
            { id: 's5', icon: 'description', name: 'Bill Payment / Objection', desc: 'Pay your water bill or raise an objection on an inflated bill.', fee: 'Convenience fee', sla: 'Instant / 15 days' },
            { id: 's6', icon: 'settings', name: 'Meter Replacement', desc: 'Request replacement of a damaged or malfunctioning water meter.', fee: 'Rs. 300', sla: '15 days' },
        ],
        faqs: [
            { q: 'What are the water supply hours?', a: 'Typically 5–8 AM and 5–8 PM. Timings may vary by zone. Check the notice board or call 1916.' },
            { q: 'How do I test water quality?', a: 'Submit a Quality Complaint and a field officer will collect a sample within 48 hours.' },
            { q: 'How do I pay my water bill?', a: 'Use this kiosk Bill Payment option or call 1916. Enter your Customer ID to proceed.' },
        ],
        notices: [
            { date: '18 Feb', text: 'Summer schedule: water supply extended by 30 minutes in evening slot from March 1.' },
            { date: '05 Feb', text: 'Jal Jeevan Mission: 500 new household connections approved in Ward 3, 7, and 14.' },
        ],
    },
    municipal: {
        slug: 'municipal',
        name: 'Municipal Corporation',
        nameHi: 'नगर निगम',
        icon: 'location_city',
        accentColor: '#6c3483',
        nodal: 'Urban Local Body',
        helpline: '1800-425-0101',
        sla: '7 working days',
        description:
            'The Municipal Corporation handles property records, sanitation, roads, birth/death registration, ' +
            'building permits, trade licences, and solid waste management for the urban local body area.',
        services: [
            { id: 's1', icon: 'home_work', name: 'Property Tax Payment', desc: 'Pay your annual property tax with receipt.', fee: 'Tax amount + 1%', sla: 'Instant' },
            { id: 's2', icon: 'baby_changing_station', name: 'Birth Certificate', desc: 'Apply for a birth certificate (within 1 year free).', fee: 'Free / Rs. 15', sla: '7 days' },
            { id: 's3', icon: 'sentiment_very_dissatisfied', name: 'Death Certificate', desc: 'Apply for a death certificate after official registration.', fee: 'Rs. 10', sla: '3 days' },
            { id: 's4', icon: 'cleaning_services', name: 'Sanitation Complaint', desc: 'Report garbage piling, drain blockage, or open defecation.', fee: 'Free', sla: '48 hours' },
            { id: 's5', icon: 'construction', name: 'Road / Pothole Repair', desc: 'Report a damaged road, pothole, or broken street light.', fee: 'Free', sla: '15 days' },
            { id: 's6', icon: 'store', name: 'Trade Licence', desc: 'Obtain or renew a trade licence for your shop/business.', fee: 'Rs. 500 onwards', sla: '30 days' },
        ],
        faqs: [
            { q: 'When is the property tax last date?', a: 'Usually 31 March every year. Pay before 31 January for a 5% rebate.' },
            { q: 'How do I get a birth certificate?', a: 'Visit this kiosk, Choose Municipal → Birth Certificate. Upload hospital discharge slip and proceed.' },
            { q: 'How do I report garbage not being collected?', a: 'Use the Sanitation Complaint service or call 14420. Guarantee resolution in 48 hours.' },
        ],
        notices: [
            { date: '21 Feb', text: 'Property tax last date extended to 31 March. Pay now to avail 5% early-bird rebate.' },
            { date: '14 Feb', text: 'Ward-level cleanliness drive on 2nd and 4th Saturday. Residents requested to cooperate.' },
        ],
    },
};

/* ── Component ──────────────────────────────────────────────────── */
export default function DepartmentDetail() {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // Support /departments/:slug AND top-level /:slug routes
    const slug = params.slug || location.pathname.replace(/^\//, '');
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('services'); // services | faqs | notices

    const dept = DEPT_DATA[slug];

    if (!dept) {
        return (
            <GovLayout breadcrumbs={['Departments', 'Not Found']}>
                <div className="gov-alert gov-alert--error" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <Icon name="error" size={20} color="var(--gov-error)" />
                    Department not found. <button className="gov-btn gov-btn--outline gov-btn--sm" style={{ marginLeft: 12 }}
                        onClick={() => navigate('/departments')}>Back to Departments</button>
                </div>
            </GovLayout>
        );
    }

    const filteredServices = dept.services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <GovLayout breadcrumbs={['Departments', dept.name]}>

            {/* ── Department banner ─────────────────────────────── */}
            <div style={{
                background: dept.accentColor,
                borderRadius: 'var(--gov-radius)',
                padding: '20px 24px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
            }}>
                <div style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)',
                    border: '2px solid rgba(255,255,255,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Icon name={dept.icon} size={36} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 3 }}>{dept.nameHi}</div>
                    <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{dept.name}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Icon name="business" size={14} color="rgba(255,255,255,0.75)" />{dept.nodal}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Icon name="phone" size={14} color="rgba(255,255,255,0.75)" />Helpline: <strong>{dept.helpline}</strong>
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Icon name="schedule" size={14} color="rgba(255,255,255,0.75)" />SLA: {dept.sla}
                        </span>
                    </div>
                </div>
                {/* Quick action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    <button
                        className="gov-btn"
                        onClick={() => navigate('/complaint', { state: { deptName: dept.name } })}
                        style={{ background: '#fff', color: dept.accentColor, fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: 'none' }}
                    >
                        <Icon name="campaign" size={16} color={dept.accentColor} />Lodge Complaint
                    </button>
                    <button
                        className="gov-btn"
                        onClick={() => navigate('/service-request', { state: { deptName: dept.name } })}
                        style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.45)' }}
                    >
                        <Icon name="assignment" size={16} color="#fff" />Service Request
                    </button>
                </div>
            </div>

            {/* ── Description strip ─────────────────────────────── */}
            <div className="gov-card" style={{ marginBottom: 16 }}>
                <div className="gov-card__body" style={{ fontSize: 13, color: '#2d3748', lineHeight: 1.7, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Icon name="info" size={18} color={dept.accentColor} style={{ flexShrink: 0, marginTop: 1 }} />
                    {dept.description}
                </div>
            </div>

            {/* ── Search bar ────────────────────────────────────── */}
            <div style={{
                background: '#fff', border: '1px solid var(--gov-border)',
                borderRadius: 'var(--gov-radius)', padding: '10px 14px',
                marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: 'var(--gov-shadow-sm)',
            }}>
                <Icon name="search" size={20} color="var(--gov-text-muted)" />
                <input
                    type="text"
                    placeholder={`Search services in ${dept.name}…`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1, border: 'none', outline: 'none',
                        fontSize: 14, fontFamily: 'var(--gov-font)', color: 'var(--gov-text)',
                        background: 'transparent',
                    }}
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Icon name="close" size={18} color="var(--gov-text-muted)" />
                    </button>
                )}
            </div>

            {/* ── Tabs ──────────────────────────────────────────── */}
            <div style={{
                display: 'flex', gap: 0,
                borderBottom: '2px solid var(--gov-border)',
                marginBottom: 16,
            }}>
                {['services', 'faqs', 'notices'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSearch(''); }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '10px 18px', fontSize: 13, fontWeight: 600,
                            fontFamily: 'var(--gov-font)',
                            color: activeTab === tab ? dept.accentColor : 'var(--gov-text-muted)',
                            borderBottom: activeTab === tab ? `3px solid ${dept.accentColor}` : '3px solid transparent',
                            marginBottom: -2,
                            textTransform: 'capitalize',
                            transition: 'color 0.15s',
                        }}
                    >
                        {tab === 'services' && <Icon name="miscellaneous_services" size={15} color={activeTab === tab ? dept.accentColor : 'var(--gov-text-muted)'} style={{ marginRight: 5 }} />}
                        {tab === 'faqs' && <Icon name="help" size={15} color={activeTab === tab ? dept.accentColor : 'var(--gov-text-muted)'} style={{ marginRight: 5 }} />}
                        {tab === 'notices' && <Icon name="campaign" size={15} color={activeTab === tab ? dept.accentColor : 'var(--gov-text-muted)'} style={{ marginRight: 5 }} />}
                        {tab === 'services' ? 'Services' : tab === 'faqs' ? 'FAQs' : 'Notices'}
                    </button>
                ))}
            </div>

            {/* ── SERVICES tab ──────────────────────────────────── */}
            {activeTab === 'services' && (
                <>
                    {filteredServices.length === 0 ? (
                        <div className="gov-alert gov-alert--info">
                            <Icon name="search_off" size={15} style={{ marginRight: 6 }} />
                            No services match &ldquo;{search}&rdquo;.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12, marginBottom: 16 }}>
                            {filteredServices.map(s => (
                                <div key={s.id} style={{
                                    background: '#fff', border: '1px solid #d5dde6',
                                    borderRadius: 'var(--gov-radius)', overflow: 'hidden',
                                    boxShadow: 'var(--gov-shadow-sm)',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'box-shadow 0.18s, transform 0.18s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.13)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--gov-shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <div style={{ borderLeft: `4px solid ${dept.accentColor}`, padding: '12px 14px', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <Icon name={s.icon} size={22} color={dept.accentColor} />
                                            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--gov-navy)' }}>{s.name}</div>
                                        </div>
                                        <div style={{ fontSize: 12.5, color: 'var(--gov-text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{s.desc}</div>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <span style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Icon name="payments" size={13} color="var(--gov-text-muted)" />{s.fee}
                                            </span>
                                            <span style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4, color: '#1a6e25' }}>
                                                <Icon name="schedule" size={13} color="#1a6e25" />{s.sla}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ borderTop: '1px solid #dde3ee', display: 'flex' }}>
                                        <button
                                            onClick={() => navigate('/service-request', { state: { deptName: dept.name, serviceName: s.name } })}
                                            style={{
                                                flex: 1, padding: '9px 6px',
                                                background: dept.accentColor, color: '#fff',
                                                border: 'none', cursor: 'pointer',
                                                fontSize: 12, fontWeight: 700,
                                                fontFamily: 'var(--gov-font)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                                transition: 'filter 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                                        >
                                            <Icon name="arrow_forward" size={15} color="#fff" />
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── FAQs tab ──────────────────────────────────────── */}
            {activeTab === 'faqs' && (
                <div style={{ marginBottom: 16 }}>
                    {dept.faqs.map((faq, i) => (
                        <details key={i} style={{
                            background: '#fff', border: '1px solid #d5dde6',
                            borderRadius: 'var(--gov-radius)', marginBottom: 8,
                            overflow: 'hidden',
                        }}>
                            <summary style={{
                                padding: '12px 16px', cursor: 'pointer',
                                fontWeight: 600, fontSize: 13.5, color: 'var(--gov-navy)',
                                display: 'flex', alignItems: 'center', gap: 8,
                                listStyle: 'none',
                            }}>
                                <Icon name="help" size={18} color={dept.accentColor} />
                                {faq.q}
                            </summary>
                            <div style={{
                                padding: '10px 16px 14px 44px',
                                fontSize: 13, color: '#4a5568', lineHeight: 1.6,
                                borderTop: `1px solid ${dept.accentColor}20`,
                            }}>
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            )}

            {/* ── Notices tab ───────────────────────────────────── */}
            {activeTab === 'notices' && (
                <div className="gov-card" style={{ marginBottom: 16 }}>
                    <div className="gov-card__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="notifications_active" size={16} color="#fff" />
                        {dept.name} — Notices & Announcements
                    </div>
                    <ul className="gov-news-list">
                        {dept.notices.map((n, i) => (
                            <li key={i} className="gov-news-item">
                                <span className="gov-news-date">{n.date}</span>
                                <span style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1 }}>
                                    <Icon name="arrow_right" size={18} color="var(--gov-navy)" style={{ flexShrink: 0, marginTop: 1 }} />
                                    {n.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── Back button ───────────────────────────────────── */}
            <div style={{ marginBottom: 8 }}>
                <button
                    className="gov-btn gov-btn--outline gov-btn--sm"
                    onClick={() => navigate('/departments')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                    <Icon name="arrow_back" size={16} />
                    Back to All Departments
                </button>
            </div>

        </GovLayout>
    );
}
