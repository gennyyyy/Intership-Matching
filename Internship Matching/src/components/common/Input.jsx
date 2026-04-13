import React, { forwardRef } from 'react';

export const Input = forwardRef(({
    id,
    label,
    type = 'text',
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                type={type}
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-colors ${error
                        ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
