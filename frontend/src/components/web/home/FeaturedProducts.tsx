import React from 'react';
import ProductCard from '../product/ProductCard';
import Loading from '../../general/Loading';
import type { PublicProduct } from '../../../types/product';
import { useAddToCart } from '../../../hooks/web/cart/useAddToCart';
import toast from 'react-hot-toast';

interface FeaturedProductsProps {
  products: PublicProduct[];
  isLoading: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  isLoading,
}) => {
  const { mutate: addToCart } = useAddToCart();

  const handleAddToCart = (productId: number) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: (data: { message: string }) => {
          toast.success(data.message, {
            position: 'top-center',
          });
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response: { data: { message: string } };
          };
          toast.error(
            axiosError?.response?.data?.message ||
              'Gagal menambahkan ke keranjang',
            {
              position: 'top-center',
            }
          );
        },
      }
    );
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {isLoading ? (
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
                image={product.images?.[0]?.image_url || ''}
                title={product.name}
                price={product.price}
                category={product.category?.name}
                onAddToCart={() =>
                  handleAddToCart(product.id)
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Belum ada produk tersedia
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;