import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const RED = '#c0392b';
const inputStyle = { width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' };
const labelStyle = { display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 };

export default function GasEmergencyHelp() {
    const navigate = useNavigate();
    const { t } = useT();
    const [form, setForm] = useState({ complaintType: '', lpgId: '', description: '', address: '', contact: '', priority: 'urgent' });
    const [submitted, setSubmitted] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const req = <span style={{ color: RED }}>*</span>;

    if (submitted) {
        return (
            <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Emergency Help', 'आपातकालीन सहायता')]}>
                <div className="kiosk-gov-strip"></div>
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#fde8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Icon name="check_circle" size={64} color="#27ae60" />
                    </div>
                    <h2 style={{ fontSize: 32, color: 'var(--gov-navy)', marginBottom: 12 }}>{t('Complaint Registered!', 'शिकायत दर्ज!')}</h2>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Complaint ID:', 'शिकायत आईडी:')} <strong style={{ color: RED }}>EMG-2026-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong></p>
                    <p style={{ fontSize: 16, color: '#888' }}>{t('Emergency team will contact you shortly', 'आपातकालीन टीम शीघ्र ही संपर्क करेगी')}</p>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60, padding: '0 40px', marginTop: 36 }} onClick={() => navigate('/gas')}>
                        {t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </GovLayout>
        );
    }

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Emergency Help', 'आपातकालीन सहायता')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header" style={{ borderBottom: `3px solid ${RED}` }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi" style={{ color: RED }}>आपातकालीन सहायता</div>
                    <div className="kiosk-gov-text-en" style={{ color: RED }}>Emergency Help</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('Gas Leak / Safety Complaint', 'गैस रिसाव / सुरक्षा शिकायत')}</div>
                </div>
            </div>

            <div className="kiosk-container">
                {/* Emergency Alert Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
                    border: `2px solid ${RED}40`,
                    borderLeft: `6px solid ${RED}`,
                    borderRadius: 12,
                    padding: '20px 28px',
                    marginBottom: 28,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                }}>
                    <div style={{ animation: 'pulse-badge 1.5s ease-in-out infinite' }}>
                        <Icon name="warning" size={48} color={RED} />
                    </div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: RED, marginBottom: 4 }}>
                            {t('⚠ If you smell gas, act immediately!', '⚠ गैस की गंध आने पर तत्काल कार्रवाई करें!')}
                        </div>
                        <div style={{ fontSize: 15, color: '#666', lineHeight: 1.6 }}>
                            {t(
                                '1. Turn off the gas regulator  2. Open all doors & windows  3. Do NOT use electrical switches  4. Call the helpline',
                                '1. गैस रेगुलेटर बंद करें  2. सभी दरवाज़े और खिड़कियां खोलें  3. बिजली के स्विच न चलाएं  4. हेल्पलाइन कॉल करें'
                            )}
                        </div>
                    </div>
                </div>

                {/* Emergency Numbers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
                    {[
                        { label: t('Gas Emergency', 'गैस आपातकालीन'), number: '1906', icon: 'local_fire_department', bg: '#fde8e8' },
                        { label: t('Fire Department', 'अग्निशमन विभाग'), number: '101', icon: 'fire_truck', bg: '#fff3e0' },
                        { label: t('Police / Ambulance', 'पुलिस / एम्बुलेंस'), number: '112', icon: 'emergency', bg: '#e3f2fd' },
                    ].map(item => (
                        <div key={item.number} style={{
                            background: item.bg, borderRadius: 16, padding: 24, textAlign: 'center',
                            border: '2px solid transparent', transition: 'border-color 0.2s',
                        }}>
                            <Icon name={item.icon} size={40} color={RED} />
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#555', margin: '8px 0 4px' }}>{item.label}</div>
                            <div style={{ fontSize: 36, fontWeight: 900, color: RED, letterSpacing: 2 }}>{item.number}</div>
                        </div>
                    ))}
                </div>

                {/* Complaint Form */}
                <div className="gov-card" style={{ maxWidth: 750, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${RED}`, background: RED }}>
                        <Icon name="report_problem" size={18} color="#fff" style={{ marginRight: 8 }} />
                        {t('Lodge Emergency Complaint', 'आपातकालीन शिकायत दर्ज करें')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <label style={labelStyle}>{t('Complaint Type', 'शिकायत प्रकार')} {req}</label>
                                    <select value={form.complaintType} onChange={e => set('complaintType', e.target.value)} required style={{ ...inputStyle, background: '#fff' }}>
                                        <option value="">{t('Select type', 'प्रकार चुनें')}</option>
                                        <option value="gas_leak">{t('Gas Leak', 'गैस रिसाव')}</option>
                                        <option value="regulator">{t('Regulator Issue', 'रेगुलेटर समस्या')}</option>
                                        <option value="cylinder_damage">{t('Cylinder Damage', 'सिलेंडर क्षति')}</option>
                                        <option value="fire">{t('Fire Incident', 'आग की घटना')}</option>
                                        <option value="other">{t('Other', 'अन्य')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('LPG ID (if available)', 'एलपीजी आईडी (यदि उपलब्ध हो)')}</label>
                                    <input type="text" value={form.lpgId} onChange={e => set('lpgId', e.target.value)} placeholder={t('LPG ID', 'एलपीजी आईडी')} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <label style={labelStyle}>{t('Description', 'विवरण')} {req}</label>
                                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                                    placeholder={t('Describe the emergency situation', 'आपातकालीन स्थिति का वर्णन करें')} required style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <label style={labelStyle}>{t('Location / Address', 'स्थान / पता')} {req}</label>
                                <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2}
                                    placeholder={t('Full address with landmark', 'लैंडमार्क सहित पूरा पता')} required style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                                <div>
                                    <label style={labelStyle}>{t('Contact Number', 'संपर्क नंबर')} {req}</label>
                                    <input type="tel" value={form.contact} onChange={e => set('contact', e.target.value)} maxLength={10} required
                                        placeholder={t('10-digit mobile', '10 अंकों का मोबाइल')} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('Priority', 'प्राथमिकता')} {req}</label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {[
                                            { value: 'urgent', label: t('Urgent', 'तत्काल'), color: RED },
                                            { value: 'normal', label: t('Normal', 'सामान्य'), color: '#7d6608' },
                                        ].map(p => (
                                            <label key={p.value} style={{
                                                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', flex: 1,
                                                border: form.priority === p.value ? `2px solid ${p.color}` : '2px solid #ddd',
                                                borderRadius: 10, cursor: 'pointer', justifyContent: 'center',
                                                background: form.priority === p.value ? p.color + '10' : '#fff',
                                            }}>
                                                <input type="radio" name="priority" value={p.value} checked={form.priority === p.value}
                                                    onChange={() => set('priority', p.value)} style={{ display: 'none' }} />
                                                <Icon name={p.value === 'urgent' ? 'priority_high' : 'low_priority'} size={20} color={form.priority === p.value ? p.color : '#888'} />
                                                <span style={{ fontSize: 15, fontWeight: 700, color: form.priority === p.value ? p.color : '#555' }}>{p.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 60, fontSize: 18, marginTop: 28, background: RED, borderColor: RED }}>
                                <Icon name="send" size={22} color="#fff" style={{ marginRight: 8 }} />{t('SUBMIT EMERGENCY COMPLAINT', 'आपातकालीन शिकायत जमा करें')}
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 70, padding: '0 50px' }} onClick={() => navigate('/gas')}>
                        <Icon name="arrow_back" size={26} color="#fff" />&nbsp;&nbsp;{t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
