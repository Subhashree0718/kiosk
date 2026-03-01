import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#27ae60';
const inputStyle = { width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' };
const labelStyle = { display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 };

export default function GasNewConnection() {
    const navigate = useNavigate();
    const { t } = useT();
    const [form, setForm] = useState({
        fullName: '', aadhaar: '', address: '', city: '', state: '', pinCode: '',
        mobile: '', email: '', connectionType: 'domestic', preferredDistributor: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const req = <span style={{ color: '#c0392b' }}>*</span>;

    if (submitted) {
        return (
            <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('New Connection', 'नया कनेक्शन')]}>
                <div className="kiosk-gov-strip"></div>
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Icon name="check_circle" size={64} color="#27ae60" />
                    </div>
                    <h2 style={{ fontSize: 32, color: 'var(--gov-navy)', marginBottom: 12 }}>{t('Application Submitted!', 'आवेदन जमा हो गया!')}</h2>
                    <p style={{ fontSize: 18, color: '#666', marginBottom: 8 }}>{t('Reference:', 'संदर्भ:')} <strong style={{ color: COLOR }}>NGC-2026-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong></p>
                    <p style={{ fontSize: 16, color: '#888' }}>{t('Processing time: 7-15 working days', 'प्रसंस्करण समय: 7-15 कार्य दिवस')}</p>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60, padding: '0 40px', marginTop: 36 }} onClick={() => navigate('/gas')}>
                        {t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </GovLayout>
        );
    }

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('New Connection', 'नया कनेक्शन')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">नया गैस कनेक्शन</div>
                    <div className="kiosk-gov-text-en">New Gas Connection</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('Apply for a new LPG connection', 'नए एलपीजी कनेक्शन के लिए आवेदन करें')}</div>
                </div>
            </div>
            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('New Connection Application', 'नया कनेक्शन आवेदन')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Please fill all required fields', 'कृपया सभी आवश्यक फ़ील्ड भरें')}</p>
                </div>
                <div className="gov-card" style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="person_add" size={18} color="#fff" style={{ marginRight: 8 }} />{t('Applicant Details', 'आवेदक विवरण')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: COLOR, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="person" size={20} color={COLOR} /> {t('Personal Information', 'व्यक्तिगत जानकारी')}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div><label style={labelStyle}>{t('Full Name', 'पूरा नाम')} {req}</label><input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} required style={inputStyle} /></div>
                                <div><label style={labelStyle}>{t('Aadhaar Number', 'आधार नंबर')} {req}</label><input type="text" value={form.aadhaar} onChange={e => set('aadhaar', e.target.value)} maxLength={12} required style={inputStyle} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                                <div><label style={labelStyle}>{t('Mobile Number', 'मोबाइल नंबर')} {req}</label><input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} maxLength={10} required style={inputStyle} /></div>
                                <div><label style={labelStyle}>{t('Email Address', 'ईमेल पता')}</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} /></div>
                            </div>

                            <div style={{ fontSize: 16, fontWeight: 800, color: COLOR, margin: '28px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="location_on" size={20} color={COLOR} /> {t('Address Details', 'पता विवरण')}
                            </div>
                            <div style={{ marginBottom: 20 }}><label style={labelStyle}>{t('Full Address', 'पूरा पता')} {req}</label><textarea value={form.address} onChange={e => set('address', e.target.value)} rows={3} required style={{ ...inputStyle, resize: 'vertical' }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                                <div><label style={labelStyle}>{t('City', 'शहर')} {req}</label><input type="text" value={form.city} onChange={e => set('city', e.target.value)} required style={inputStyle} /></div>
                                <div><label style={labelStyle}>{t('State', 'राज्य')} {req}</label>
                                    <select value={form.state} onChange={e => set('state', e.target.value)} required style={{ ...inputStyle, background: '#fff' }}>
                                        <option value="">{t('Select', 'चुनें')}</option>
                                        {['Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div><label style={labelStyle}>{t('PIN Code', 'पिन कोड')} {req}</label><input type="text" value={form.pinCode} onChange={e => set('pinCode', e.target.value)} maxLength={6} required style={inputStyle} /></div>
                            </div>

                            <div style={{ fontSize: 16, fontWeight: 800, color: COLOR, margin: '28px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="local_fire_department" size={20} color={COLOR} /> {t('Connection Details', 'कनेक्शन विवरण')}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div><label style={labelStyle}>{t('Connection Type', 'कनेक्शन प्रकार')} {req}</label>
                                    <select value={form.connectionType} onChange={e => set('connectionType', e.target.value)} required style={{ ...inputStyle, background: '#fff' }}>
                                        <option value="domestic">{t('Domestic', 'घरेलू')}</option>
                                        <option value="commercial">{t('Commercial', 'वाणिज्यिक')}</option>
                                    </select>
                                </div>
                                <div><label style={labelStyle}>{t('Preferred Distributor', 'पसंदीदा वितरक')}</label>
                                    <select value={form.preferredDistributor} onChange={e => set('preferredDistributor', e.target.value)} style={{ ...inputStyle, background: '#fff' }}>
                                        <option value="">{t('Auto-assign nearest', 'निकटतम स्वचालित')}</option>
                                        <option value="hp">HP Gas</option><option value="indane">Indane Gas (IOC)</option><option value="bharat">Bharat Gas (BPCL)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ fontSize: 16, fontWeight: 800, color: COLOR, margin: '28px 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="upload_file" size={20} color={COLOR} /> {t('Document Upload', 'दस्तावेज़ अपलोड')}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div><label style={labelStyle}>{t('ID Proof', 'आईडी प्रूफ')} {req}</label><input type="file" accept=".pdf,.jpg,.png" required style={{ ...inputStyle, padding: 12, border: '2px dashed var(--gov-input-border)', background: '#fafafa' }} /></div>
                                <div><label style={labelStyle}>{t('Address Proof', 'पता प्रमाण')} {req}</label><input type="file" accept=".pdf,.jpg,.png" required style={{ ...inputStyle, padding: 12, border: '2px dashed var(--gov-input-border)', background: '#fafafa' }} /></div>
                            </div>

                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 60, fontSize: 18, marginTop: 32 }}>
                                <Icon name="send" size={22} color="#fff" style={{ marginRight: 8 }} />{t('SUBMIT APPLICATION', 'आवेदन जमा करें')}
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
