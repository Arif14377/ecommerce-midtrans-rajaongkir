// Import React
import { type FC } from 'react';

// Import Router
import { useSearchParams } from 'react-router';

// Icons
import {
  FiSearch
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Loading from '../../../components/general/Loading';
import Pagination from '../../../components/general/Pagination';
import TableEmptyRow from '../../../components/general/TableEmptyRow';
import Error from '../../../components/general/Error';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useCustomers } from '../../../hooks/admin/customer/useCustomers';

const CustomersIndex: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  const { data, isLoading, isError, refetch } = useCustomers(page, search);

  const setPage = (newPage: number) => {
    setSearchParams({ search, page: String(newPage) });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value, page: '1' });
  };

  return (
    <AdminLayout>
      <title>Customers - TokoKita Admin</title>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Customers</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola data pelanggan</p>
          </div>
        </div>

        <div className="max-w-sm">
          <Input
            startIcon={<FiSearch className="w-4 h-4" />}
            placeholder="Cari customer..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {isLoading && <Loading />}
        {isError && (
          <Error
            title="Gagal memuat data"
            message="Terjadi kesalahan saat memuat data customers."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">No. HP</th>
                    <th className="px-6 py-3">Alamat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data?.data && data.data.data.length > 0 ? (
                    data.data.data.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                        <td className="px-6 py-4 text-gray-500">{customer.phone || '-'}</td>
                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs" title={customer.address}>{customer.address || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <TableEmptyRow
                      colSpan={4}
                      text="Customer tidak ditemukan"
                      subText={
                        search
                          ? 'Coba kata kunci lain'
                          : 'Belum ada data customer'
                      }
                    />
                  )}
                </tbody>
              </table>
            </div>

            {data?.data && data.data.data.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <Pagination
                  currentPage={data.data.current_page}
                  totalPages={data.data.last_page}
                  onPageChange={setPage}
                  position="right"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomersIndex;