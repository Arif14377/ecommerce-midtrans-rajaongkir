import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

interface QuantitySelectorProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    isLoading?: boolean;
    className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
                                                               value,
                                                               min = 1,
                                                               max = 99,
                                                               onChange,
                                                               isLoading = false,
                                                               className = ""
                                                           }) => {
    const decrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const increase = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    return (
        <div
            className={`inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
        >
            <button
                onClick={decrease}
                disabled={value <= min || isLoading}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Kurangi jumlah"
            >
                <FiMinus className="w-4 h-4 text-gray-600" />
            </button>

            <span className="px-3 py-2 text-center font-bold text-gray-800 min-w-[45px] bg-gray-50/50">
        {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
        ) : (
            value
        )}
      </span>

            <button
                onClick={increase}
                disabled={value >= max}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Tambah jumlah"
            >
                <FiPlus className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    );
};

export default QuantitySelector;
