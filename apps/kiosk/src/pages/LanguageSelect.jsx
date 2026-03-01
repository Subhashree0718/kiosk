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
            <div className="kiosk-gradient-patriotic" style={{ minHeight: 'calc(100vh - 200px)', padding: 'var(--kiosk-p-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* 1. ELITE EMBLEM & TITLE SECTION */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--kiosk-gap)', maxWidth: '1000px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--kiosk-gap)', marginBottom: 30, flexWrap: 'wrap' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                            alt="Emblem" style={{ height: 'var(--kiosk-icon-size)' }} />
                        <div className="desktop-only" style={{ width: 2, background: 'rgba(0,0,0,0.1)' }}></div>
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Digital_India_Logo.svg/320px-Digital_India_Logo.svg.png"
                            alt="Digital India" style={{ height: 'calc(var(--kiosk-icon-size) * 0.8)', marginTop: 10 }} />
                    </div>

                    <h1 className="kiosk-text-display" style={{ fontSize: 'var(--kiosk-title-size)', color: 'var(--gov-navy)', margin: 0 }}>
                        SUVIDHA Digital Gateway
                    </h1>
                    <div style={{ fontSize: 'var(--kiosk-subtitle-size)', fontWeight: 800, color: 'var(--gov-saffron)', marginTop: 10, letterSpacing: 2 }}>
                        सुविधा डिजिटल प्रवेश द्वार
                    </div>
                </div>

                {/* 2. GLASSMORPHISM LANGUAGE TILES */}
                <div className="kiosk-grid" style={{ gridTemplateColumns: 'var(--kiosk-grid-main)', gap: 'var(--kiosk-gap)', justifyContent: 'center', width: '100%', maxWidth: 1000 }}>
                    {LANGUAGES.slice(0, 2).map(lang => (
                        <div
                            key={lang.code}
                            className="kiosk-glass"
                            style={{
                                padding: 'var(--kiosk-p-md)',
                                borderRadius: 40,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 20,
                                border: '2px solid rgba(255,255,255,0.5)',
                                width: '100%'
                            }}
                            onClick={() => select(lang.code)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
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
                                width: 'calc(var(--kiosk-icon-size) * 0.8)', height: 'calc(var(--kiosk-icon-size) * 0.8)',
                                background: 'linear-gradient(135deg, var(--gov-navy), var(--gov-navy-l))',
                                color: '#fff',
                                borderRadius: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'calc(var(--kiosk-icon-size) * 0.5)',
                                fontWeight: 900,
                                boxShadow: '0 10px 20px rgba(0,33,71,0.2)',
                                flexShrink: 0
                            }}>
                                {lang.script}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 'calc(var(--kiosk-subtitle-size) * 1.1)', fontWeight: 900, color: 'var(--gov-navy)', lineHeight: 1 }}>
                                    {lang.name}
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginTop: 8, textTransform: 'uppercase' }}>
                                    {lang.name === 'हिन्दी' ? 'Hindi' : 'English'}
                                </div>
                            </div>
                            <div style={{ marginLeft: 'auto' }} className="desktop-only">
                                <span className="material-icons" style={{ fontSize: 30, color: 'var(--gov-saffron)' }}>arrow_forward_ios</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. SAFETY & INFO FOOTER */}
                <div style={{ marginTop: 'var(--kiosk-gap)', textAlign: 'center', width: '100%' }}>
                    <div style={{
                        background: 'var(--gov-navy)', color: '#fff', padding: '12px 24px',
                        borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 10,
                        fontSize: 14, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        maxWidth: '90%'
                    }}>
                        <span className="material-icons" style={{ color: 'var(--gov-saffron)', fontSize: 18 }}>security</span>
                        <span className="desktop-only">Secure Bio-Metric & OTP Enabled Portal | सुरक्षित नागरिक सेवा</span>
                        <span className="mobile-only">Secure OTP Portal | सुरक्षित पोर्टल</span>
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
