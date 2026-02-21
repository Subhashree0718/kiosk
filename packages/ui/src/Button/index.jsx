import React from 'react';

/**
 * Reusable Button component.
 * @param {{ children: React.ReactNode, variant?: 'primary'|'secondary'|'danger'|'ghost', size?: 'sm'|'md'|'lg', disabled?: boolean, onClick?: Function, fullWidth?: boolean, type?: string }} props
 */
export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    fullWidth = false,
    type = 'button',
    className = '',
    ...rest
}) {
    const base = 'suvi-btn';
    const classes = [
        base,
        `${base}--${variant}`,
        `${base}--${size}`,
        fullWidth ? `${base}--full` : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
}
