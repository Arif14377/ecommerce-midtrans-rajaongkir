// React
import React, { useState } from 'react';

// Router
import { useNavigate } from 'react-router';

// Icons
import {
  FiSave,
  FiArrowLeft,
  FiUploadCloud,
  FiX
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useSliderCreate } from '../../../hooks/admin/slider/useSliderCreate';

// Toast
import toast from 'react-hot-toast';

interface ValidationErrors {
  [key: string]: string;
}

const SliderCreate: React.FC = () => {
  const navigate = useNavigate();

  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { mutate, isPending } = useSliderCreate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    formData.append('link', link);

    mutate(formData, {
      onSuccess: (data: { message: string }) => {
        toast.success(data.message);
        navigate('/admin/sliders');
      },
      onError: (error: unknown) => {
        const err = error as {
          response: {
            data: { message: string; errors: ValidationErrors };
          };
        };
        setErrors(err.response.data.errors || {});
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Tambah Slider - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tambah Slider</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload banner slider baru</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gambar Banner
              </label>

              {!imagePreview ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiUploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">
                    Klik atau Drag gambar ke sini
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-64 object-cover"
                  />
                  <Button
                    type="button"
                    variant="danger-icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 shadow-sm"
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image}</p>
              )}
            </div>

            <Input
              label="Link Url (Opsional)"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
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
                loadingText="Mengupload..."
              >
                Simpan Slider
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SliderCreate;