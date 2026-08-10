import React from 'react';
import { FiClock, FiCreditCard, FiPackage } from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';

interface OrderSummaryCardProps {
  totalPrice: number;
  shippingCost: number;
  status: string;
  onPayment: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  totalPrice,
  shippingCost,
  status,
  onPayment,
}) => {
  const subTotal = totalPrice - shippingCost;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
      {/* Header */}
      <h2 className="text-base font-black text-gray-900 mb-5">
        Ringkasan
      </h2>

      {/* Price Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-gray-500">
          <span>Subtotal Produk</span>
          <span className="text-gray-900">
            {formatPrice(subTotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs font-bold text-gray-500">
          <span>Ongkos Kirim</span>
          <span className="text-gray-900">
            {formatPrice(shippingCost)}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
            Total Bayar
          </span>
          <span className="text-xl font-black text-cyan-600">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Pending Payment */}
      {status === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2.5 text-[11px] text-amber-700">
            <FiClock className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-bold leading-relaxed">
              Status masih pending. Segera selesaikan pembayaran agar pesanan kamu segera diproses.
            </p>
          </div>

          <button
            onClick={onPayment}
            className="w-full h-12 bg-cyan-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-cyan-100 hover:bg-cyan-600 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <FiCreditCard className="w-4 h-4" />
            Bayar Sekarang
          </button>
        </div>
      )}

      {/* Paid / Shipped / Delivered */}
      {(status === 'paid' ||
        status === 'shipped' ||
        status === 'delivered') && (
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-[11px] text-emerald-700 font-bold">
            <div className="p-1 bg-emerald-100 rounded text-emerald-600 mt-0.5 shrink-0">
              <FiPackage className="w-3 h-3" />
            </div>
            <p className="leading-relaxed">
              Pembayaran terverifikasi. Pesanan kamu sedang diproses atau sudah dikirim.
            </p>
          </div>
        )}
    </div>
  );
};

export default OrderSummaryCard;