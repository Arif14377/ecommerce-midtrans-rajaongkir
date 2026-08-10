import React from 'react';
import { Link } from 'react-router';
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiPlus,
  FiChevronRight,
} from 'react-icons/fi';
import Input from '../../general/Input';
import Button from '../../general/Button';
import type { AddressResponse } from '../../../types/address';

interface ShippingAddressProps {
  addresses: AddressResponse[];
  formData: {
    name: string;
    phone: string;
    address: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
  onOpenModal: () => void;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({
  addresses,
  formData,
  onInputChange,
  onOpenModal,
}) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
            <FiMapPin className="w-5 h-5" />
          </div>
          Alamat Pengiriman
        </h2>

        {addresses.length > 0 && (
          <button
            type="button"
            onClick={onOpenModal}
            className="text-cyan-600 text-sm font-bold flex items-center gap-1 hover:text-cyan-700 transition-colors group bg-cyan-50 px-4 py-2 rounded-full"
          >
            Pilih Alamat Lain
            <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {addresses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
              <FiMapPin className="w-10 h-10" />
            </div>

            <h3 className="text-gray-900 font-extrabold text-lg mb-2">
              Belum ada alamat
            </h3>

            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto font-medium">
              Silakan tambah alamat pengiriman di dashboard
              untuk mempermudah checkout.
            </p>

            <Link to="/dashboard/addresses">
              <Button
                startIcon={<FiPlus />}
                className="shadow-lg shadow-cyan-100"
              >
                Tambah Alamat
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Recipient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Penerima"
                startIcon={
                  <FiUser className="text-gray-400" />
                }
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Nama Lengkap"
                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
                required
              />

              <Input
                label="Nomor Telepon"
                startIcon={
                  <FiPhone className="text-gray-400" />
                }
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                placeholder="08xxxxxxxx"
                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Alamat Lengkap
              </label>
              <div className="relative text-gray-400 group">
                <div className="absolute top-4 left-4 group-focus-within:text-cyan-500 transition-colors">
                  <FiMapPin />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={onInputChange}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-gray-800 font-medium placeholder:text-gray-300"
                  placeholder="Jl. Contoh No. 123, Kecamatan, Kota"
                  required
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShippingAddress;