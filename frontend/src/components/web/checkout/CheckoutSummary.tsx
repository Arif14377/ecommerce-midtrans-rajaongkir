import React from 'react';
import Button from '../../general/Button';
import { formatPrice } from '../../../utils/formatPrice';

interface CheckoutSummaryProps {
  subtotal: number;
  shippingCost: number;
  isProcessing: boolean;
  onPayment: React.SubmitEventHandler<HTMLFormElement>;
  isServiceSelected: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  subtotal,
  shippingCost,
  isProcessing,
  onPayment,
  isServiceSelected,
}) => {
  const totalPayment = subtotal + shippingCost;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 sticky top-24">
      {/* Header */}
      <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-b border-gray-50 pb-4">
        Ringkasan Pesanan
      </h2>

      {/* Summary */}
      <div className="space-y-4 mb-10">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-500">Subtotal Produk</span>
          <span className="font-extrabold text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-500">Biaya Pengiriman</span>
          <span
            className={`${
              shippingCost > 0
                ? 'font-extrabold text-gray-900'
                : 'text-gray-300 font-bold'
            }`}
          >
            {shippingCost > 0
              ? formatPrice(shippingCost)
              : 'Belum dipilih'}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex justify-between items-center bg-cyan-50/30 p-4 rounded-2xl border border-cyan-50">
            <span className="text-base font-bold text-gray-900">
              Total Bayar
            </span>
            <span className="text-2xl font-black text-cyan-600">
              {formatPrice(totalPayment)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <form onSubmit={onPayment}>
        <Button
          type="submit"
          disabled={isProcessing || !isServiceSelected}
          isLoading={isProcessing}
          loadingText="Memproses..."
          className={`w-full h-14 text-lg font-black rounded-xl shadow-lg transition-all active:scale-95 ${
            isServiceSelected
              ? 'shadow-cyan-100'
              : 'opacity-50 grayscale'
          }`}
        >
          Bayar Sekarang
        </Button>
      </form>
    </div>
  );
};

export default CheckoutSummary;