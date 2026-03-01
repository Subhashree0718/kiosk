import React, { useState } from 'react';
import GovLayout from '../components/GovLayout.jsx';
import { useNavigate } from 'react-router-dom';

const Icon = ({ name, size = 16, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>
        {name}
    </span>
);

const HELPLINES = [
    { dept: 'General Enquiry', number: '1800-11-0001', hours: '24x7', icon: 'info' },
    { dept: 'Electricity', number: '1912', hours: '24x7', icon: 'electric_bolt' },
    { dept: 'Water Supply', number: '1916', hours: '24x7', icon: 'water_drop' },
    { dept: 'Sanitation / Sewage', number: '14420', hours: '6 AM – 10 PM', icon: 'cleaning_services' },
    { dept: 'Property Tax', number: '1800-425-0101', hours: 'Mon–Sat 9–5', icon: 'home_work' },
    { dept: 'Police', number: '100', hours: '24x7', icon: 'local_police' },
    { dept: 'Fire Brigade', number: '101', hours: '24x7', icon: 'local_fire_department' },
    { dept: 'Ambulance', number: '108', hours: '24x7', icon: 'emergency' },
];

const OFFICE_HOURS = [
    { day: 'Monday – Friday', hrs: '9:00 AM – 5:30 PM' },
    { day: 'Saturday', hrs: '9:00 AM – 1:00 PM' },
    { day: 'Sunday', hrs: 'Closed' },
    { day: 'Public Holidays', hrs: 'Closed' },
];

export default function ContactUs() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', mobile: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    function submit(e) {
        e.preventDefault();
        setSent(true);
    }

    return (
        <GovLayout breadcrumbs={['Contact Us']}>
            <div className="kiosk-container">

                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 'var(--kiosk-subtitle-size)' }}>Help & Support Centre</div>
                    <div style={{ fontStyle: 'italic', fontSize: 20, color: '#666', marginBottom: 15 }}>सहायता एवं सहयोग केंद्र</div>
                    <p style={{ fontSize: 18, color: '#64748b', fontWeight: 500 }}>
                        Reach out to SUVIDHA Kiosk helpdesk or the concerned department directly.
                    </p>
                </div>

                {/* Office & Hours Grid */}
                <div className="kiosk-grid" style={{ gridTemplateColumns: 'var(--kiosk-grid-2col)', gap: 'var(--kiosk-gap)', marginBottom: 40 }}>

                    {/* Office Address */}
                    <div className="kiosk-form" style={{ maxWidth: '100%', margin: 0, padding: 35 }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gov-navy)', borderBottom: '3px solid #f1f5f9', paddingBottom: 15, marginBottom: 20, display: 'flex', gap: 15, alignItems: 'center' }}>
                            <Icon name="account_balance" size={28} color="var(--gov-navy)" />
                            Official Head Office
                        </div>
                        <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--gov-navy)', marginBottom: 20 }}>
                            SUVIDHA Kiosk Initiative HQ
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            {[
                                { icon: 'business', text: 'Ministry of Housing and Urban Affairs' },
                                { icon: 'flag', text: 'Government of India' },
                                { icon: 'location_on', text: 'Nirman Bhavan, New Delhi – 110 001' },
                            ].map(r => (
                                <div key={r.icon} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <Icon name={r.icon} size={20} color="var(--gov-saffron)" style={{ marginTop: 4 }} />
                                    <span style={{ fontSize: 18, color: '#1e293b', fontWeight: 600 }}>{r.text}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 30, paddingTop: 20, borderTop: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { icon: 'email', text: 'helpdesk@suvidha.gov.in' },
                                { icon: 'language', text: 'www.suvidha.gov.in' },
                                { icon: 'print', text: 'Fax: 011-2306-1234' },
                            ].map(r => (
                                <div key={r.icon} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <Icon name={r.icon} size={18} color="var(--gov-navy)" />
                                    <span style={{ fontSize: 18, color: 'var(--gov-navy)', fontWeight: 700 }}>{r.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Office Hours */}
                    <div className="kiosk-form" style={{ maxWidth: '100%', margin: 0, padding: 35 }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gov-navy)', borderBottom: '3px solid #f1f5f9', paddingBottom: 15, marginBottom: 20, display: 'flex', gap: 15, alignItems: 'center' }}>
                            <Icon name="schedule" size={28} color="var(--gov-navy)" />
                            Office Timing
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {OFFICE_HOURS.map(({ day, hrs }) => (
                                    <tr key={day} style={{ borderBottom: '2px solid #f8fafc' }}>
                                        <td style={{ padding: '15px 0', color: '#64748b', fontSize: 18, fontWeight: 600 }}>{day}</td>
                                        <td style={{
                                            padding: '15px 0', fontWeight: 800, fontSize: 18, textAlign: 'right',
                                            color: hrs === 'Closed' ? '#ef4444' : 'var(--gov-navy)',
                                        }}>
                                            {hrs}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{
                            marginTop: 25,
                            background: '#f0f9ff',
                            padding: '15px 20px',
                            borderRadius: 12,
                            border: '1.5px solid #0ea5e9',
                            display: 'flex', gap: 12, alignItems: 'center'
                        }}>
                            <Icon name="info" size={20} color="#0369a1" />
                            <div style={{ fontSize: 15, color: '#0369a1', fontWeight: 700 }}>
                                Kiosk terminals are operational 24x7.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helpline Grid */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ fontSize: 'var(--kiosk-subtitle-size)', fontWeight: 900, color: 'var(--gov-navy)', marginBottom: 25, textAlign: 'center' }}>
                        Emergency & Department Helplines
                    </div>
                    <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {HELPLINES.map(h => (
                            <div key={h.dept} className="kiosk-tile" style={{ padding: '25px', minHeight: 'auto', flexDirection: 'row', gap: 20, justifyContent: 'flex-start', textAlign: 'left' }}>
                                <div style={{
                                    width: 50, height: 50, background: 'var(--gov-navy)',
                                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    <Icon name={h.icon} size={28} color="#fff" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{h.dept}</div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gov-navy)', letterSpacing: 0.5 }}>{h.number}</div>
                                    <div style={{ fontSize: 12, color: 'var(--gov-saffron)', fontWeight: 700 }}>{h.hours}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback Form */}
                <div className="kiosk-form" style={{ maxWidth: 1000 }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gov-navy)', borderBottom: '3px solid #f1f5f9', paddingBottom: 20, marginBottom: 30, display: 'flex', gap: 15, alignItems: 'center' }}>
                        <Icon name="mail" size={32} color="var(--gov-navy)" />
                        Submit Feedback or Query / प्रश्न एवं सुझाव
                    </div>

                    {sent ? (
                        <div style={{
                            background: '#f0fdf4', border: '3px solid #16a34a',
                            padding: '40px', borderRadius: 24, textAlign: 'center'
                        }}>
                            <Icon name="check_circle" size={80} color="#16a34a" style={{ marginBottom: 20 }} />
                            <div style={{ fontSize: 32, fontWeight: 800, color: '#166534', marginBottom: 10 }}>Submission Successful!</div>
                            <p style={{ fontSize: 20, color: '#166534', marginBottom: 30 }}>
                                Reference Number: <strong style={{ fontFamily: 'monospace', background: '#dcfce7', padding: '4px 12px', borderRadius: 8 }}>SVD-{Date.now().toString().slice(-8)}</strong>
                            </p>
                            <button className="kiosk-btn kiosk-btn--primary" style={{ width: 300, margin: '0 auto' }} onClick={() => setSent(false)}>
                                SUBMIT ANOTHER
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit}>
                            <div className="kiosk-grid" style={{ gridTemplateColumns: 'var(--kiosk-grid-2col)', gap: 30 }}>
                                <div className="kiosk-input-group">
                                    <label className="kiosk-label">Full Name / पूर्ण नाम</label>
                                    <input className="kiosk-input" type="text"
                                        placeholder="As per records"
                                        style={{ height: 'var(--kiosk-btn-h)' }}
                                        value={form.name} onChange={set('name')} required />
                                </div>
                                <div className="kiosk-input-group">
                                    <label className="kiosk-label">Mobile Number / मोबाइल</label>
                                    <input className="kiosk-input" type="tel"
                                        placeholder="10-digit number"
                                        style={{ height: 'var(--kiosk-btn-h)' }}
                                        value={form.mobile} onChange={set('mobile')} maxLength={10} required />
                                </div>
                            </div>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Subject / विषय</label>
                                <input className="kiosk-input" type="text"
                                    placeholder="Brief subject of your query"
                                    style={{ height: 'var(--kiosk-btn-h)' }}
                                    value={form.subject} onChange={set('subject')} required />
                            </div>
                            <div className="kiosk-input-group">
                                <label className="kiosk-label">Message / संदेश</label>
                                <textarea className="kiosk-input"
                                    style={{ height: 180, paddingTop: 20 }}
                                    placeholder="Describe your query in detail..."
                                    value={form.message} onChange={set('message')} required />
                            </div>

                            <div style={{
                                display: 'flex', gap: 15, alignItems: 'center',
                                background: '#f8fafc', padding: 20, borderRadius: 16, marginBottom: 35
                            }}>
                                <Icon name="verified_user" size={24} color="var(--gov-navy)" />
                                <div style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>
                                    Your data is protected under the IT Act, 2000 and the Personal Data Protection Bill, 2023.
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                                <button type="button" className="kiosk-btn kiosk-btn--secondary" style={{ flex: '1 1 150px', height: 'var(--kiosk-btn-h)' }} onClick={() => navigate('/dashboard')}>
                                    <Icon name="arrow_back" size={20} />
                                    CANCEL
                                </button>
                                <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ flex: '2 1 250px', height: 'var(--kiosk-btn-h)' }}>
                                    SUBMIT QUERY
                                    <Icon name="send" size={20} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: 50, color: '#94a3b8', fontSize: 16 }}>
                    🏢 Official Kiosk Interface v2.0 | Digital India Initiative
                </div>
            </div>
        </GovLayout>
    );
}
