// React
import React, { useState, type FormEvent } from 'react';

// Router
import { useNavigate } from 'react-router';

// Icons
import {
  FiSave,
  FiArrowLeft,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';

// Components
import Input from '../../../components/general/Input';
import Button from '../../../components/general/Button';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useCategoriesAll } from '../../../hooks/admin/category/useCategoriesAll';
import { useProductCreate } from '../../../hooks/admin/product/useProductCreate';

// Toast
import toast from 'react-hot-toast';


// ==============================
// Types
// ==============================

interface ValidationErrors {
  [key: string]: string;
}

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { data: categories } = useCategoriesAll();
  const { mutate, isPending } = useProductCreate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (categoryId) formData.append('category_id', String(categoryId));
    if (price) formData.append('price', price);
    if (stock) formData.append('stock', stock);

    images.forEach((image) => {
      formData.append('images[]', image);
    });

    mutate(formData, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        navigate('/admin/products');
      },
      onError: (error: unknown) => {
        const err = error as {
          response: {
            data: {
              message: string;
              errors: ValidationErrors;
            };
          };
        };

        setErrors(err.response.data.errors || {});
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Tambah Produk - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tambah Produk</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Input data produk baru
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
              <Input
                label="Nama Produk"
                placeholder="Nama produk..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi
                </label>

                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi lengkap produk..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
              <Input
                label="Harga (Rp)"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={errors.price}
              />

              <Input
                label="Stok"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                error={errors.stock}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {errors.category_id && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Gambar Produk
              </label>

              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <FiUploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Klik atau drag gambar ke sini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 2MB
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />

                      <Button
                        variant="danger-icon"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.images}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="success"
                startIcon={<FiSave className="w-4 h-4" />}
                isLoading={isPending}
                loadingText="Menyimpan..."
                className="w-full"
              >
                Simpan Produk
              </Button>

              <Button
                type="button"
                variant="secondary"
                startIcon={<FiArrowLeft className="w-4 h-4" />}
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Batal
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductCreate;