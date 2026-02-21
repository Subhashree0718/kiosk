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

            {/* Page heading strip */}
            <div style={{
                background: 'var(--gov-navy)', color: '#fff',
                padding: '10px 16px', borderRadius: 'var(--gov-radius) var(--gov-radius) 0 0',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '4px solid var(--gov-saffron)', marginBottom: 20,
            }}>
                <Icon name="contacts" size={20} color="#fff" />
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.4px' }}>CONTACT US / संपर्क करें</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Reach out to SUVIDHA Kiosk helpdesk or the concerned department directly</div>
                </div>
            </div>

            {/* Address + Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

                {/* Office Address */}
                <div className="gov-card">
                    <div className="gov-card__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="account_balance" size={16} color="#fff" />
                        Office Address
                    </div>
                    <div className="gov-card__body" style={{ fontSize: 13 }}>
                        <p style={{ fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 8 }}>
                            SUVIDHA Kiosk Initiative
                        </p>
                        {[
                            { icon: 'business', text: 'Ministry of Housing and Urban Affairs' },
                            { icon: 'flag', text: 'Government of India' },
                            { icon: 'location_on', text: 'Nirman Bhavan, New Delhi – 110 001' },
                        ].map(r => (
                            <div key={r.icon} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                                <Icon name={r.icon} size={14} color="var(--gov-text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                                <span style={{ color: '#4a5568' }}>{r.text}</span>
                            </div>
                        ))}
                        <hr className="gov-divider" />
                        {[
                            { icon: 'email', text: 'helpdesk@suvidha.gov.in', href: 'mailto:helpdesk@suvidha.gov.in' },
                            { icon: 'language', text: 'www.suvidha.gov.in', href: 'https://suvidha.gov.in' },
                            { icon: 'print', text: 'Fax: 011-2306-1234', href: null },
                        ].map(r => (
                            <div key={r.icon} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                                <Icon name={r.icon} size={14} color="var(--gov-navy)" style={{ flexShrink: 0 }} />
                                {r.href
                                    ? <a href={r.href} style={{ fontSize: 13, color: 'var(--gov-navy)' }}>{r.text}</a>
                                    : <span style={{ fontSize: 13, color: '#4a5568' }}>{r.text}</span>
                                }
                            </div>
                        ))}
                    </div>
                </div>

                {/* Office Hours */}
                <div className="gov-card">
                    <div className="gov-card__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="schedule" size={16} color="#fff" />
                        Office Hours
                    </div>
                    <div className="gov-card__body" style={{ padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {OFFICE_HOURS.map(({ day, hrs }) => (
                                    <tr key={day} style={{ borderBottom: '1px solid var(--gov-border)' }}>
                                        <td style={{ padding: '9px 14px', color: 'var(--gov-text-muted)', fontSize: 13 }}>{day}</td>
                                        <td style={{
                                            padding: '9px 14px', fontWeight: 700, fontSize: 13,
                                            color: hrs === 'Closed' ? 'var(--gov-error)' : 'var(--gov-navy)',
                                            display: 'flex', alignItems: 'center', gap: 5,
                                        }}>
                                            <Icon name={hrs === 'Closed' ? 'block' : 'check_circle'} size={14}
                                                color={hrs === 'Closed' ? 'var(--gov-error)' : 'var(--gov-green)'} />
                                            {hrs}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="gov-alert gov-alert--info" style={{ fontSize: 11.5, margin: 12, borderRadius: 'var(--gov-radius)' }}>
                            <Icon name="info" size={13} color="#1a5276" style={{ marginRight: 5 }} />
                            Kiosk terminals are operational 24x7 for self-service.
                        </div>
                    </div>
                </div>
            </div>

            {/* Helpline numbers table */}
            <div className="gov-card" style={{ marginBottom: 20 }}>
                <div className="gov-card__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="phone_in_talk" size={16} color="#fff" />
                    Department-wise Helpline Numbers
                </div>
                <div className="gov-card__body" style={{ padding: 0 }}>
                    <table className="gov-table">
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Helpline Number</th>
                                <th>Available Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {HELPLINES.map(h => (
                                <tr key={h.dept}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Icon name={h.icon} size={15} color="var(--gov-navy)" />
                                        {h.dept}
                                    </td>
                                    <td>
                                        <span style={{
                                            fontWeight: 700, color: 'var(--gov-navy)',
                                            fontSize: 14, fontFamily: 'Courier New, monospace',
                                        }}>{h.number}</span>
                                    </td>
                                    <td style={{ color: 'var(--gov-text-muted)', fontSize: 12 }}>{h.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Feedback form */}
            <div className="gov-card">
                <div className="gov-card__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="mail" size={16} color="#fff" />
                    Online Feedback / Query Form
                </div>
                <div className="gov-card__body">
                    {sent ? (
                        <div className="gov-alert gov-alert--success" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <Icon name="check_circle" size={20} color="#155724" style={{ flexShrink: 0, marginTop: 1 }} />
                            <div>
                                Your query has been submitted successfully. We will respond within 2 working days.
                                <br />Reference number: <strong>SVD-{Date.now().toString().slice(-8)}</strong>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submit}>
                            <div className="gov-form-row">
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">
                                        Full Name <span className="gov-form-group__req">*</span>
                                    </label>
                                    <input className="gov-form-group__field" type="text"
                                        placeholder="As per official records"
                                        value={form.name} onChange={set('name')} required />
                                </div>
                                <div className="gov-form-group">
                                    <label className="gov-form-group__label">
                                        Mobile Number <span className="gov-form-group__req">*</span>
                                    </label>
                                    <input className="gov-form-group__field" type="tel"
                                        placeholder="10-digit mobile number"
                                        value={form.mobile} onChange={set('mobile')} maxLength={10} required />
                                </div>
                            </div>
                            <div className="gov-form-group">
                                <label className="gov-form-group__label">
                                    Subject / विषय <span className="gov-form-group__req">*</span>
                                </label>
                                <input className="gov-form-group__field" type="text"
                                    placeholder="Brief subject of your query"
                                    value={form.subject} onChange={set('subject')} required />
                            </div>
                            <div className="gov-form-group">
                                <label className="gov-form-group__label">
                                    Message / संदेश <span className="gov-form-group__req">*</span>
                                </label>
                                <textarea className="gov-form-group__field gov-form-group__field--textarea"
                                    placeholder="Describe your query or feedback in detail"
                                    rows={4} value={form.message} onChange={set('message')} required />
                            </div>
                            <div className="gov-alert gov-alert--info" style={{ fontSize: 11.5, marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                <Icon name="verified_user" size={16} color="#1a5276" style={{ flexShrink: 0, marginTop: 1 }} />
                                Your personal information is collected solely for the purpose of addressing your query
                                and is protected under the Personal Data Protection Bill, 2023.
                            </div>
                            <button type="submit" className="gov-btn gov-btn--primary"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="send" size={16} color="#fff" />
                                Submit Query
                            </button>
                        </form>
                    )}
                </div>
            </div>

        </GovLayout>
    );
}
