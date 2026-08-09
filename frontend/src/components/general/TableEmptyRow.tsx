import { FiInbox } from "react-icons/fi";

interface TableEmptyRowProps {
    colSpan: number;
    text?: string;
    subText?: string;
}

export default function TableEmptyRow({
                                          colSpan,
                                          text = "Data tidak ditemukan",
                                          subText
                                      }: TableEmptyRowProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <FiInbox className="text-gray-400" size={24} />
                    </div>

                    <p className="text-gray-600 font-medium text-sm">
                        {text}
                    </p>

                    {subText && (
                        <p className="text-gray-400 text-xs mt-1">
                            {subText}
                        </p>
                    )}
                </div>
            </td>
        </tr>
    );
}
