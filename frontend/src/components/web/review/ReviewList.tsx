import React, { useMemo } from 'react';
import Loading from '../../general/Loading';
import { useGetReviews } from '../../../hooks/web/review/useGetReviews';
import { FiStar } from 'react-icons/fi';

interface ReviewListProps {
  productId: number;
  productName: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const { data: response, isLoading } = useGetReviews(productId);
  const reviews = response?.data || [];

  // Hitung statistik rating
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    let sum = 0;

    reviews.forEach((review) => {
      sum += review.rating;
      if (review.rating >= 1 && review.rating <= 5) {
        counts[Math.floor(review.rating)] += 1;
      }
    });

    return {
      average: Number((sum / reviews.length).toFixed(1)),
      counts
    };
  }, [reviews]);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-5xl font-bold text-gray-900">
                {stats.average}
              </span>
              <div className="text-sm text-gray-500">/ 5.0</div>
            </div>

            <div className="flex justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats.average)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-500 text-sm font-medium">
              Berdasarkan {reviews.length} ulasan
            </p>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <FiStar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">
                    {star}
                  </span>
                </div>

                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${
                        reviews.length
                          ? (stats.counts[star] / reviews.length) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>

                <span className="text-xs text-gray-400 w-8 text-right font-medium">
                  {stats.counts[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            📝
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Belum ada ulasan
          </h3>
          <p className="text-gray-500">
            Jadilah yang pertama menulis ulasan untuk produk ini!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border md:border-t-0 border-gray-100 md:border-transparent md:border-b py-6 first:pt-0 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center text-cyan-700 font-bold text-lg shrink-0 border border-cyan-50">
                  {review.user?.name?.charAt(0) || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 truncate">
                      {review.user?.name || 'Anonymous'}
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;