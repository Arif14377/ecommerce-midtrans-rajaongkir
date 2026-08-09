import type React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import Button from './Button';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: React.ReactNode;
    isDeleting?: boolean;
    confirmText?: string;
    cancelText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               title = "Konfirmasi Hapus",
                                               message,
                                               isDeleting = false,
                                               confirmText = "Hapus",
                                               cancelText = "Batal",
                                           }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={() => !isDeleting && onClose()}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 transform transition-all">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => !isDeleting && onClose()}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border-none hover:bg-transparent"
                    disabled={isDeleting}
                >
                    <FiX className="w-5 h-5" />
                </Button>

                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertTriangle className="w-6 h-6 text-red-500" />
                </div>

                <h3 className="text-base font-semibold text-gray-800 text-center mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 text-center mb-6">
                    {message}
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isDeleting}
                        loadingText={`${confirmText}...`}
                        className="flex-1"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;