import React from 'react';

/**
 * Reusable text / select input component.
 * @param {{ label: string, id: string, type?: string, value: string, onChange: Function, placeholder?: string, error?: string, required?: boolean }} props
 */
export function Input({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    error,
    required = false,
    className = '',
    ...rest
}) {
    return (
        <div className={`suvi-input-group ${className}`}>
            {label && (
                <label htmlFor={id} className="suvi-input-group__label">
                    {label} {required && <span className="suvi-input-group__required">*</span>}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`suvi-input-group__field ${error ? 'suvi-input-group__field--error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            />
            {error && (
                <span id={`${id}-error`} className="suvi-input-group__error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}

/**
 * Textarea variant.
 */
export function Textarea({ label, id, value, onChange, placeholder, error, rows = 4, className = '', ...rest }) {
    return (
        <div className={`suvi-input-group ${className}`}>
            {label && <label htmlFor={id} className="suvi-input-group__label">{label}</label>}
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`suvi-input-group__field suvi-input-group__field--textarea ${error ? 'suvi-input-group__field--error' : ''}`}
                {...rest}
            />
            {error && <span className="suvi-input-group__error" role="alert">{error}</span>}
        </div>
    );
}

/**
 * Select dropdown variant.
 */
export function Select({ label, id, value, onChange, options = [], error, className = '', ...rest }) {
    return (
        <div className={`suvi-input-group ${className}`}>
            {label && <label htmlFor={id} className="suvi-input-group__label">{label}</label>}
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`suvi-input-group__field ${error ? 'suvi-input-group__field--error' : ''}`}
                {...rest}
            >
                <option value="">-- Select --</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span className="suvi-input-group__error" role="alert">{error}</span>}
        </div>
    );
}
