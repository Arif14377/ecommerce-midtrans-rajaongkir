// React
import React, { useState } from 'react';

// Router
import { Link } from 'react-router';

// React Query
import { useQueryClient } from '@tanstack/react-query';

// Icons
import {
  FiPlus,
  FiTrash2,
  FiLink
} from 'react-icons/fi';

// Components
import Button from '../../../components/general/Button';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';
import TableEmptyRow from '../../../components/general/TableEmptyRow';
import DeleteModal from '../../../components/general/DeleteModal';

// Layouts
import AdminLayout from '../../../layouts/Admin';

// Hooks
import { useSliders } from '../../../hooks/admin/slider/useSliders';
import { useSliderDelete } from '../../../hooks/admin/slider/useSliderDelete';

// Types
import type { Slider } from '../../../types/slider';

// Toast
import toast from 'react-hot-toast';


const SlidersIndex: React.FC = () => {
  const queryClient = useQueryClient();

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    slider: Slider | null;
  }>({
    open: false,
    slider: null,
  });

  const { data, isLoading, isError, refetch } = useSliders();
  const { mutate: deleteSlider, isPending: isDeleting } = useSliderDelete();

  const handleDelete = () => {
    if (!deleteModal.slider) return;

    deleteSlider(deleteModal.slider.id, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setDeleteModal({ open: false, slider: null });
        queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
      },
      onError: (error: unknown) => {
        const err = error as { response: { data: { message: string } } };
        toast.error(err.response.data.message);
      },
    });
  };

  return (
    <AdminLayout>
      <title>Sliders - TokoKita Admin</title>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Sliders</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola banner slider aplikasi</p>
          </div>

          <Link to="/admin/sliders/create">
            <Button startIcon={<FiPlus className="w-4 h-4" />}>
              Tambah Slider
            </Button>
          </Link>
        </div>

        {isLoading && <Loading />}
        {isError && (
          <Error
            title="Gagal memuat data"
            message="Terjadi kesalahan saat memuat data sliders."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Link</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((slider) => (
                      <tr key={slider.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="w-32 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={slider.image}
                              alt="slider"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
	                        <td className="px-6 py-4 text-gray-500">
	                          {slider.link ? (
	                            <a
	                              href={slider.link}
	                              target="_blank"
	                              rel="noopener noreferrer"
	                              className="inline-flex items-center gap-1 text-cyan-600 hover:underline"
	                            >
                              <FiLink className="w-3 h-3" /> {slider.link}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="danger-light"
                            size="sm"
                            onClick={() => setDeleteModal({ open: true, slider })}
                            title="Hapus Slider"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <TableEmptyRow colSpan={3} text="Belum ada data slider" />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, slider: null })}
        onConfirm={handleDelete}
        title="Hapus Slider"
        message={
          <>
            Apakah Anda yakin ingin menghapus slider ini? <br />
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

export default SlidersIndex;
