import React, { useEffect } from 'react';

/**
 * Accessible modal dialog.
 * @param {{ isOpen: boolean, onClose: Function, title?: string, children: React.ReactNode }} props
 */
export function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="suvi-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="suvi-modal">
                <div className="suvi-modal__header">
                    {title && <h2 id="modal-title" className="suvi-modal__title">{title}</h2>}
                    <button className="suvi-modal__close" onClick={onClose} aria-label="Close">✕</button>
                </div>
                <div className="suvi-modal__body">{children}</div>
            </div>
        </div>
    );
}
