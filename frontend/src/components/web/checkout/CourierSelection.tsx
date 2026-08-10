import React from 'react';
import { FiTruck } from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';
import type { ShippingCostResponse } from '../../../types/address';

interface CourierSelectionProps {
  districtId: string;
  selectedCourier: string;
  onCourierChange: (courier: string) => void;
  shippingOptions: ShippingCostResponse[];
  selectedService: ShippingCostResponse | null;
  onServiceSelect: (service: ShippingCostResponse) => void;
  isLoadingOptions: boolean;
}

const CourierSelection: React.FC<CourierSelectionProps> = ({
  districtId,
  selectedCourier,
  onCourierChange,
  shippingOptions,
  selectedService,
  onServiceSelect,
  isLoadingOptions,
}) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <h2 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <FiTruck className="w-5 h-5" />
        </div>
        Pilih Jasa Pengiriman
      </h2>

      {/* Courier Options */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {['jne', 'pos', 'tiki'].map((courier) => (
          <button
            key={courier}
            type="button"
            onClick={() => onCourierChange(courier)}
            disabled={!districtId}
            className={`py-4 border-2 rounded-xl font-black uppercase tracking-widest transition-all ${
              selectedCourier === courier
                ? 'border-cyan-500 bg-cyan-50 text-cyan-600 shadow-md shadow-cyan-100 scale-[1.02]'
                : 'border-gray-50 text-gray-400 hover:border-gray-200 bg-gray-50/30'
            } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95`}
          >
            {courier}
          </button>
        ))}
      </div>

      {/* Warning */}
      {!districtId && (
        <div className="p-4 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl mb-4 border border-amber-100 flex items-center gap-2">
          <span>⚠️</span>
          Silakan lengkapi atau pilih alamat terlebih dahulu untuk menghitung ongkir.
        </div>
      )}

      {/* Shipping Services */}
      {selectedCourier && districtId && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">
            Layanan Tersedia
          </h3>

          {isLoadingOptions ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm font-bold">
                Mengecek ongkir...
              </p>
            </div>
          ) : shippingOptions &&
            Array.isArray(shippingOptions) &&
            shippingOptions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {shippingOptions.map((option) => (
                <button
                  key={option?.service || Math.random()}
                  type="button"
                  onClick={() => onServiceSelect(option)}
                  className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all group ${
                    selectedService?.service === option?.service
                      ? 'border-cyan-500 bg-cyan-50/30 shadow-sm'
                      : 'border-gray-50 bg-gray-50/20 hover:border-cyan-200'
                  }`}
                >
                  <div className="text-left">
                    <p
                      className={`font-extrabold ${
                        selectedService?.service === option?.service
                          ? 'text-cyan-700'
                          : 'text-gray-800'
                      }`}
                    >
                      {option.service}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {option.description} •{' '}
                      <span className="text-cyan-600/70">
                        Estimasi {option?.etd || '-'} Hari
                      </span>
                    </p>
                  </div>
                  <p
                    className={`font-black text-lg ${
                      selectedService?.service === option?.service
                        ? 'text-cyan-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {formatPrice(option?.cost || 0)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-500 text-sm font-bold">
                Tidak ada layanan tersedia untuk rute ini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourierSelection;