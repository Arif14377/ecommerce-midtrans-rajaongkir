import React from 'react';
import { Link } from 'react-router';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../../general/Button';
import { formatPrice } from '../../../utils/formatPrice';

interface CartSummaryProps {
  totalItems: number;
  subtotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  subtotal,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">
        Ringkasan Belanja
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-gray-600 text-sm font-medium">
          <span>Total Harga ({totalItems} barang)</span>
          <span className="font-bold text-gray-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">
              Total Tagihan
            </span>
            <span className="text-2xl font-extrabold text-cyan-600">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </div>

      <Link to="/checkout" className="block w-full group">
        <Button
          className="w-full h-12 flex items-center justify-center gap-2 shadow-lg shadow-cyan-100 active:scale-[0.98] transition-all"
          endIcon={
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          }
        >
          Checkout Sekarang
        </Button>
      </Link>

      <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-wider font-bold">
        Pajak & Ongkir dihitung saat checkout
      </p>
    </div>
  );
};

export default CartSummary;