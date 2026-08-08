import { FiAlertCircle } from "react-icons/fi";

interface ErrorProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = ({
    title = 'Gagal memuat data',
    message = 'Terjadi kesalahan saat memuat data. Silahkan coba lagi.',
    onRetry
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiAlertCircle className="text-red-500" size={24}/>
            </div>

            <p className="text-red-600 font-medium mb-1">
                { title }
            </p>

            <p className="text-gray-500 text-sm text-center max-w-md mb-4">
                {message}
            </p>

            {onRetry && (
                <button
                onClick={onRetry}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                Coba Lagi
                </button>
            )}
        </div>
    )
}

export default Error;