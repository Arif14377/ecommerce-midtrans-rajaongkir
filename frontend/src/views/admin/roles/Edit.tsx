// React
import React, { useState } from 'react';

// Router
import { useNavigate, useParams } from 'react-router';

// Icons
import {
  FiSave,
  FiArrowLeft,
  FiCheck
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useRoleById } from '../../../hooks/admin/role/useRoleById';
import { useRoleUpdate } from '../../../hooks/admin/role/useRoleUpdate';
import { usePermissionsAll } from '../../../hooks/admin/permission/usePermissionsAll';

// Utils
import toast from 'react-hot-toast';

// Types
import type { RoleResponse } from '../../../types/role';

interface ValidationErrors {
  [key: string]: string;
}

interface RoleFormProps {
  role: RoleResponse;
}

const RoleForm: React.FC<RoleFormProps> = ({ role }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState<string>(role.name);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(role.permissions.map((p) => p.id));
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Hooks
  const { data: permissions, isLoading: loadingPermissions } = usePermissionsAll();
  const { mutate, isPending } = useRoleUpdate();

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const selectAll = () => {
    if (permissions) {
      setSelectedPermissions(permissions.map((p) => p.id));
    }
  };

  const deselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        id: Number(id),
        data: {
          name: name,
          permission_ids: selectedPermissions,
        },
      },
      {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message);
          navigate('/admin/roles');
        },
        onError: (error: unknown) => {
          const err = error as {
            response: {
              data: { message: string; errors: ValidationErrors };
            };
          };
          toast.error(err.response.data.message);
          setErrors(err.response.data.errors || {});
        },
      }
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg max-w-4xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Nama Role */}
        <div className="max-w-xl">
          <Input
            label="Nama Role"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Admin, Editor, Viewer"
            error={errors.name}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Permissions ({selectedPermissions.length} dipilih)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                Pilih Semua
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Hapus Semua
              </button>
            </div>
          </div>

          {loadingPermissions ? (
            <Loading size="sm" text="Memuat permissions..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
              {permissions?.map((permission) => (
                <label
                  key={permission.id}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors
                    ${selectedPermissions.includes(permission.id)
                      ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <div
                    className={`
                    w-4 h-4 rounded flex items-center justify-center transition-colors
                    ${selectedPermissions.includes(permission.id)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white border border-gray-300'
                      }
                  `}
                  >
                    {selectedPermissions.includes(permission.id) && (
                      <FiCheck className="w-3 h-3" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(
                      permission.id
                    )}
                    onChange={() => togglePermission(permission.id)}
                    className="hidden"
                  />
                  <span className="truncate">{permission.name}</span>
                </label>
              ))}
            </div>
          )}
          {errors.permission_ids && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.permission_ids}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            startIcon={<FiArrowLeft className="w-4 h-4" />}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="success"
            isLoading={isPending}
            startIcon={<FiSave className="w-4 h-4" />}
            loadingText="Menyimpan..."
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

const RoleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: role, isLoading, isError } = useRoleById(Number(id));

  return (
    <AdminLayout>
      <title>Edit Role - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Edit Role</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ubah data role dan permissions
          </p>
        </div>

        {isLoading && <Loading text="Memuat data role..." />}

        {isError && (
          <Error
            title="Gagal memuat data"
            message="Role tidak ditemukan atau terjadi kesalahan."
            onRetry={() => navigate('/admin/roles')}
          />
        )}

        {!isLoading && !isError && role && (
          <RoleForm role={role} />
        )}
      </div>
    </AdminLayout>
  );
};

export default RoleEdit;