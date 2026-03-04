import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';
import { useKioskStore } from '../store/index.js';
import { LANGUAGES } from '../config/languages.js';

export default function LanguageSelect() {
    const navigate = useNavigate();
    const setLanguage = useKioskStore(s => s.setLanguage);

    function select(code) {
        setLanguage(code);
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
                        <img src="/digital-india.svg"
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 'var(--kiosk-gap)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 1000,
                    margin: '0 auto'
                }}>
                    {LANGUAGES.map(lang => (
                        <div
                            key={lang.code}
                            className="kiosk-glass"
                            style={{
                                padding: 'var(--kiosk-p-md)',
                                borderRadius: 40,
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 25,
                                border: '3px solid rgba(255,255,255,0.6)',
                                background: 'rgba(255,255,255,0.95)',
                                boxShadow: '0 15px 35px rgba(0,33,71,0.08)',
                                width: '100%'
                            }}
                            onClick={() => select(lang.code)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,33,71,0.15)';
                                e.currentTarget.style.borderColor = 'var(--gov-saffron)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,33,71,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                            }}
                        >
                            <div style={{
                                width: 90, height: 90,
                                background: 'linear-gradient(135deg, var(--gov-navy), var(--gov-navy-l))',
                                color: '#fff',
                                borderRadius: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 44,
                                fontWeight: 900,
                                boxShadow: '0 10px 20px rgba(0,33,71,0.2)',
                                flexShrink: 0
                            }}>
                                {lang.script}
                            </div>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--gov-navy)', lineHeight: 1.1 }}>
                                    {lang.nativeName}
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {lang.name}
                                </div>
                            </div>
                            <div className="desktop-only" style={{ marginLeft: 10 }}>
                                <span className="material-icons" style={{ fontSize: 36, color: 'var(--gov-saffron)', opacity: 0.6 }}>chevron_right</span>
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
                    <span style={{ opacity: 0.7, fontSize: 14 }}>System ID: KSK-DL-0982-SVDH | Location: New Delhi Central</span>
                </div>
            </div>
        </GovLayout>
    );
}
