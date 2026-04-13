import React from 'react';

export const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
    onClick,
    ...props
}) => {
    const baseStyles = 'inline-flex justify-center rounded-md border py-2 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm';

    const variants = {
        primary: 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'border-transparent bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 shadow-none',
    };

    const classes = `${baseStyles} ${variants[variant]} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
