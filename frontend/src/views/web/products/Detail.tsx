// Import React
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

import Button from '../../../components/general/Button';
import WebLayout from '../../../layouts/Web';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';
import ProductGallery from '../../../components/web/product/ProductGallery';
import ReviewList from '../../../components/web/review/ReviewList';

import { useProductDetail } from '../../../hooks/web/product/useProductDetail';
import { getImageUrl } from '../../../utils/imageUrl';
import { formatPrice } from '../../../utils/formatPrice';
import { useAddToCart } from '../../../hooks/web/cart/useAddToCart';

import toast from 'react-hot-toast';

import ReviewModal from '../../../components/web/review/ReviewModal';

import { FiStar } from 'react-icons/fi';

const ProductDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useProductDetail(slug || '');
    const product = response?.data;

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => {
            const newVal = prev + delta;
            if (newVal < 1) return 1;
            if (product && newVal > product.stock) return product.stock;
            return newVal;
        });
    };

    const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const canReview = product?.can_review || false;

    const handleAddToCart = () => {
        if (!product) return;

        addToCart(
            { productId: product.id, quantity },
            {
                onSuccess: (data: { message: string }) => {
                    toast.success(data.message, {
                        position: 'top-center',
                    });
                },
                onError: (error: unknown) => {
                    const axiosError = error as { response: { data: { message: string } } };
                    toast.error(axiosError?.response?.data?.message || 'Gagal menambahkan ke keranjang', {
                        position: 'top-center',
                    });
                }
            }
        );
    };

    const galleryImages = product?.images?.map(img => getImageUrl(img.image_url)) || ['/placeholder-product.png'];

    return (
        <WebLayout>
            <title>{product ? `${product.name} - TokoKita` : 'Produk - TokoKita'}</title>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="py-12">
                        <Loading />
                    </div>
                ) : isError || !product ? (
                    <div className="py-12">
                        <Error
                            title="Produk Tidak Ditemukan"
                            message="Produk yang Anda cari tidak tersedia atau terjadi kesalahan saat memuat data."
                            onRetry={() => navigate('/products')}
                        />
                    </div>
                ) : (
                    <>
                        <nav className="text-sm text-gray-500 mb-6">
                            <Link to="/" className="hover:text-cyan-600 transition-colors">Beranda</Link>
                            <span className="mx-2">/</span>
                            <Link to="/products" className="hover:text-cyan-600 transition-colors">Produk</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-800 font-medium">{product.name}</span>
                        </nav>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <ProductGallery images={galleryImages} productTitle={product.name} />

                            <div className="space-y-6">
                                <div>
                                    <Link
                                        to={`/categories/${product.category?.slug}`}
                                        className="inline-block text-sm text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full hover:bg-cyan-100 transition-colors mb-3"
                                    >
                                        {product.category?.name}
                                    </Link>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                                </div>

                                <div className="text-3xl font-bold text-cyan-600">
                                    {formatPrice(product.price)}
                                </div>

                                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}

                  </span>

                                    {canReview && (
                                        <Button
                                            onClick={() => setIsReviewModalOpen(true)}
                                            size="lg"
                                            className="ml-auto whitespace-nowrap shadow-sm shadow-yellow-100 bg-yellow-400 hover:bg-yellow-500 text-white border-none"
                                        >
                                            <FiStar className="w-4 h-4 mr-1.5" /> Beri Ulasan
                                        </Button>
                                    )}
                                </div>

                                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                    <h3 className="text-base font-bold text-gray-900 mb-2">Deskripsi Produk</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>

                                {product.stock > 0 && (
                                    <div className="space-y-5 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    onClick={() => handleQuantityChange(-1)}
                                                    className="h-8 w-8 bg-white"
                                                    disabled={quantity <= 1}
                                                >
                                                    <FiMinus className="w-3.5 h-3.5" />
                                                </Button>
                                                <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    onClick={() => handleQuantityChange(1)}
                                                    className="h-8 w-8 bg-white"
                                                    disabled={quantity >= product.stock}
                                                >
                                                    <FiPlus className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleAddToCart}
                                                isLoading={isAddingToCart}
                                                loadingText="Memasukkan..."
                                                startIcon={!isAddingToCart && <FiShoppingCart className="w-5 h-5" />}
                                                className="flex-1 py-4 text-base shadow-lg shadow-cyan-100"
                                            >
                                                Tambah ke Keranjang
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Ulasan Pembeli</h2>
                            </div>
                            <ReviewList productId={product.id} productName={product.name} />
                        </div>
                    </>
                )}
            </div>

            {
                product && (
                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        productId={product.id}
                        productName={product.name}
                    />
                )
            }
        </WebLayout >
    );
};

export default ProductDetail;