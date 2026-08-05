import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:'primary' | 'secondary' | 'danger' | 'danger-light' | 'danger-icon' | 'success' | 'ghost' | 'ghost-icon';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    loadingText?: string;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    startIcon,
    endIcon,
    loadingText = 'Loading...',
    className = '',
    disabled = false,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center transition-colors font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
        'danger-light': "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200",
        'danger-icon': "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 rounded-full",
        success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-200 border-none",
        'ghost-icon': "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-200 border-none rounded-full",
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2",
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${variant === 'danger-icon' && size === 'md'? 'p-1' : ''} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <ImSpinner2 className="w-4 h-4 animate-spin mr-2" />}

            {isLoading && loadingText ? loadingText : (
                <>
                    {!isLoading && startIcon && (
                        <span className={`${children ? 'mr-2' : ''} flex items-center`}>
                            {startIcon}
                        </span>
                    )}

                    {children}

                    {!isLoading && endIcon && (
                        <span className={`${children ? 'ml-2' : ''} flex items-center`}>
                            {endIcon}
                        </span>
                    )}
                </>
            )}

        </button>
    )
};

export default Button;