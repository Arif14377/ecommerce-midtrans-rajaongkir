import type React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    position?: 'left' | 'center' | 'right';
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    position = 'center',
    maxVisiblePages = 5
}) => {
    if (totalPages <= 1) return null;

    const getPositionClass = () => {
        switch (position) {
            case 'left':
                return 'justify-start';
            case 'right':
                return 'justify-end';
            default:
                return 'justify-center';
        }
    }

    const getVisiblePages = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const half = Math.floor(maxVisiblePages / 2)
        let start = currentPage - half
        let end = currentPage + half

        if (start < 1) {
            start = 1
            end = maxVisiblePages
        } else if (end > totalPages) {
            end = totalPages
            start = totalPages - maxVisiblePages + 1
        }

        const pages = []
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    const visiblePages = getVisiblePages()

    return (
        <div className={`flex items-center gap-1 mt-6 ${getPositionClass()}`}>
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
                <FiChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {visiblePages[0] > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className='w-8 h-8 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors'>
                        1
                    </button>
                    {visiblePages[0] > 2 && (
                        <span className='px-1 text-gray-400'>...</span>
                    )}
                </>
            )}

            {visiblePages.map(page => (
                <button
                    key = {page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                        page === currentPage
                        ? 'bg-cyan-500 text-white border border-cyan-500 cursor-default'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-8 h-8 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
                <FiChevronRight className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    )
}

export default Pagination;