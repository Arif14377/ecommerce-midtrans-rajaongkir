// React
import React, { useState} from 'react';

// Router
import { useNavigate, useParams } from 'react-router';

// Icons
import { FiSave, FiArrowLeft } from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { usePermissionById } from '../../../hooks/admin/permission/usePermissionById';
import { usePermissionUpdate } from '../../../hooks/admin/permission/usePermissionUpdate';

// Toast
import toast from 'react-hot-toast';

// Types
import type { PermissionResponse } from '../../../types/permission';

interface ValidationErrors {
  [key: string]: string;
}

interface PermissionFormProps {
  permission: PermissionResponse;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ permission }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState<string>(permission.name);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { mutate, isPending } = usePermissionUpdate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    mutate(
      {
        id: Number(id),
        data: { name },
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          navigate('/admin/permissions');
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
    <div className="bg-white border border-gray-200 rounded-lg max-w-2xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <Input
          label="Nama Permission"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: products-create"
          error={errors.name}
        />

        {/* Buttons */}
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

const PermissionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: permission, isLoading, isError } = usePermissionById(Number(id));

  return (
    <AdminLayout>
      <title>Edit Permission - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Edit Permission</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ubah data permission
          </p>
        </div>

        {isLoading && <Loading text="Memuat data permission..." />}

        {isError && (
          <Error
            title="Gagal memuat data"
            message="Permission tidak ditemukan atau terjadi kesalahan."
            onRetry={() => navigate('/admin/permissions')}
          />
        )}

        {!isLoading && !isError && permission && (
          <PermissionForm permission={permission} />
        )}
      </div>
    </AdminLayout>
  );
};

export default PermissionEdit;