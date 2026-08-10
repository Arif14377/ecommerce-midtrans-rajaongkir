import React from 'react';
import { FiPackage } from 'react-icons/fi';
import { getImageUrl } from '../../../utils/imageUrl';
import { formatPrice } from '../../../utils/formatPrice';
import type { OrderItemResponse } from '../../../types/order';

export interface OrderItemListProps {
  items: OrderItemResponse[];
  status: string;
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
          <FiPackage className="w-4 h-4" />
        </div>
        <h2 className="text-base font-black text-gray-900">
          Daftar Produk
        </h2>
      </div>

      {/* Items */}
      <div className="p-5 space-y-4">
        {items?.map((item) => {
          const productName = item.product?.name;
          const productImage =
            item.product?.images?.[0]?.image_url || '';

          return (
            <div
              key={item.id}
              className="flex gap-4 group"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={getImageUrl(productImage)}
                  alt={productName || 'Product Image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target =
                      e.target as HTMLImageElement;
                    target.src =
                      '/placeholder-image.svg';
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-gray-900 line-clamp-1 mb-1">
                    {productName}
                  </h4>
                  <p className="text-gray-400 font-bold text-xs tracking-tight">
                    {item.quantity} x{' '}
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-6 border-t md:border-t-0 border-gray-50 pt-3 md:pt-0 mt-2 md:mt-0">
                  <span className="font-black text-cyan-600 text-base whitespace-nowrap">
                    {formatPrice(item.sub_total)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItemList;