// React
import React, { useState } from 'react';

// Router
import { Link, useSearchParams } from 'react-router';

// React Query
import { useQueryClient } from '@tanstack/react-query';

// Icons
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';
import TableEmptyRow from '../../../components/general/TableEmptyRow';
import Pagination from '../../../components/general/Pagination';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';
import DeleteModal from '../../../components/general/DeleteModal';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useProducts } from '../../../hooks/admin/product/useProducts';
import { useProductDelete } from '../../../hooks/admin/product/useProductDelete';
import { usePermission } from '../../../hooks/usePermission';

// Utils
import { formatPrice } from '../../../utils/formatPrice';
import { getImageUrl } from '../../../utils/imageUrl';

// Types
import type { ProductResponse } from '../../../types/product';

// Toast
import toast from 'react-hot-toast';


const Products: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasAnyPermission } = usePermission();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    product: ProductResponse | null;
  }>({
    open: false,
    product: null,
  });

  const { data, isLoading, isError, refetch } = useProducts({ page, search });
  const { mutate: deleteProduct, isPending: isDeleting } = useProductDelete();

  const setPage = (newPage: number) => {
    setSearchParams({ search, page: String(newPage) });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value, page: '1' });
  };

  const handleDelete = () => {
    if (!deleteModal.product) return;

    deleteProduct(deleteModal.product.id, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setDeleteModal({ open: false, product: null });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error: unknown) => {
        const err = error as { response: { data: { message: string } } };
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Products - TokoKita Admin</title>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Kelola data produk
            </p>
          </div>

          {hasAnyPermission(['products-create']) && (
            <Link to="/admin/products/create">
              <Button startIcon={<FiPlus className="w-4 h-4" />}>
                Tambah Produk
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-sm">
          <Input
            startIcon={<FiSearch className="w-4 h-4" />}
            placeholder="Cari produk..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {isLoading && <Loading />}
        {isError && <Error onRetry={refetch} />}

        {!isLoading && !isError && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Produk</th>
                    <th className="px-5 py-3 text-left font-medium">Kategori</th>
                    <th className="px-5 py-3 text-left font-medium">Harga</th>
                    <th className="px-5 py-3 text-left font-medium">Stok</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {data?.data?.length ? (
                    data.data.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                              {product.images?.length ? (
                                <img
                                  src={getImageUrl(product.images[0].image_url)}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FiImage className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <span className="font-medium text-gray-800 line-clamp-1 max-w-xs">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {product.category?.name || '-'}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-medium">
                          {formatPrice(product.price)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${product.stock > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {hasAnyPermission(['products-edit']) && (
                              <Link to={`/admin/products/edit/${product.id}`}>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="text-blue-500 hover:bg-blue-50 border-blue-100"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                            )}

                            {hasAnyPermission(['products-delete']) && (
                              <Button
                                variant="danger-light"
                                size="sm"
                                onClick={() =>
                                  setDeleteModal({ open: true, product })
                                }
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <TableEmptyRow
                      colSpan={5}
                      text="Produk tidak ditemukan"
                      subText={
                        search
                          ? 'Coba kata kunci lain'
                          : 'Tambahkan produk baru'
                      }
                    />
                  )}
                </tbody>
              </table>
            </div>

            {data && data.data && data.data.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <Pagination
                  currentPage={data.current_page}
                  totalPages={data.last_page}
                  onPageChange={setPage}
                  position="right"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        onConfirm={handleDelete}
        title="Hapus Produk"
        message={
          <>
            Apakah Anda yakin ingin menghapus produk{' '}
            <span className="font-medium text-gray-700">
              "{deleteModal.product?.name}"
            </span>
            ?
          </>
        }
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
};

export default Products;
