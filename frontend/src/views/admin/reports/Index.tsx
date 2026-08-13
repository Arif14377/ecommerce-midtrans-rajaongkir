// React
import React, { useEffect } from 'react';

// Router
import { useSearchParams } from 'react-router';

// Icons
import {
  FiShoppingCart,
  FiSearch
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useSalesReport } from '../../../hooks/admin/report/useSalesReport';

// Utils
import { formatPrice } from '../../../utils/formatPrice';

const ReportsIndex: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const startDate = searchParams.get('start_date') || firstDay.toISOString().split('T')[0];
  const endDate = searchParams.get('end_date') || today.toISOString().split('T')[0];

  const { data, isLoading, isError, refetch } = useSalesReport(startDate, endDate);

  const handleFilter: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStartDate = formData.get('start_date') as string;
    const newEndDate = formData.get('end_date') as string;

    setSearchParams({ start_date: newStartDate, end_date: newEndDate });
  };

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  return (
    <AdminLayout>
      <title>Laporan - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Laporan Penjualan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ringkasan pendapatan toko</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-auto">
              <Input
                label="Tanggal Mulai"
                type="date"
                name="start_date"
                defaultValue={startDate}
                className="w-full"
                inputClassName="cursor-pointer"
              />
            </div>
            <div className="w-full sm:w-auto">
              <Input
                label="Tanggal Akhir"
                type="date"
                name="end_date"
                defaultValue={endDate}
                className="w-full"
                inputClassName="cursor-pointer"
              />
            </div>
            <Button
              type="submit"
              startIcon={<FiSearch className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Filter
            </Button>
          </form>
        </div>

        {isLoading && <Loading />}
        {isError && (
          <Error
            title="Gagal memuat data"
            message="Terjadi kesalahan saat memuat data laporan."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <span className="font-bold">Rp</span>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Total Pendapatan</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatPrice(data?.data?.total_revenue || 0)}</h3>
                <p className="text-xs text-gray-500 mt-1">Periode {startDate} s/d {endDate}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FiShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Penjualan</p>
                <h3 className="text-2xl font-bold text-gray-800">{data?.data?.total_orders || 0}</h3>
                <p className="text-xs text-gray-500 mt-1">Order Status Paid</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsIndex;