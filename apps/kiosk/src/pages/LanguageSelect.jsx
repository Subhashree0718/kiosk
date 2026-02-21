import React from 'react';
import { useNavigate } from 'react-router-dom';
import GovLayout from '../components/GovLayout.jsx';

const LANGUAGES = [
    { code: 'en', script: 'A', name: 'English' },
    { code: 'hi', script: 'अ', name: 'हिन्दी' },
    { code: 'ta', script: 'அ', name: 'தமிழ்' },
    { code: 'te', script: 'అ', name: 'తెలుగు' },
];

export default function LanguageSelect() {
    const navigate = useNavigate();

    function select(code) {
        localStorage.setItem('lang', code);
        navigate('/login');
    }

    return (
        <GovLayout breadcrumbs={['Language Selection']}>
            <div className="gov-card">
                <div className="gov-card__header">
                    🌐 Select Language / भाषा चुनें / மொழி தேர்வு / భాష ఎంచుకోండి
                </div>
                <div className="gov-card__body text-center">
                    <p className="text-muted mb-2" style={{ fontSize: 13 }}>
                        Please select your preferred language to continue.
                    </p>
                    <div className="gov-lang-grid">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                className="gov-lang-btn"
                                onClick={() => select(lang.code)}
                                aria-label={`Select ${lang.name}`}
                            >
                                <span className="gov-lang-btn__script">{lang.script}</span>
                                <span className="gov-lang-btn__name">{lang.name}</span>
                            </button>
                        ))}
                    </div>
                    <hr className="gov-divider mt-2" />
                    <p style={{ fontSize: 11, color: 'var(--gov-text-muted)' }}>
                        This is an official service of the Government of India.
                        Your data is protected under the IT Act, 2000.
                    </p>
                </div>
            </div>
        </GovLayout>
    );
}
