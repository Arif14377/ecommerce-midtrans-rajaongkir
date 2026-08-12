// React
import React, { useState, useEffect } from 'react';

// Router
import { useNavigate, useParams } from 'react-router';

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
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';
import DeleteModal from '../../../components/general/DeleteModal';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useCategoriesAll } from '../../../hooks/admin/category/useCategoriesAll';
import { useProductById } from '../../../hooks/admin/product/useProductById';
import { useProductUpdate } from '../../../hooks/admin/product/useProductUpdate';
import { useProductImageDelete } from '../../../hooks/admin/product/useProductImageDelete';

// Utils
import toast from 'react-hot-toast';
import { getImageUrl } from '../../../utils/imageUrl';

// Types
import type { ProductResponse } from '../../../types/product';
import type { CategoryResponse } from '../../../types/category';
import type { ApiError } from '../../../types/api';

interface ValidationErrors {
  [key: string]: string;
}

interface ProductFormProps {
  product: ProductResponse;
  categories: CategoryResponse[] | undefined;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState<number | ''>(product.category_id);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    imageId: number | null;
  }>({
    open: false,
    imageId: null,
  });

  const { mutate, isPending } = useProductUpdate();
  const { mutate: deleteImage, isPending: isDeletingImage } = useProductImageDelete();
  const { refetch } = useProductById(Number(id));

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isSmall = file.size <= 2 * 1024 * 1024;

      if (!isImage) toast.error(`File ${file.name} bukan gambar!`);
      if (!isSmall) toast.error(`File ${file.name} terlalu besar (Max 2MB)!`);

      return isImage && isSmall;
    });

    if (validFiles.length === 0) return;

    setNewImages((prev) => [...prev, ...validFiles]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));

    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDeleteImageClick = (imageId: number) => {
    setDeleteModal({ open: true, imageId });
  };

  const handleConfirmDeleteImage = () => {
    if (!deleteModal.imageId) return;

    deleteImage(deleteModal.imageId, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setDeleteModal({ open: false, imageId: null });
        refetch();
      },
      onError: (err: ApiError) => {
        toast.error(err.response?.data?.message || 'Gagal menghapus gambar');
      },
    });
  };

  const handleSubmit: React.SubmitEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (categoryId) formData.append('category_id', String(categoryId));
    if (price) formData.append('price', price);
    if (stock) formData.append('stock', stock);

    newImages.forEach((image) => {
      formData.append('images[]', image);
    });

    mutate(
      { id: Number(id), formData },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          navigate('/admin/products');
        },
        onError: (err: ApiError) => {
          const errorData = err.response?.data?.errors;
          if (errorData) {
            const convertedErrors: ValidationErrors = {};
            Object.entries(errorData).forEach(([key, value]) => {
              convertedErrors[key] = Array.isArray(value) ? value[0] : String(value);
            });
            setErrors(convertedErrors);
          }
          if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          }
        },
      }
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
            <Input
              label="Nama Produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama produk..."
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
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Deskripsi lengkap produk..."
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              error={errors.price}
            />

            <Input
              label="Stok"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              error={errors.stock}
            />
          </div>
        </div>

        <div className="space-y-6">
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

            {product.images?.length ? (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square border rounded-lg overflow-hidden group"
                  >
                    <img
                      src={getImageUrl(img.image_url)}
                      className="w-full h-full object-cover"
                      alt="Product"
                    />
                    <Button
                      type="button"
                      variant="danger-icon"
                      onClick={() => handleDeleteImageClick(img.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

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
                Klik atau Drag gambar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maksimal 2MB per gambar
              </p>
            </div>

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {newImagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="New Preview"
                    />
                    <Button
                      type="button"
                      variant="danger-icon"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="success"
              isLoading={isPending}
              startIcon={<FiSave className="w-4 h-4" />}
              loadingText="Mengupdate..."
              className="w-full"
            >
              Update Produk
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              startIcon={<FiArrowLeft className="w-4 h-4" />}
              className="w-full"
            >
              Batal
            </Button>
          </div>
        </div>
      </form>

      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, imageId: null })}
        onConfirm={handleConfirmDeleteImage}
        title="Hapus Gambar"
        message="Apakah Anda yakin ingin menghapus gambar ini?"
        isDeleting={isDeletingImage}
        confirmText="Hapus"
      />
    </>
  );
};

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
  } = useProductById(Number(id));
  const { data: categories } = useCategoriesAll();

  return (
    <AdminLayout>
      <title>Edit Produk - TokoKita Admin</title>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Edit Produk</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ubah data produk</p>
        </div>

        {isLoading && <Loading text="Memuat produk..." />}

        {isError && (
          <Error
            title="Gagal memuat data"
            message="Produk tidak ditemukan atau terjadi kesalahan."
            onRetry={() => navigate('/admin/products')}
          />
        )}

        {!isLoading && !isError && product && (
          <ProductForm product={product} categories={categories} />
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductEdit;