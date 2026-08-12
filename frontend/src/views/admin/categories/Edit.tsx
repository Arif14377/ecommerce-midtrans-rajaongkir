// React
import React, { useState, type FormEvent } from 'react';

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
import { useCategoryById } from '../../../hooks/admin/category/useCategoryById';
import { useCategoryUpdate } from '../../../hooks/admin/category/useCategoryUpdate';

// Toast
import toast from 'react-hot-toast';

// Types
import type { CategoryResponse } from '../../../types/category';

interface ValidationErrors {
  [key: string]: string;
}

interface CategoryFormProps {
  category: CategoryResponse;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category }) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCategoryUpdate();

  const [name, setName] = useState(category.name);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    mutate(
      { id: category.id, data: { name } },
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
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: category, isLoading, isError } = useCategoryById(Number(id));

  return (
    <AdminLayout>
      <title>Edit Kategori - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Edit Kategori</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ubah data kategori</p>
        </div>

        {isLoading && <Loading text="Memuat data..." />}

        {isError && (
          <Error
            title="Gagal memuat data"
            message="Kategori tidak ditemukan."
            onRetry={() => navigate('/admin/categories')}
          />
        )}

        {!isLoading && !isError && category && (
          <CategoryForm category={category} />
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoryEdit;