import { type FC } from 'react';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';
import AdminLayout from '../../../layouts/Admin';
import { useDashboard } from '../../../hooks/admin/dashboard/useDashboard';
import { formatPrice } from '../../../utils/formatPrice';
import {
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';

const DashboardPage: FC = () => {
  const { data: dashboard, isLoading, isError } = useDashboard();

  return (
    <AdminLayout>
      <title>Dashboard - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Ringkasan data toko Anda
          </p>
        </div>

        {isLoading && <Loading />}
        {isError && <Error />}

        {dashboard && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-linear-to-br from-orange-400 to-orange-500 rounded-lg p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">Total Pendapatan</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatPrice(dashboard.total_revenue)}
                    </p>
                  </div>

                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span>Rp</span>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-cyan-400 to-cyan-500 rounded-lg p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">Total Pesanan</p>
                    <p className="text-2xl font-bold mt-1">
                      {dashboard.total_orders}
                    </p>
                  </div>

                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiShoppingCart className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Produk</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {dashboard.total_products}
                    </p>
                  </div>

                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Pelanggan</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {dashboard.total_customers}
                    </p>
                  </div>

                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pesanan Pending</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {dashboard.pending_orders}
                    </p>
                  </div>

                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pesanan Dibayar</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {dashboard.paid_orders}
                    </p>
                  </div>

                  <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;