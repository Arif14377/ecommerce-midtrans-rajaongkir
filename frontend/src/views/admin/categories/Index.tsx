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
  FiTag
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
import { useCategories } from '../../../hooks/admin/category/useCategories';
import { useCategoryDelete } from '../../../hooks/admin/category/useCategoryDelete';
import { usePermission } from '../../../hooks/usePermission';

// Types
import type { CategoryResponse } from '../../../types/category';

// Toast
import toast from 'react-hot-toast';

const Categories: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasAnyPermission } = usePermission();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    category: CategoryResponse | null;
  }>({
    open: false,
    category: null,
  });

  const { data, isLoading, isError, refetch } = useCategories({ page, search });
  const { mutate: deleteCategory, isPending: isDeleting } = useCategoryDelete();

  const setPage = (newPage: number) => {
    setSearchParams({ search, page: String(newPage) });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value, page: '1' });
  };

  const handleDelete = () => {
    if (!deleteModal.category) return;

    deleteCategory(deleteModal.category.id, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setDeleteModal({ open: false, category: null });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      },
      onError: (error: unknown) => {
        const err = error as { response: { data: { message: string } } };
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Categories - TokoKita Admin</title>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Categories</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola kategori produk</p>
          </div>

          {hasAnyPermission(['categories-create']) && (
            <Link to="/admin/categories/create">
              <Button startIcon={<FiPlus className="w-4 h-4" />}>
                Tambah Kategori
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-sm">
          <Input
            startIcon={<FiSearch className="w-4 h-4" />}
            placeholder="Cari kategori..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {isLoading && <Loading />}
        {isError && (
          <Error
            title="Gagal memuat data"
            message="Terjadi kesalahan saat memuat data categories."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Nama Kategori</th>
                    <th className="px-5 py-3 text-left font-medium">Slug</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                              <FiTag className="w-4 h-4 text-cyan-600" />
                            </div>
                            <span className="font-medium text-gray-800">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{category.slug}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {hasAnyPermission(['categories-edit']) && (
                              <Link to={`/admin/categories/edit/${category.id}`}>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                            )}

                            {hasAnyPermission(['categories-delete']) && (
                              <Button
                                variant="danger-light"
                                size="sm"
                                onClick={() => setDeleteModal({ open: true, category })}
                                className="p-2 rounded-lg"
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
                      colSpan={3}
                      text="Kategori tidak ditemukan"
                      subText={
                        search
                          ? 'Coba kata kunci lain'
                          : 'Tambahkan kategori baru'
                      }
                    />
                  )}
                </tbody>
              </table>
            </div>

            {data?.data && data.data.length > 0 && (
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
        onClose={() => setDeleteModal({ open: false, category: null })}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        message={
          <>
            Apakah Anda yakin ingin menghapus kategori{' '}
            <span className="font-medium text-gray-700">
              "{deleteModal.category?.name}"
            </span>
            ?
          </>
        }
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
};

export default Categories;