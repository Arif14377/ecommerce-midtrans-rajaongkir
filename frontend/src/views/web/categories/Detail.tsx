// Import React
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router';

import WebLayout from '../../../layouts/Web';
import ProductCard from '../../../components/web/product/ProductCard';
import Loading from '../../../components/general/Loading';
import Error from '../../../components/general/Error';
import { useCategoryDetail } from '../../../hooks/web/category/useCategoryDetail';
import { useProducts } from '../../../hooks/web/product/useProducts';
import SectionHeader from '../../../components/general/SectionHeader';

const CategoryDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const { data: categoryData, isLoading: isLoadingCategory, isError: isErrorCategory } = useCategoryDetail(slug || '');

    const { data: productsData, isLoading: isLoadingProducts } = useProducts(1, 12, '', slug || '');

    const category = categoryData?.data;
    const products = productsData?.data || [];

    return (
        <WebLayout>
            <title>{category?.name}</title>

            {isLoadingCategory ? (
                <div className="flex justify-center py-20">
                    <Loading />
                </div>
            ) : isErrorCategory || !category ? (
                <div className="max-w-5xl mx-auto px-4 py-20">
                    <Error
                        title="Kategori Tidak Ditemukan"
                        message="Kategori yang Anda cari tidak tersedia atau terjadi kesalahan saat memuat data."
                        onRetry={() => navigate('/')}
                    />
                </div>
            ) : (
                <div className="py-8 bg-gray-50 min-h-screen">
                    <div className="max-w-5xl mx-auto px-4">
                        {/* Breadcrumb */}
                        <nav className="text-sm text-gray-500 mb-6">
                            <Link to="/" className="hover:text-cyan-600">Beranda</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-800">{category.name}</span>
                        </nav>

                        <div className="bg-white rounded-xl p-6 md:p-10 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
                                <p className="text-gray-500">Menampilkan koleksi produk terbaik dari kategori {category.name}</p>
                            </div>
                        </div>

                        <SectionHeader title="Produk" subtitle={`Ditemukan ${productsData?.meta?.total || 0} produk`} />

                        {isLoadingProducts ? (
                            <div className="flex justify-center py-12">
                                <Loading />
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        slug={product.slug}
                                        image={product.images?.[0]?.image_url}
                                        title={product.name}
                                        price={product.price}
                                        category={category.name}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                                <p className="text-gray-500 mb-4">Belum ada produk di kategori ini</p>
                                <Link to="/" className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-cyan-600 transition-colors">
                                    Cari Produk Lain
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </WebLayout>
    );
};

export default CategoryDetail;