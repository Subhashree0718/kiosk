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
            <div className="kiosk-container">

                {/* ── Department banner ─────────────────────────────── */}
                <div style={{
                    background: dept.accentColor,
                    borderRadius: 24,
                    padding: '40px 60px',
                    marginBottom: 30,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 45,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    borderBottom: '8px solid var(--gov-saffron)'
                }}>
                    <div style={{
                        width: 120, height: 120, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        border: '4px solid rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Icon name={dept.icon} size={64} color="#fff" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, marginBottom: 5, fontWeight: 700 }}>{dept.nameHi}</div>
                        <div style={{ color: '#fff', fontSize: 48, fontWeight: 900, lineHeight: 1.1 }}>{dept.name}</div>
                        <div style={{ display: 'flex', gap: 30, marginTop: 20, flexWrap: 'wrap' }}>
                            <span style={{ color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: 50 }}>
                                <Icon name="business" size={20} /> {dept.nodal}
                            </span>
                            <span style={{ color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: 50 }}>
                                <Icon name="phone" size={20} /> Helpline: <strong>{dept.helpline}</strong>
                            </span>
                            <span style={{ color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: 50 }}>
                                <Icon name="schedule" size={20} /> SLA: {dept.sla}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ──────────────────────────────────────────── */}
                <div style={{
                    display: 'flex', gap: 15,
                    marginBottom: 30,
                    background: '#f1f5f9',
                    padding: 10,
                    borderRadius: 20
                }}>
                    {['services', 'faqs', 'notices'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSearch(''); }}
                            style={{
                                flex: 1,
                                padding: '20px',
                                border: 'none',
                                borderRadius: 15,
                                fontSize: 20,
                                fontWeight: 800,
                                background: activeTab === tab ? '#fff' : 'transparent',
                                color: activeTab === tab ? dept.accentColor : '#64748b',
                                boxShadow: activeTab === tab ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <Icon name={tab === 'services' ? 'miscellaneous_services' : tab === 'faqs' ? 'help' : 'campaign'} size={24} />
                            {tab === 'services' ? 'Services' : tab === 'faqs' ? 'FAQs' : 'Notices'}
                        </button>
                    ))}
                </div>

                {/* ── Search Bar (Only for services) ────────────────── */}
                {activeTab === 'services' && (
                    <div style={{
                        background: '#fff', border: '3px solid #e2e8f0',
                        borderRadius: 24, padding: '20px 35px',
                        marginBottom: 35, display: 'flex', alignItems: 'center', gap: 20,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    }}>
                        <Icon name="search" size={32} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder={`Search services in ${dept.name}...`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                flex: 1, border: 'none', outline: 'none',
                                fontSize: 24, fontWeight: 600, color: 'var(--gov-navy)',
                                background: 'transparent',
                            }}
                        />
                    </div>
                )}

                {/* ── Content Area ──────────────────────────────────── */}
                <div style={{ minHeight: 400 }}>
                    {activeTab === 'services' && (
                        <>
                            {filteredServices.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
                                    <Icon name="search_off" size={80} style={{ marginBottom: 20, opacity: 0.3 }} />
                                    <div style={{ fontSize: 24, fontWeight: 700 }}>No services match "{search}"</div>
                                </div>
                            ) : (
                                <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 30 }}>
                                    {filteredServices.map(s => (
                                        <div key={s.id} className="kiosk-tile" style={{
                                            alignItems: 'flex-start',
                                            textAlign: 'left',
                                            padding: '40px',
                                            minHeight: 'auto',
                                            borderTop: `10px solid ${dept.accentColor}`
                                        }}>
                                            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                                                <div style={{
                                                    width: 60, height: 60, background: `${dept.accentColor}15`,
                                                    borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Icon name={s.icon} size={36} color={dept.accentColor} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gov-navy)' }}>{s.name}</div>
                                                    <div style={{ fontSize: 18, color: '#64748b', fontWeight: 600, marginTop: 4 }}>SLA: {s.sla}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, marginBottom: 30, height: 60, overflow: 'hidden' }}>
                                                {s.desc}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '2px solid #f1f5f9', paddingTop: 20 }}>
                                                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gov-navy)' }}>
                                                    {s.fee}
                                                </div>
                                                <button
                                                    className="kiosk-btn kiosk-btn--primary"
                                                    style={{ height: 60, padding: '0 30px', fontSize: 18 }}
                                                    onClick={() => navigate('/service-request', { state: { deptName: dept.name, serviceName: s.name } })}
                                                >
                                                    APPLY NOW
                                                    <Icon name="arrow_forward" size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'faqs' && (
                        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                            {dept.faqs.map((faq, i) => (
                                <div key={i} style={{
                                    background: '#fff', border: '3px solid #e2e8f0',
                                    borderRadius: 24, marginBottom: 20, padding: '30px 40px'
                                }}>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gov-navy)', display: 'flex', gap: 15, marginBottom: 15 }}>
                                        <Icon name="help" size={28} color={dept.accentColor} />
                                        {faq.q}
                                    </div>
                                    <div style={{ fontSize: 20, color: '#475569', lineHeight: 1.6, paddingLeft: 43 }}>
                                        {faq.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'notices' && (
                        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                            <div className="kiosk-form" style={{ padding: 0, overflow: 'hidden', border: '3px solid #e2e8f0' }}>
                                <div style={{ background: 'var(--gov-navy)', color: '#fff', padding: '25px 40px', fontSize: 22, fontWeight: 800, display: 'flex', gap: 15 }}>
                                    <Icon name="notifications_active" size={28} color="var(--gov-saffron)" />
                                    Official Notices & Announcements
                                </div>
                                <div style={{ padding: '20px 0' }}>
                                    {dept.notices.map((n, i) => (
                                        <div key={i} style={{
                                            padding: '25px 40px', borderBottom: i === dept.notices.length - 1 ? 'none' : '2px solid #f1f5f9',
                                            display: 'flex', gap: 20, alignItems: 'flex-start'
                                        }}>
                                            <div style={{
                                                background: 'var(--gov-saffron)', color: '#fff', padding: '8px 15px',
                                                borderRadius: 10, fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap'
                                            }}>{n.date}</div>
                                            <div style={{ fontSize: 19, color: '#1e293b', fontWeight: 600, lineHeight: 1.5 }}>{n.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Bottom Actions ───────────────────────────────────── */}
                <div style={{ display: 'flex', gap: 20, marginTop: 50, justifyContent: 'center' }}>
                    <button
                        className="kiosk-btn kiosk-btn--secondary"
                        style={{ height: 80, padding: '0 60px', fontSize: 22 }}
                        onClick={() => navigate('/departments')}
                    >
                        <Icon name="arrow_back" size={24} />
                        BACK TO DEPARTMENTS
                    </button>
                    <button
                        className="kiosk-btn kiosk-btn--primary"
                        style={{ height: 80, padding: '0 60px', fontSize: 22, background: 'var(--gov-navy)' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        <Icon name="home" size={24} />
                        HOME
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
