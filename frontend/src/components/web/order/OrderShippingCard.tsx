import React from 'react';
import { FiTruck, FiMapPin } from 'react-icons/fi';

interface OrderShippingCardProps {
  name: string;
  phone: string;
  address: string;
}

const OrderShippingCard: React.FC<OrderShippingCardProps> = ({
  name,
  phone,
  address,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
          <FiTruck className="w-4 h-4" />
        </div>
        <h2 className="text-base font-black text-gray-900">
          Informasi Pengiriman
        </h2>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Penerima
            </p>
            <p className="text-sm font-extrabold text-gray-900">
              {name}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              No. Telepon
            </p>
            <p className="text-sm font-extrabold text-gray-900">
              {phone}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex gap-3 text-sm bg-gray-50/50 p-3.5 rounded-xl">
          <div className="mt-1">
            <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Alamat Lengkap
            </p>
            <p className="font-bold text-gray-700 leading-relaxed italic text-xs">
              {address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderShippingCard;