import React from 'react';

/**
 * Card container component.
 * @param {{ children: React.ReactNode, onClick?: Function, elevated?: boolean, className?: string }} props
 */
export function Card({ children, onClick, elevated = false, className = '' }) {
    const classes = ['suvi-card', elevated ? 'suvi-card--elevated' : '', className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined}>
            {children}
        </div>
    );
}

Card.Header = function CardHeader({ children, className = '' }) {
    return <div className={`suvi-card__header ${className}`}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '' }) {
    return <div className={`suvi-card__body ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
    return <div className={`suvi-card__footer ${className}`}>{children}</div>;
};
