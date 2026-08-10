import React from 'react';
import { Link } from 'react-router';
import { FiChevronRight } from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';
import type { OrderResponse } from '../../../types/order';

interface OrderItemProps {
  order: OrderResponse;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:border-cyan-200 hover:bg-cyan-50/10 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-bold uppercase tracking-wider">
            #{order.id}
          </span>
          <span className="text-xs text-gray-400 font-bold">
            {new Date(order.created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-gray-900 text-lg">{formatPrice(order.total_price || order.total || 0)}</span>
          <span className="text-sm text-gray-400 font-bold">• {order.items?.length || 0} Produk</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-600' :
          order.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
            'bg-gray-100 text-gray-600'
          }`}>
          {order.status}
        </div>
        <Link
          to={`/dashboard/orders/${order.id}`}
          className="flex items-center gap-1 text-cyan-600 font-black text-sm hover:text-cyan-700 transition-colors"
        >
          Detail <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;