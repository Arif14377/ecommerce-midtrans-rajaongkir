import React from 'react';
import { Link } from 'react-router';
import { FiArrowLeft } from 'react-icons/fi';

interface OrderDetailHeaderProps {
  orderId: string;
  createdAt: string;
  status: string;
}

const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({
  orderId,
  createdAt,
  status,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <span className="font-mono text-[9px] bg-gray-100 px-2 py-0.5 rounded-md text-gray-500 font-bold uppercase tracking-wider">
              #{orderId}
            </span>
            <span className="text-[11px] text-gray-400 font-bold">
              {new Date(createdAt).toLocaleDateString(
                'id-ID',
                {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </span>
          </div>
          <h1 className="text-xl font-black text-gray-900">
            Detail Pesanan
          </h1>
        </div>
      </div>

      {/* Status */}
      <div
        className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] w-fit ${
          status === 'pending'
            ? 'bg-amber-100 text-amber-600'
            : status === 'paid' ||
              status === 'shipped' ||
              status === 'delivered'
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {status}
      </div>
    </div>
  );
};

export default OrderDetailHeader;