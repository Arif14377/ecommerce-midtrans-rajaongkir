import { FiLoader } from "react-icons/fi"

interface LoadingProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Loading: React.FC<LoadingProps> = ({
    text = 'Memuat data...',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: { icon: 16, text: "text-xs", py: "py-6" },
        md: { icon: 24, text: "text-sm", py: "py-12" },
        lg: { icon: 32, text: "text-base", py: "py-16" },
    };

    const { icon, text: textSize, py} = sizeClasses[size];

    return (
        <div className={`flex flex-col items-center justify-center ${py}`}>
            <FiLoader className="animate-spin text-cyan-500 mb-3" size={icon}/>
            <p className={`text-gray-500 ${textSize}`}>
                { text }
            </p>
        </div>
    )
}

export default Loading;