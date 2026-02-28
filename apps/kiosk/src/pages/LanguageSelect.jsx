import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';

const LANGUAGES = [
    { code: 'en', script: 'A', name: 'English' },
    { code: 'hi', script: 'अ', name: 'हिन्दी' },
    { code: 'ta', script: 'அ', name: 'தமிழ்' },
    { code: 'te', script: 'అ', name: 'తెలుగు' },
];

export default function LanguageSelect() {
    const navigate = useNavigate();
    const setLanguage = useKioskStore(s => s.setLanguage);

    function select(code) {
        localStorage.setItem('lang', code);
        setLanguage(code);           // ← persist to store so useT() works everywhere
        navigate('/login');
    }


    return (
        <GovLayout breadcrumbs={[]} showSidebar={false}>
            <div className="kiosk-gradient-patriotic" style={{ minHeight: 'calc(100vh - 200px)', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* 1. ELITE EMBLEM & TITLE SECTION */}
                <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 1000 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 30 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                            alt="Emblem" style={{ height: 120 }} />
                        <div style={{ width: 2, background: 'rgba(0,0,0,0.1)' }}></div>
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png"
                            alt="Digital India" style={{ height: 100, marginTop: 10 }} />
                    </div>

                    <h1 className="kiosk-text-display" style={{ fontSize: 56, color: 'var(--gov-navy)', margin: 0 }}>
                        SUVIDHA Digital Gateway
                    </h1>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--gov-saffron)', marginTop: 10, letterSpacing: 2 }}>
                        सुविधा डिजिटल प्रवेश द्वार
                    </div>
                </div>

                {/* 2. GLASSMORPHISM LANGUAGE TILES */}
                <div className="kiosk-grid" style={{ gridTemplateColumns: 'repeat(2, 450px)', gap: 40, justifyContent: 'center' }}>
                    {LANGUAGES.slice(0, 2).map(lang => (
                        <div
                            key={lang.code}
                            className="kiosk-glass"
                            style={{
                                padding: '50px',
                                borderRadius: 40,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 30,
                                border: '2px solid rgba(255,255,255,0.5)'
                            }}
                            onClick={() => select(lang.code)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = 'var(--gov-saffron)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                            }}
                        >
                            <div style={{
                                width: 110, height: 110,
                                background: 'linear-gradient(135deg, var(--gov-navy), var(--gov-navy-l))',
                                color: '#fff',
                                borderRadius: 30,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 60,
                                fontWeight: 900,
                                boxShadow: '0 15px 30px rgba(0,33,71,0.3)',
                                flexShrink: 0
                            }}>
                                {lang.script}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 38, fontWeight: 900, color: 'var(--gov-navy)', lineHeight: 1 }}>
                                    {lang.name}
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#64748b', marginTop: 8, textTransform: 'uppercase' }}>
                                    Continue in {lang.name === 'हिन्दी' ? 'Hindi' : 'English'}
                                </div>
                            </div>
                            <div style={{ marginLeft: 'auto' }}>
                                <span className="material-icons" style={{ fontSize: 40, color: 'var(--gov-saffron)' }}>arrow_forward_ios</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. SAFETY & INFO FOOTER */}
                <div style={{ marginTop: 80, textAlign: 'center' }}>
                    <div style={{
                        background: 'var(--gov-navy)', color: '#fff', padding: '15px 40px',
                        borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 15,
                        fontSize: 18, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <span className="material-icons" style={{ color: 'var(--gov-saffron)' }}>security</span>
                        Secure Bio-Metric & OTP Enabled Portal | सुरक्षित नागरिक सेवा
                    </div>
                </div>

                <div style={{ marginTop: 40, maxWidth: 800, textAlign: 'center', color: '#64748b', fontSize: 16, fontWeight: 600 }}>
                    Ministry of Electronics & Information Technology | Government of India<br />
                    <span style={{ opacity: 0.7, fontSize: 14 }}>System ID: KSK-DL-0982-SVDH | Location: New Delhi Central</span>
                </div>
            </div>
        </GovLayout>
    );
}
