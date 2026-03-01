import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import api from '../services/api.js';

const Icon = ({ name, size = 22, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>
        {name}
    </span>
);

const STATIC_DEPTS = [
    {
        id: 'gas',
        name: 'Gas Service',
        nameHi: 'गैस सेवा',
        icon: 'local_fire_department',
        helpline: '1906',
        accentColor: '#c0392b',
        services: ['New LPG Connection', 'Cylinder Booking', 'Subsidy Transfer', 'Leakage Complaint'],
        sla: '48 hours',
        nodal: 'Ministry of Petroleum & Natural Gas',
    },
    {
        id: 'electricity',
        name: 'Electricity Department',
        nameHi: 'विद्युत विभाग',
        icon: 'electric_bolt',
        helpline: '1912',
        accentColor: '#1a5276',
        services: ['New Connection', 'Bill Payment', 'Power Outage', 'Meter Complaint'],
        sla: '24 hours',
        nodal: 'State Electricity Board',
    },
    {
        id: 'water',
        name: 'Water Supply Board',
        nameHi: 'जल आपूर्ति विभाग',
        icon: 'water_drop',
        helpline: '1916',
        accentColor: '#117a65',
        services: ['New Water Connection', 'Pipeline Leakage', 'Supply Disruption', 'Quality Complaint'],
        sla: '72 hours',
        nodal: 'Urban Water Authority',
    },
    {
        id: 'municipal',
        name: 'Municipal Corporation',
        nameHi: 'नगर निगम',
        icon: 'location_city',
        helpline: '1800-425-0101',
        accentColor: '#6c3483',
        services: ['Property Tax Payment', 'Birth / Death Certificate', 'Trade License', 'Town Planning', 'Professional Tax', 'Pet Licensing'],
        sla: '7 working days',
        nodal: 'Urban Local Body',
    },
];

export default function DepartmentsPage() {
    const navigate = useNavigate();
    const [extraDepts, setExtraDepts] = useState([]);

    useEffect(() => {
        api.get('/departments')
            .then(r => {
                const all = r.data.data ?? [];
                const staticNames = STATIC_DEPTS.map(d => d.name.toLowerCase());
                setExtraDepts(all.filter(d =>
                    !staticNames.some(n => d.name.toLowerCase().includes(n.split(' ')[0].toLowerCase()))
                ));
            })
            .catch(() => { });
    }, []);

    const allDepts = [
        ...STATIC_DEPTS,
        ...extraDepts.map(d => ({
            id: d.id, name: d.name, nameHi: '', icon: 'account_balance',
            helpline: '—', accentColor: '#003366',
            services: d.description ? [d.description] : [],
            sla: d.slaHours ? `${d.slaHours} hours` : '—',
            nodal: 'Government Department',
        })),
    ];

    return (
        <GovLayout breadcrumbs={['Government Departments']}>
            <div className="kiosk-container" style={{ padding: '20px 0' }}>

                <div className="kiosk-header" style={{ textAlign: 'center', marginBottom: 'var(--kiosk-gap)' }}>
                    <h1 className="kiosk-title" style={{ fontSize: 'var(--kiosk-subtitle-size)', fontWeight: 900, color: 'var(--gov-navy)' }}>Service Directory / सेवा निर्देशिका</h1>
                    <p style={{ fontSize: 18, color: '#64748b', fontWeight: 600, marginTop: 10 }}> Select a government department to explore available citizen services.</p>
                </div>

                {/* Search / Filter Concept (Kiosk Style) */}
                <div style={{ background: '#fff', padding: 'var(--kiosk-p-md)', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', marginBottom: 40, border: '1px solid #f1f5f9' }}>
                    <div style={{ background: 'var(--gov-navy)', color: '#fff', padding: '15px 30px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 18, width: 'fit-content' }}>
                        <Icon name="search" size={24} />
                        QUICK SEARCH
                    </div>
                    <input
                        className="kiosk-input"
                        placeholder="Type department name or service..."
                        style={{ flex: 1, minWidth: 280, height: 'var(--kiosk-btn-h)', fontSize: '1.2rem', margin: 0, background: '#f8fafc', border: '2px solid #e2e8f0' }}
                    />
                </div>

                {/* Department cards grid */}
                <div className="kiosk-grid" style={{ gridTemplateColumns: 'var(--kiosk-grid-2col)', gap: 'var(--kiosk-gap)' }}>
                    {allDepts.map(dept => (
                        <div key={dept.id}
                            className="kiosk-tile"
                            style={{
                                borderLeft: `12px solid ${dept.accentColor}`,
                                padding: 'var(--kiosk-p-md)',
                                gap: '20px',
                                alignItems: 'stretch',
                                background: '#fff',
                                borderRadius: 32,
                                minHeight: 'auto',
                                boxShadow: '0 8px 0 rgba(0,0,0,0.02), 0 20px 40px rgba(0,0,0,0.04)'
                            }}
                            onClick={() => navigate(dept.id === 'water' ? '/water' : dept.id === 'electricity' ? '/electricity' : dept.id === 'gas' ? '/gas' : `/departments/${dept.id}`)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 25, marginBottom: 15 }}>
                                <div style={{
                                    width: 90, height: 90, borderRadius: 28,
                                    background: dept.accentColor + '15',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, border: `2px solid ${dept.accentColor}30`
                                }}>
                                    <Icon name={dept.icon} size={48} color={dept.accentColor} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div className="kiosk-gov-tile-hi" style={{ fontSize: 18, margin: 0, color: dept.accentColor, opacity: 0.8 }}>{dept.nameHi}</div>
                                    <div className="kiosk-tile__label" style={{ fontSize: 24, color: 'var(--gov-navy)', fontWeight: 900 }}>{dept.name}</div>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: 14, fontWeight: 800, textTransform: 'uppercase',
                                    color: '#94a3b8', letterSpacing: '1px', marginBottom: 15,
                                    textAlign: 'left', borderBottom: '2px solid #f1f5f9', paddingBottom: 10
                                }}>Available Channels</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 15 }}>
                                    {dept.services.slice(0, 4).map(s => (
                                        <div key={s} style={{
                                            fontSize: 15, color: '#475569', fontWeight: 600,
                                            padding: '12px 15px', background: '#f8fafc', borderRadius: 12,
                                            display: 'flex', alignItems: 'center', gap: 10,
                                        }}>
                                            <Icon name="check_circle" size={18} color={dept.accentColor} />
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                background: '#f8fafc', borderRadius: 20,
                                padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginTop: '10px', border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Icon name="phone" size={24} color={dept.accentColor} />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Dept Helpline</div>
                                        <div style={{ color: dept.accentColor, fontSize: 20, fontWeight: 900, fontFamily: 'monospace' }}>
                                            {dept.helpline}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    background: '#fff', color: '#1a6e25', borderRadius: 14,
                                    padding: '8px 15px', fontSize: 14, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #dcfce7', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    <Icon name="speed" size={20} color="#1a6e25" />
                                    SLA: {dept.sla}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RTI Note */}
                <div style={{
                    background: 'var(--gov-navy)', padding: 'var(--kiosk-p-lg)', borderRadius: 32,
                    color: '#fff', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 30,
                    marginTop: 60, position: 'relative', overflow: 'hidden'
                }}>
                    <div className="desktop-only" style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1 }}>
                        <Icon name="gavel" size={150} />
                    </div>
                    <Icon name="verified_user" size={60} color="var(--gov-saffron)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 5 }}>Citizen’s Right to Service Act</div>
                        <p style={{ fontSize: 16, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
                            All listed services are governed by the State Digital Charter. Grievances must be resolved within the specified SLA.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/contact')}
                        className="kiosk-btn kiosk-btn--primary"
                        style={{ width: 'auto', padding: '0 40px', height: 60, background: 'var(--gov-saffron)', margin: 0, flexShrink: 0 }}
                    >GET ASSISTANCE</button>
                </div>

                <div style={{ textAlign: 'center', marginTop: 50 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ width: '100%', maxWidth: 400, height: 'var(--kiosk-btn-h)', borderRadius: 24 }} onClick={() => navigate('/dashboard')}>
                        <div style={{ textAlign: 'left' }}>
                            <span className="kiosk-gov-btn-hi" style={{ fontSize: 20 }}>मुख्य पृष्ठ पर जाएं</span>
                            <div style={{ fontSize: 16, opacity: 0.8 }}>BACK TO HOME DASHBOARD</div>
                        </div>
                        <Icon name="home_work" size={40} color="#fff" />
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}

