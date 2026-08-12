// React
import React, { useState } from 'react';

// Router
import { useNavigate } from 'react-router';

// Icons
import {
  FiSave,
  FiArrowLeft
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useCategoryCreate } from '../../../hooks/admin/category/useCategoryCreate';

// Toast
import toast from 'react-hot-toast';

interface ValidationErrors {
  [key: string]: string;
}

const CategoryCreate: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { mutate, isPending } = useCategoryCreate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message);
          navigate('/admin/categories');
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
    <AdminLayout>
      <title>Tambah Kategori - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tambah Kategori</h1>
          <p className="text-sm text-gray-500 mt-0.5">Buat kategori produk baru</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg max-w-2xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <Input
              label="Nama Kategori"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Elektronik, Pakaian"
              error={errors.name}
            />

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
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryCreate;
