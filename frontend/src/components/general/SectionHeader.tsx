import React from "react";
import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    linkText?: string;
    linkHref?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
                                                         title,
                                                         subtitle,
                                                         linkText,
                                                         linkHref
                                                     }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-gray-500 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            {linkText && linkHref && (
                <Link
                    to={linkHref}
                    className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors group"
                >
                    {linkText}
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
};

export default SectionHeader;