import React from 'react';
import { Link } from 'react-router';
import { FiPlus, FiChevronRight, FiCheckCircle, FiPhone } from 'react-icons/fi';
import type { AddressResponse } from '../../../types/address';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: AddressResponse[];
  onSelect: (address: AddressResponse) => void;
  selectedId?: number | null;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  onSelect,
  selectedId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-xl relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-gray-900">
            Pilih Alamat Pengiriman
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <FiPlus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        {/* Address List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {addresses.map((address) => {
            const isActive = selectedId === address.id;

            return (
              <button
                key={address.id}
                onClick={() => onSelect(address)}
                className={`w-full text-left border-2 rounded-2xl p-5 transition-all group relative ${
                  isActive
                    ? 'border-cyan-500 bg-cyan-50/30'
                    : 'border-gray-50 bg-white hover:border-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-lg">
                      {address.recipient_name}
                    </span>
                    {address.is_primary && (
                      <span className="text-[10px] bg-cyan-500 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Utama
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <FiCheckCircle className="w-6 h-6 text-cyan-500 animate-in zoom-in duration-300" />
                  )}
                </div>

                <p className="text-sm text-gray-500 font-bold mb-2 flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-cyan-500" />
                  {address.phone}
                </p>

                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {address.address_line1}, {address.district},{' '}
                  {address.city}, {address.province},{' '}
                  {address.postal_code}
                </p>

                {!isActive && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                    <FiChevronRight className="w-8 h-8" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Add New Address */}
          <Link
            to="/dashboard/addresses"
            className="flex items-center justify-center gap-2 w-full p-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:text-cyan-600 hover:border-cyan-500 hover:bg-cyan-50/10 transition-all font-bold group"
          >
            <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
            Tambah Alamat Baru
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium tracking-tight">
            PASTIKAN ALAMAT PENGIRIMAN SUDAH SESUAI
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;