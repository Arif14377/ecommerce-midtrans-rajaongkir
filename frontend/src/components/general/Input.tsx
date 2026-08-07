import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
    className?: string;
    inputClassName?: string;
    startIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
        label,
        error,
        className,
        inputClassName,
        startIcon,
        type = 'text',
        id,
        ...props
    }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {startIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {startIcon}
                    </div>
                )}

                <input
                    id={id}
                    type={inputType}
                    className={`w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1
                    focus:border-transparent transition-all
                    ${error ? 'border-red-500 focus:ring-red-500' : ''}
                    ${isPassword ? 'pr-10' : ''}
                    ${startIcon ? 'pl-10' : ''}
                    ${inputClassName}`}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        {showPassword
                            ? <FiEyeOff className="w-4 h-4" />
                            : <FiEye className="w-4 h-4" />
                        }
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}

export default Input;