import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../../components/GovLayout.jsx';
import { useT } from '../../hooks/useT.js';

const Icon = ({ name, size = 18, color = 'currentColor', style = {} }) => (
    <span className="material-icons" style={{ fontSize: size, color, lineHeight: 1, verticalAlign: 'middle', ...style }}>{name}</span>
);

const COLOR = '#d35400';
const inputStyle = { width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid var(--gov-input-border)', borderRadius: 8, fontFamily: 'var(--gov-font)', outline: 'none' };
const labelStyle = { display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--gov-navy)', marginBottom: 6 };

export default function GasSubsidyStatus() {
    const navigate = useNavigate();
    const { t } = useT();
    const [searchType, setSearchType] = useState('aadhaar');
    const [searchValue, setSearchValue] = useState('');
    const [fetched, setFetched] = useState(false);

    return (
        <GovLayout breadcrumbs={['Departments', t('Gas Service', 'गैस सेवा'), t('Subsidy Status', 'सब्सिडी स्थिति')]}>
            <div className="kiosk-gov-strip"></div>
            <div className="kiosk-gov-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png" alt="Emblem of India" className="kiosk-gov-emblem" />
                <div className="kiosk-gov-title-group">
                    <div className="kiosk-gov-text-hi">सब्सिडी स्थिति</div>
                    <div className="kiosk-gov-text-en">Subsidy Status</div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>{t('PAHAL (DBTL) Scheme — Check your LPG subsidy status', 'पहल (डीबीटीएल) योजना — अपनी एलपीजी सब्सिडी स्थिति जांचें')}</div>
                </div>
            </div>
            <div className="kiosk-container">
                <div className="kiosk-header">
                    <div className="kiosk-title" style={{ fontSize: 32 }}>{t('Check Subsidy Status', 'सब्सिडी स्थिति जांचें')}</div>
                    <p style={{ fontSize: 18, color: '#666' }}>{t('Enter your Aadhaar or LPG ID to check subsidy details', 'सब्सिडी विवरण जांचने के लिए आधार या एलपीजी आईडी दर्ज करें')}</p>
                </div>

                <div className="gov-card" style={{ maxWidth: 700, margin: '0 auto' }}>
                    <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                        <Icon name="account_balance" size={18} color="#fff" style={{ marginRight: 8 }} />{t('Search Subsidy', 'सब्सिडी खोजें')}
                    </div>
                    <div className="gov-card__body" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                            {[
                                { value: 'aadhaar', label: t('Aadhaar Number', 'आधार नंबर'), icon: 'fingerprint' },
                                { value: 'lpg', label: t('LPG ID', 'एलपीजी आईडी'), icon: 'local_fire_department' },
                            ].map(opt => (
                                <label key={opt.value} style={{
                                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                                    border: searchType === opt.value ? `2px solid ${COLOR}` : '2px solid #ddd',
                                    borderRadius: 10, cursor: 'pointer',
                                    background: searchType === opt.value ? COLOR + '10' : '#fff',
                                }}>
                                    <input type="radio" name="searchType" value={opt.value} checked={searchType === opt.value}
                                        onChange={() => { setSearchType(opt.value); setSearchValue(''); setFetched(false); }} style={{ display: 'none' }} />
                                    <Icon name={opt.icon} size={20} color={searchType === opt.value ? COLOR : '#888'} />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: searchType === opt.value ? COLOR : '#555' }}>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                        <form onSubmit={e => { e.preventDefault(); setFetched(true); }} style={{ display: 'flex', gap: 16 }}>
                            <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)}
                                placeholder={searchType === 'aadhaar' ? t('12-digit Aadhaar', '12 अंकों का आधार') : t('17-digit LPG ID', '17 अंकों की एलपीजी आईडी')}
                                maxLength={searchType === 'aadhaar' ? 12 : 17} required style={{ ...inputStyle, flex: 1 }} />
                            <button type="submit" className="kiosk-btn kiosk-btn--primary" style={{ height: 52, padding: '0 32px', fontSize: 16 }}>
                                <Icon name="search" size={20} color="#fff" style={{ marginRight: 6 }} />{t('CHECK', 'जांचें')}
                            </button>
                        </form>
                    </div>
                </div>

                {fetched && (
                    <div className="gov-card" style={{ maxWidth: 700, margin: '24px auto 0' }}>
                        <div className="gov-card__header" style={{ borderLeft: `4px solid ${COLOR}` }}>
                            <Icon name="verified" size={18} color="#fff" style={{ marginRight: 8 }} />{t('Subsidy Details', 'सब्सिडी विवरण')}
                        </div>
                        <div className="gov-card__body" style={{ padding: 28 }}>
                            {/* Status badge */}
                            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 28px', background: '#e8f5e9', borderRadius: 12, border: '2px solid #27ae6040' }}>
                                    <Icon name="check_circle" size={28} color="#27ae60" />
                                    <span style={{ fontSize: 20, fontWeight: 800, color: '#27ae60' }}>{t('SUBSIDY ACTIVE', 'सब्सिडी सक्रिय')}</span>
                                </div>
                            </div>

                            {[
                                { label: t('Scheme Name', 'योजना का नाम'), value: 'PAHAL (DBTL)', icon: 'policy' },
                                { label: t('Linked Bank Account', 'लिंक बैंक खाता'), value: 'XXXX XXXX XXXX 4523 (SBI)', icon: 'account_balance' },
                                { label: t('Aadhaar Status', 'आधार स्थिति'), value: t('Linked & Verified', 'लिंक और सत्यापित'), icon: 'fingerprint' },
                                { label: t('Last Subsidy Amount', 'अंतिम सब्सिडी राशि'), value: '₹ 203.77', icon: 'currency_rupee' },
                                { label: t('Last Credit Date', 'अंतिम क्रेडिट तिथि'), value: '18 Feb 2026', icon: 'calendar_today' },
                                { label: t('Total Subsidies Received', 'कुल प्राप्त सब्सिडी'), value: '₹ 4,872.50 (24 refills)', icon: 'savings' },
                                { label: t('Entitled Cylinders/Year', 'वार्षिक पात्र सिलेंडर'), value: '12', icon: 'propane_tank' },
                                { label: t('Cylinders Used This Year', 'इस वर्ष उपयोग किए गए'), value: '3 / 12', icon: 'data_usage' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 7 ? '1px solid #eee' : 'none' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: COLOR + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon name={item.icon} size={22} color={COLOR} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{item.label}</div>
                                        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gov-navy)' }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button className="kiosk-btn kiosk-btn--secondary" style={{ height: 70, padding: '0 50px' }} onClick={() => navigate('/gas')}>
                        <Icon name="arrow_back" size={26} color="#fff" />&nbsp;&nbsp;{t('BACK TO GAS SERVICES', 'गैस सेवाओं पर वापस जाएं')}
                    </button>
                </div>
            </div>
        </GovLayout>
    );
}
