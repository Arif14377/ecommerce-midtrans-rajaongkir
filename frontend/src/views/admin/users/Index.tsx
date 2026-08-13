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
import { useUsers } from '../../../hooks/admin/user/useUsers';
import { useUserDelete } from '../../../hooks/admin/user/useUserDelete';
import { usePermission } from '../../../hooks/usePermission';

// Types
import type { UserDetailResponse } from '../../../types/user';

// Toast
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasAnyPermission } = usePermission();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: UserDetailResponse | null;
  }>({
    open: false,
    user: null,
  });

  const { data, isLoading, isError, refetch } = useUsers({ page, search });
  const { mutate: deleteUser, isPending: isDeleting } = useUserDelete();

  const setPage = (newPage: number) => {
    setSearchParams({ search, page: String(newPage) });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value, page: '1' });
  };

  const handleDelete = () => {
    if (!deleteModal.user) return;

    deleteUser(deleteModal.user.id, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setDeleteModal({ open: false, user: null });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: unknown) => {
        const err = error as { response: { data: { message: string } } };
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Users - TokoKita Admin</title>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola pengguna sistem</p>
          </div>

          {hasAnyPermission(['users-create']) && (
            <Link to="/admin/users/create">
              <Button startIcon={<FiPlus className="w-4 h-4" />}>
                Tambah User
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-sm">
          <Input
            startIcon={<FiSearch className="w-4 h-4" />}
            placeholder="Cari user..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {isLoading && <Loading />}
        {isError && (
          <Error
            title="Gagal memuat data"
            message="Terjadi kesalahan saat memuat data users."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">User</th>
                    <th className="px-5 py-3 text-left font-medium">Email</th>
                    <th className="px-5 py-3 text-left font-medium">Roles</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{user.name}</p>
                              <p className="text-xs text-gray-400">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{user.email}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {user.roles.slice(0, 2).map((role) => (
                              <span
                                key={role.id}
                                className="px-2 py-0.5 text-xs bg-cyan-100 text-cyan-700 rounded"
                              >
                                {role.name}
                              </span>
                            ))}
                            {user.roles.length > 2 && (
                              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                +{user.roles.length - 2}
                              </span>
                            )}
                            {user.roles.length === 0 && (
                              <span className="text-gray-400 text-xs">
                                Tidak ada role
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {hasAnyPermission(['users-edit']) && (
                              <Link to={`/admin/users/edit/${user.id}`}>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                            )}
                            {hasAnyPermission(['users-delete']) && (
                              <Button
                                variant="danger-light"
                                size="sm"
                                onClick={() =>
                                  setDeleteModal({ open: true, user })
                                }
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
                      colSpan={4}
                      text="User tidak ditemukan"
                      subText={
                        search ? 'Coba kata kunci lain' : 'Tambahkan user baru'
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
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Hapus User"
        message={
          <>
            Apakah Anda yakin ingin menghapus user{' '}
            <span className="font-medium text-gray-700">
              "{deleteModal.user?.name}"
            </span>
            ? <br />
            <span className="text-xs text-red-500">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </>
        }
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
};

export default Users;