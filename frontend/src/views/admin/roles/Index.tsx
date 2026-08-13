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
  FiShield,
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
import { useRoles } from '../../../hooks/admin/role/useRoles';
import { useRoleDelete } from '../../../hooks/admin/role/useRoleDelete';
import { usePermission } from '../../../hooks/usePermission';

// Types
import type { RoleResponse } from '../../../types/role';

// Toast
import toast from 'react-hot-toast';


const Roles: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasAnyPermission } = usePermission();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    role: RoleResponse | null;
  }>({
    open: false,
    role: null,
  });

  const { data, isLoading, isError, refetch } = useRoles({ page, search });
  const { mutate: deleteRole, isPending: isDeleting } = useRoleDelete();

  const setPage = (newPage: number) => {
    setSearchParams({ search, page: String(newPage) });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value, page: '1' });
  };

  const handleDelete = () => {
    if (!deleteModal.role) return;

    deleteRole(deleteModal.role.id, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setDeleteModal({ open: false, role: null });
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
      onError: (error: unknown) => {
        const err = error as { response: { data: { message: string } } };
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Roles - TokoKita Admin</title>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Roles</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola peran pengguna dan hak akses</p>
          </div>

          {hasAnyPermission(['roles-create']) && (
            <Link to="/admin/roles/create">
              <Button startIcon={<FiPlus className="w-4 h-4" />}>
                Tambah Role
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-sm">
          <Input
            startIcon={<FiSearch className="w-4 h-4" />}
            placeholder="Cari role..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {isLoading && <Loading />}
        {isError && (
          <Error
            title="Gagal memuat data"
            message="Terjadi kesalahan saat memuat data roles."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Nama Role</th>
                    <th className="px-5 py-3 text-left font-medium">Permissions</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                              <FiShield className="w-4 h-4 text-cyan-600" />
                            </div>
                            <span className="font-medium text-gray-800">{role.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {role.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm.id}
                                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {perm.name}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="px-2 py-0.5 text-xs bg-cyan-100 text-cyan-700 rounded">
                                +{role.permissions.length - 3} lainnya
                              </span>
                            )}
                            {role.permissions.length === 0 && (
                              <span className="text-gray-400 text-xs">
                                Tidak ada permission
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {hasAnyPermission(['roles-edit']) && (
                              <Link to={`/admin/roles/edit/${role.id}`}>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                            )}

                            {hasAnyPermission(['roles-delete']) && (
                              <Button
                                variant="danger-light"
                                size="sm"
                                onClick={() => setDeleteModal({ open: true, role })}
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
                      text="Role tidak ditemukan"
                      subText={
                        search ? 'Coba kata kunci lain' : 'Tambahkan role baru'
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
        onClose={() => setDeleteModal({ open: false, role: null })}
        onConfirm={handleDelete}
        title="Hapus Role"
        message={
          <>
            Apakah Anda yakin ingin menghapus role{' '}
            <span className="font-medium text-gray-700">
              "{deleteModal.role?.name}"
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

export default Roles;