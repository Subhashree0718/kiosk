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
        services: ['Property Tax', 'Birth / Death Certificate', 'Sanitation & Sewage', 'Road & Drainage'],
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

            {/* Section heading */}
            <div style={{
                background: 'var(--gov-navy)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: 'var(--gov-radius) var(--gov-radius) 0 0',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '4px solid var(--gov-saffron)',
            }}>
                <Icon name="account_balance" size={20} color="#fff" />
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.5px' }}>
                        GOVERNMENT DEPARTMENTS
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>
                        सरकारी विभाग — Select a department to avail services or lodge a grievance
                    </div>
                </div>
            </div>

            {/* Alert strip */}
            <div style={{
                background: '#fffbf0', border: '1px solid #f0d080', borderTop: 'none',
                padding: '7px 16px', fontSize: 12, color: '#7d5a00',
                marginBottom: 20, borderRadius: '0 0 var(--gov-radius) var(--gov-radius)',
                display: 'flex', alignItems: 'center', gap: 8,
            }}>
                <Icon name="warning_amber" size={16} color="#d4ac0d" />
                <span>
                    For emergency services, call <strong>Police: 100</strong> &nbsp;|&nbsp;
                    <strong>Fire: 101</strong> &nbsp;|&nbsp; <strong>Ambulance: 108</strong>
                </span>
            </div>

            {/* Department cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
                {allDepts.map(dept => (
                    <article key={dept.id}
                        onClick={() => navigate(`/departments/${dept.id}`)}
                        style={{
                            background: '#fff', border: '1px solid #d0d8e4',
                            borderRadius: 'var(--gov-radius)',
                            boxShadow: '0 2px 6px rgba(0,51,102,0.07)',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'box-shadow 0.18s, transform 0.18s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,51,102,0.16)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,51,102,0.07)'; e.currentTarget.style.transform = 'none'; }}
                    >

                        {/* Coloured header */}
                        <div style={{ background: dept.accentColor, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.18)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Icon name={dept.icon} size={26} color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{dept.name}</div>
                                {dept.nameHi && <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>{dept.nameHi}</div>}
                            </div>
                            <Icon name="chevron_right" size={22} color="rgba(255,255,255,0.7)" />
                        </div>

                        {/* Nodal */}
                        <div style={{
                            background: '#f5f7fb', borderBottom: '1px solid #dde3ee',
                            padding: '6px 16px', fontSize: 11.5, color: '#4a5568',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <Icon name="business" size={14} color="#6b7280" />
                            {dept.nodal}
                        </div>

                        {/* Services list */}
                        <div style={{ padding: '12px 16px', flex: 1 }}>
                            <div style={{
                                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                color: dept.accentColor, letterSpacing: '0.6px', marginBottom: 8,
                            }}>Available Services</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {dept.services.map(s => (
                                    <li key={s} style={{
                                        fontSize: 12.5, color: '#2d3748',
                                        padding: '5px 0', borderBottom: '1px dashed #e8edf4',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                    }}>
                                        <Icon name="arrow_right" size={16} color={dept.accentColor} />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Helpline + SLA */}
                        <div style={{
                            background: '#f5f7fb', borderTop: '1px solid #dde3ee',
                            padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                                <Icon name="phone" size={14} color={dept.accentColor} />
                                <span style={{ color: '#4a5568' }}>Helpline:</span>
                                <strong style={{ color: dept.accentColor, fontFamily: 'Courier New, monospace', fontSize: 13 }}>
                                    {dept.helpline}
                                </strong>
                            </div>
                            <div style={{
                                background: '#eaf4eb', color: '#1a6e25', borderRadius: 12,
                                padding: '2px 9px', fontSize: 11, fontWeight: 700,
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                <Icon name="schedule" size={13} color="#1a6e25" />
                                SLA: {dept.sla}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', borderTop: '1px solid #dde3ee' }}>
                            <button
                                onClick={e => { e.stopPropagation(); navigate('/complaint', { state: { deptName: dept.name } }); }}
                                style={{
                                    flex: 1, padding: '11px 6px', background: dept.accentColor,
                                    color: '#fff', border: 'none', borderRight: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer', fontSize: 12.5, fontWeight: 700,
                                    fontFamily: 'var(--gov-font)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    transition: 'filter 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                            >
                                <Icon name="campaign" size={16} color="#fff" />
                                Lodge Complaint
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); navigate('/service-request', { state: { deptName: dept.name } }); }}
                                style={{
                                    flex: 1, padding: '11px 6px', background: 'var(--gov-navy)',
                                    color: '#fff', border: 'none',
                                    cursor: 'pointer', fontSize: 12.5, fontWeight: 700,
                                    fontFamily: 'var(--gov-font)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    transition: 'filter 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.3)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                            >
                                <Icon name="assignment" size={16} color="#fff" />
                                Service Request
                            </button>
                        </div>
                    </article>

                ))}
            </div>

            {/* RTI Note */}
            <div style={{
                border: '1px solid #d0d8e4', borderLeft: '4px solid var(--gov-green)',
                background: '#f0faf1', padding: '10px 16px', borderRadius: 'var(--gov-radius)',
                fontSize: 12.5, color: '#2d4a30', display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
                <Icon name="info" size={18} color="#1e8449" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                    All grievances are tracked via a unique <strong>Ticket ID</strong> sent to your registered mobile.
                    Under the RTI Act, grievance status must be updated within <strong>30 days</strong> of submission.
                    Visit{' '}
                    <button
                        onClick={() => navigate('/contact')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gov-navy)', textDecoration: 'underline', fontSize: 12.5, padding: 0, fontFamily: 'var(--gov-font)' }}
                    >Contact Us</button>{' '}for all helpline numbers.
                </span>
            </div>

        </GovLayout>
    );
}
