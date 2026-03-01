import React from 'react';

const THEMES = {
    navy: {
        bg: 'linear-gradient(135deg, #002147 0%, #003d7a 60%, #005099 100%)',
        iconColor: '#003d7a'
    },
    blue: {
        bg: 'linear-gradient(135deg, #1a5276 0%, #2980b9 100%)',
        iconColor: '#2980b9'
    },
    saffron: {
        bg: 'linear-gradient(135deg, #d35400 0%, #e67e22 100%)',
        iconColor: '#d35400'
    },
    red: {
        bg: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
        iconColor: '#c0392b'
    },
    green: {
        bg: 'linear-gradient(135deg, #117a3d 0%, #1abc6d 100%)',
        iconColor: '#117a3d'
    },
    purple: {
        bg: 'linear-gradient(135deg, #4a1a6e 0%, #8e44ad 100%)',
        iconColor: '#6c3483'
    },
    teal: {
        bg: 'linear-gradient(135deg, #0e6251 0%, #1abc9c 100%)',
        iconColor: '#16a085'
    }
};

export default function KioskFormCard({
    title,
    subtitle,
    icon = 'assignment',
    theme = 'blue',
    maxWidth = '900px',
    children
}) {
    const currentTheme = THEMES[theme] || THEMES.blue;

    return (
        <div style={{
            maxWidth: maxWidth,
            margin: '40px auto',
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)',
            fontFamily: 'var(--gov-font)'
        }}>
            {/* Gradient Header */}
            <div style={{
                background: currentTheme.bg,
                padding: '36px 40px',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: -20,
                    right: 20,
                    opacity: 0.1,
                    transform: 'rotate(-10deg)',
                    pointerEvents: 'none'
                }}>
                    <span className="material-icons" style={{ fontSize: '180px' }}>{icon}</span>
                </div>

                <h2 style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    margin: 0,
                    position: 'relative',
                    zIndex: 1,
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                    {title}
                </h2>

                {subtitle && (
                    <p style={{
                        fontSize: '17px',
                        fontWeight: 500,
                        margin: '8px 0 0 0',
                        opacity: 0.9,
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: '80%'
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Form Content Body */}
            <div style={{ padding: '40px' }} className="kiosk-form-wrapper">
                <style dangerouslySetInnerHTML={{
                    __html: `
          .kiosk-form-wrapper .form-section-head {
            font-size: 20px;
            font-weight: 800 !important;
            color: ${currentTheme.iconColor};
            border-bottom: 2px solid ${currentTheme.iconColor}20;
            padding-bottom: 12px;
            margin-bottom: 24px;
            margin-top: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .kiosk-form-wrapper .form-section-head:first-child {
            margin-top: 0;
          }
          .kiosk-form-wrapper .form-label {
            display: block;
            font-size: 14px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kiosk-form-wrapper .req-star {
            color: #ef4444;
            margin-left: 2px;
          }
          .kiosk-form-wrapper .form-input, .kiosk-form-wrapper .form-select {
            width: 100%;
            padding: 14px 18px;
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 16px;
            color: #0f172a;
            outline: none;
            transition: all 0.2s;
            font-family: inherit;
          }
          .kiosk-form-wrapper .form-input:focus, .kiosk-form-wrapper .form-select:focus {
            background: #fff;
            border-color: ${currentTheme.iconColor};
            box-shadow: 0 0 0 4px ${currentTheme.iconColor}15;
          }
          .kiosk-form-wrapper .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          @media(max-width: 640px){
            .kiosk-form-wrapper .form-grid { grid-template-columns: 1fr; }
          }
          .kiosk-form-wrapper .col-span-2 {
            grid-column: span 2;
          }
          .kiosk-form-wrapper .btn-submit {
            padding: 14px 32px;
            background: ${currentTheme.bg};
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 10px 20px ${currentTheme.iconColor}30;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .kiosk-form-wrapper .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 25px ${currentTheme.iconColor}40;
          }
          .kiosk-form-wrapper .btn-cancel {
            padding: 14px 32px;
            background: transparent;
            color: #64748b;
            font-size: 16px;
            font-weight: 700;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .kiosk-form-wrapper .btn-cancel:hover {
            background: #f1f5f9;
            color: #334155;
            border-color: #cbd5e1;
          }
          .kiosk-form-wrapper .form-actions {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: flex-end;
            gap: 16px;
          }
          .kiosk-form-wrapper .radio-group {
            display: flex;
            gap: 24px;
            margin-top: 8px;
          }
          .kiosk-form-wrapper .radio-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            color: #334155;
          }
          .kiosk-form-wrapper input[type="radio"] {
            width: 20px;
            height: 20px;
            accent-color: ${currentTheme.iconColor};
          }
          .kiosk-form-wrapper input[type="file"]::file-selector-button {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 6px 16px;
            color: #475569;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            margin-right: 12px;
          }
          .kiosk-form-wrapper input[type="file"]::file-selector-button:hover {
            background: #e2e8f0;
          }
        `}} />
                {children}
            </div>
        </div>
    );
}
