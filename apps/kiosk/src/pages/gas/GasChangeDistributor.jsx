import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#7d6608';
const inputStyle = { width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' };
const labelStyle = { display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 };

export default function GasChangeDistributor() {
    const navigate = useNavigate();
    const { t } = useT();
    const [form, setForm] = useState({ lpgId: '', currentDistributor: '', reason: '', newDistributor: '', remarks: '' });
    const [submitted, setSubmitted] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const req = <span style={{ color: '#c0392b' }}>*</span>;

    if (submitted) {
        return (
            <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Change Distributor', 'वितरक बदलें')]}>
                <div className="kiosk-gov-strip"></div>
                <div className="kiosk-container" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Icon name="check_circle" size={64} color="#27ae60" />
                    </div>
                    <h2 style={{ fontSize: 32, color: 'var(--gov-navy)', marginBottom: 12 }}>{t('Transfer Request Submitted!', 'स्थानांतरण अनुरोध जमा!')}</h2>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Reference:', 'संदर्भ:')} <strong style={{ color: COLOR }}>CDR-2026-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong></p>
                    <p style={{ fontSize: 16, color: '#888' }}>{t('Transfer will be processed within 15-30 days', 'स्थानांतरण 15-30 दिनों में संसाधित होगा')}</p>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 60, padding: '0 40px', marginTop: 36 }} onClick={() => navigate('/gas')}>
                        {t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </GovLayout>
        );
    }

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Change Distributor', 'वितरक बदलें')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">वितरक बदलें</div>
                    <div className="kiosk-gov-text-en">Change Distributor</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('Request distributor transfer', 'वितरक स्थानांतरण अनुरोध')}</div>
                </div>
            </div>
            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('Distributor Transfer Request', 'वितरक स्थानांतरण अनुरोध')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Fill in the details to request a change of distributor', 'वितरक बदलने का अनुरोध करने के लिए विवरण भरें')}</p>
                </div>
                <div className="gov-card" style={{ maxWidth: 720, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="swap_horiz" size={18} color="#fff" style={{ marginRight: 8 }} />{t('Transfer Form', 'स्थानांतरण फॉर्म')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>{t('LPG ID / Consumer Number', 'एलपीजी आईडी / उपभोक्ता संख्या')} {req}</label>
                                <input type="text" value={form.lpgId} onChange={e => set('lpgId', e.target.value)} placeholder={t('Enter 17-digit LPG ID', '17 अंकों की एलपीजी आईडी दर्ज करें')} required style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <label style={labelStyle}>{t('Current Distributor', 'वर्तमान वितरक')} {req}</label>
                                    <select value={form.currentDistributor} onChange={e => set('currentDistributor', e.target.value)} required style={{ ...inputStyle, background: '#fff' }}>
                                        <option value="">{t('Select current', 'वर्तमान चुनें')}</option>
                                        <option value="hp">HP Gas Agency</option><option value="indane">Indane Gas Agency</option><option value="bharat">Bharat Gas Agency</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('Preferred New Distributor', 'पसंदीदा नया वितरक')} {req}</label>
                                    <select value={form.newDistributor} onChange={e => set('newDistributor', e.target.value)} required style={{ ...inputStyle, background: '#fff' }}>
                                        <option value="">{t('Select new', 'नया चुनें')}</option>
                                        <option value="hp">HP Gas Agency</option><option value="indane">Indane Gas Agency</option><option value="bharat">Bharat Gas Agency</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <label style={labelStyle}>{t('Reason for Transfer', 'स्थानांतरण का कारण')} {req}</label>
                                <select value={form.reason} onChange={e => set('reason', e.target.value)} required style={{ ...inputStyle, background: '#fff' }}>
                                    <option value="">{t('Select reason', 'कारण चुनें')}</option>
                                    <option value="relocation">{t('Relocation / Address Change', 'स्थानांतरण / पता परिवर्तन')}</option>
                                    <option value="service">{t('Poor Service Quality', 'खराब सेवा गुणवत्ता')}</option>
                                    <option value="delay">{t('Frequent Delivery Delays', 'बार-बार डिलीवरी में देरी')}</option>
                                    <option value="other">{t('Other', 'अन्य')}</option>
                                </select>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <label style={labelStyle}>{t('Additional Remarks', 'अतिरिक्त टिप्पणी')}</label>
                                <textarea value={form.remarks} onChange={e => set('remarks', e.target.value)} rows={3} placeholder={t('Any additional details...', 'कोई अतिरिक्त विवरण...')} style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ width: '100%', height: 60, fontSize: 18, marginTop: 28 }}>
                                <Icon name="send" size={22} color="#fff" style={{ marginRight: 8 }} />{t('SUBMIT REQUEST', 'अनुरोध जमा करें')}
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
