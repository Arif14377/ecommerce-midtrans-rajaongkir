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
import { useUserById } from '../../../hooks/admin/user/useUserById';
import { useUserUpdate } from '../../../hooks/admin/user/useUserUpdate';
import { useRolesAll } from '../../../hooks/admin/role/useRolesAll';

// Toast
import toast from 'react-hot-toast';

// Types
import type { UserDetailResponse } from '../../../types/user';

interface ValidationErrors {
  [key: string]: string;
}

interface UserFormProps {
  user: UserDetailResponse;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>(user.roles.map((r) => r.id));
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Hooks
  const { data: roles, isLoading: loadingRoles } = useRolesAll();
  const { mutate, isPending } = useUserUpdate();

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data: {
      name: string;
      username: string;
      email: string;
      role_ids: number[];
      password?: string;
    } = { name, username, email, role_ids: selectedRoles };

    if (password) data.password = password;

    mutate(
      { id: Number(id), data },
      {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message);
          navigate('/admin/users');
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nama"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            error={errors.name}
          />
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            error={errors.username}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            error={errors.email}
          />
          <Input
            label={
              <span>
                Password{' '}
                <span className="text-gray-400 font-normal">
                  (kosongkan jika tidak diubah)
                </span>
              </span>
            }
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Roles ({selectedRoles.length} dipilih)
          </label>
          {loadingRoles ? (
            <Loading size="sm" text="Memuat roles..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              {roles?.map((role) => (
                <label
                  key={role.id}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors
                    ${selectedRoles.includes(role.id)
                      ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <div
                    className={`
                    w-4 h-4 rounded flex items-center justify-center transition-colors
                    ${selectedRoles.includes(role.id)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white border border-gray-300'
                      }
                  `}
                  >
                    {selectedRoles.includes(role.id) && (
                      <FiCheck className="w-3 h-3" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="hidden"
                  />
                  <span className="truncate">{role.name}</span>
                </label>
              ))}
            </div>
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

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUserById(Number(id));

  return (
    <AdminLayout>
      <title>Edit User - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Edit User</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ubah data user</p>
        </div>

        {isLoading && <Loading text="Memuat data user..." />}

        {isError && (
          <Error
            title="Gagal memuat data"
            message="User tidak ditemukan."
            onRetry={() => navigate('/admin/users')}
          />
        )}

        {!isLoading && !isError && user && (
          <UserForm user={user} />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserEdit;