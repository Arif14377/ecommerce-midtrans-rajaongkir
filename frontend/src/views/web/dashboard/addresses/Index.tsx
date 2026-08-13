import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import Input from '../../../../components/general/Input';
import Button from '../../../../components/general/Button';
import CustomerLayout from '../../../../layouts/Customer';
import Loading from '../../../../components/general/Loading';
import { useGetAddresses } from '../../../../hooks/web/address/useGetAddresses';
import { useCreateAddress } from '../../../../hooks/web/address/useCreateAddress';
import { useUpdateAddress } from '../../../../hooks/web/address/useUpdateAddress';
import { useDeleteAddress } from '../../../../hooks/web/address/useDeleteAddress';
import { useGetProvinces } from '../../../../hooks/web/rajaongkir/useGetProvinces';
import { useGetCities } from '../../../../hooks/web/rajaongkir/useGetCities';
import { useGetDistricts } from '../../../../hooks/web/rajaongkir/useGetDistricts';
import toast from 'react-hot-toast';
import type { Province, City, District, AddressResponse } from '../../../../types';
import type { ApiError } from '../../../../types';

const Addresses: React.FC = () => {
  const { data: response, isLoading } = useGetAddresses();
  const addresses = response?.data || [];

  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  // RajaOngkir Hooks
  const { data: provincesResponse } = useGetProvinces();
  const { data: citiesResponse, isLoading: isLoadingCities } = useGetCities(parseInt(provinceId) || 0);
  const { data: districtsResponse, isLoading: isLoadingDistricts } = useGetDistricts(parseInt(cityId) || 0);

  const provinces = provincesResponse?.data || [];
  const cities = citiesResponse?.data || [];
  const districts = districtsResponse?.data || [];

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openModal = (address: AddressResponse | null = null) => {
    setErrors({}); // Clear errors
    if (address) {
      setEditingAddress(address);
      setRecipientName(address.recipient_name || '');
      setPhone(address.phone || '');
      setProvinceId(address.province_id?.toString() || '');
      setCityId(address.city_id?.toString() || '');
      setDistrictId(address.district_id?.toString() || '');
      setAddressLine1(address.address_line1 || '');
      setPostalCode(address.postal_code || '');
      setIsPrimary(address.is_primary || false);
    } else {
      setEditingAddress(null);
      setRecipientName('');
      setPhone('');
      setProvinceId('');
      setCityId('');
      setDistrictId('');
      setAddressLine1('');
      setPostalCode('');
      setIsPrimary(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      recipient_name: recipientName,
      phone,
      province: provinces.find((p: Province) => p.id.toString() === provinceId)?.name || '',
      province_id: provinceId,
      city: cities.find((c: City) => c.id.toString() === cityId)?.name || '',
      city_id: cityId,
      district: districts.find((d: District) => d.id.toString() === districtId)?.name || '',
      district_id: districtId,
      address_line1: addressLine1,
      postal_code: postalCode,
      is_primary: isPrimary
    };

    try {
      if (editingAddress) {
        const responseData = await updateAddressMutation.mutateAsync({ id: editingAddress.id, data });
        toast.success(responseData.message);
      } else {
        const responseData = await createAddressMutation.mutateAsync(data);
        toast.success(responseData.message);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as ApiError;
      if (error.response?.data?.errors) {
        const errorMap: Record<string, string> = {};
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          errorMap[key] = Array.isArray(value) ? value[0] : value;
        }
        setErrors(errorMap);
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan alamat');
      }
    }
  };

  /* Delete Modal State */
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null
  });

  const handleDelete = (id: number) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      const responseData = await deleteAddressMutation.mutateAsync(deleteModal.id);
      toast.success(responseData.message);
      setDeleteModal({ open: false, id: null });
    } catch (_err: unknown) {
      toast.error('Gagal menghapus alamat');
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvinceId(e.target.value);
    setCityId('');
    setDistrictId('');
    setPostalCode('');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCityId(e.target.value);
    setDistrictId('');
    setPostalCode('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictId(e.target.value);
  };

  if (isLoading) return <CustomerLayout><Loading /></CustomerLayout>;

  return (
    <CustomerLayout>
      <title>Alamat Saya - TokoKita</title>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-4">
            <div className="p-2.5 bg-cyan-100 rounded-xl text-cyan-600">
              <FiMapPin className="w-5 h-5" />
            </div>
            Alamat Saya
          </h2>
          <Button
            onClick={() => openModal()}
            className="rounded-xl shadow-lg shadow-cyan-100"
          >
            <FiPlus className="mr-2" /> Tambah Alamat
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length === 0 ? (
            <div className="md:col-span-2 text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                <FiMapPin className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-800">Belum ada alamat</h3>
              <p className="text-gray-500 font-bold">Tambahkan alamat pengiriman untuk mempermudah checkout.</p>
            </div>
          ) : (
            addresses.map((address: AddressResponse) => (
              <div key={address.id} className={`border-2 rounded-3xl p-6 transition-all relative group ${address.is_primary ? 'border-cyan-500 bg-cyan-50/30' : 'border-gray-50 bg-white hover:border-cyan-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-gray-900 text-lg">{address.recipient_name}</span>
                    {address.is_primary && (
                      <span className="text-[10px] bg-cyan-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-wider">Utama</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(address)}
                      className="p-2 bg-white text-cyan-600 rounded-xl shadow-sm border border-gray-100 hover:bg-cyan-50 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 bg-white text-red-600 rounded-xl shadow-sm border border-gray-100 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-bold mb-3 flex items-center gap-1">📞 {address.phone}</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {address.address_line1}, {address.district}, {address.city}, {address.province}, {address.postal_code}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah/Edit Alamat */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-4xl w-full max-w-xl relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-xl font-black text-gray-900">
                {editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors shadow-sm"
              >
                <FiPlus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nama Penerima"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nama Lengkap"
                  error={errors.recipient_name}
                  className="rounded-xl"
                />
                <Input
                  label="No. Telepon"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  error={errors.phone}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Provinsi</label>
                  <select
                    value={provinceId}
                    onChange={handleProvinceChange}
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all font-bold text-gray-800 ${errors.province_id ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((p: Province) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.province_id && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.province_id}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Kota / Kabupaten</label>
                  <select
                    value={cityId}
                    disabled={!provinceId || isLoadingCities}
                    onChange={handleCityChange}
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all font-bold text-gray-800 disabled:bg-gray-100/50 ${errors.city_id ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                  >
                    <option value="">{isLoadingCities ? 'Memuat...' : 'Pilih Kota'}</option>
                    {cities.map((c: City) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.city_id && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.city_id}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Kecamatan</label>
                  <select
                    value={districtId}
                    disabled={!cityId || isLoadingDistricts}
                    onChange={handleDistrictChange}
                    className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all font-bold text-gray-800 disabled:bg-gray-100/50 ${errors.district_id ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                  >
                    <option value="">{isLoadingDistricts ? 'Memuat...' : 'Pilih Kecamatan'}</option>
                    {districts.map((d: District) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.district_id && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.district_id}</span>}
                </div>
                <Input
                  label="Kode Pos"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Masukkan Kode Pos"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all font-bold text-gray-800 resize-none ${errors.address_line1 ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                  placeholder="Nama jalan, nomor rumah, RT/RW, dsb"
                />
                {errors.address_line1 && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.address_line1}</span>}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-5 h-5 text-cyan-500 border-gray-200 rounded-lg focus:ring-cyan-500/20 transition-all"
                  />
                  <label htmlFor="is_primary" className="ml-3 text-sm text-gray-900 font-black cursor-pointer">
                    Jadikan Alamat Utama
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl h-12"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  isLoading={createAddressMutation.isPending || updateAddressMutation.isPending}
                  loadingText="Menyimpan..."
                  className="flex-1 rounded-xl h-12 shadow-lg shadow-cyan-100"
                >
                  Simpan Alamat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Alamat */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleteAddressMutation.isPending && setDeleteModal({ open: false, id: null })} />
          <div className="relative bg-white rounded-4xl shadow-2xl max-w-sm w-full mx-4 p-8 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Hapus Alamat</h3>
            <p className="text-sm text-gray-500 text-center mb-8 font-bold leading-relaxed">
              Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setDeleteModal({ open: false, id: null })}
                disabled={deleteAddressMutation.isPending}
                className="flex-1 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={deleteAddressMutation.isPending}
                loadingText="Hapus..."
                className="flex-1 rounded-xl h-12 shadow-lg shadow-red-100"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

export default Addresses;