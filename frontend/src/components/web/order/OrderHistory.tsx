import React from 'react';
import { Link } from 'react-router';
import { FiShoppingBag } from 'react-icons/fi';
import OrderItem from './OrderItem';
import Button from '../../general/Button';
import type { OrderResponse } from '../../../types/order';

interface OrderHistoryProps {
  orders: OrderResponse[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <h2 className="text-xl font-extrabold text-gray-900 mb-10 flex items-center gap-4">
        <div className="p-2.5 bg-cyan-100 rounded-xl text-cyan-600">
          <FiShoppingBag className="w-5 h-5" />
        </div>
        Riwayat Pesanan
      </h2>

      {/* Content */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
            <FiShoppingBag className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-extrabold text-gray-800 mb-2">
            Belum ada pesanan
          </h3>

          <p className="text-gray-500 mb-10 max-w-xs mx-auto font-bold leading-relaxed">
            Sepertinya kamu belum pernah belanja. Yuk
            mulai jelajahi produk kami!
          </p>

          <Link to="/products">
            <Button className="px-10 h-12 shadow-lg shadow-cyan-100">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;