import React, { useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import { useCreateReview } from '../../../hooks/web/review/useCreateReview';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productId: number;
  productName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName,
}) => {
  const { mutate: createReview, isPending } = useCreateReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createReview(
      { product_id: productId, rating, comment },
      {
        onSuccess: () => {
          setComment('');
          setRating(5);
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">
            Tulis Ulasan
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">
              Produk
            </p>
            <p className="font-medium text-gray-800 line-clamp-1">
              {productName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berikan Rating
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${
                      rating >= star
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <FiStar
                      className={`w-8 h-8 ${
                        rating >= star ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-1">
                {rating === 5
                  ? 'Sangat Puas! 😍'
                  : rating === 4
                  ? 'Puas 😊'
                  : rating === 3
                  ? 'Cukup 🙂'
                  : rating === 2
                  ? 'Kurang 😕'
                  : 'Kecewa 😞'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ulasan Anda
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda menggunakan produk ini..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none transition-all"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-2.5 bg-linear-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-70"
              >
                {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;