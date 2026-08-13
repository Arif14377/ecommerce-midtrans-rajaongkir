import React, { useState } from 'react';
import { FiShoppingBag } from 'react-icons/fi';

import WebLayout from '../../../layouts/Web';
import Loading from '../../../components/general/Loading';
import DeleteModal from '../../../components/general/DeleteModal';
import CartItem from '../../../components/web/cart/CartItem';
import CartSummary from '../../../components/web/cart/CartSummary';
import CartEmptyState from '../../../components/web/cart/CartEmptyState';

import { useGetCart } from '../../../hooks/web/cart/useGetCart';
import { useRemoveFromCart } from '../../../hooks/web/cart/useRemoveFromCart';
import { useUpdateCart } from '../../../hooks/web/cart/useUpdateCart';

import { getImageUrl } from '../../../utils/imageUrl';
import toast from 'react-hot-toast';
import type { ApiError } from '../../../types';

const Cart: React.FC = () => {

    const { data: cartData, isLoading } = useGetCart((data) => {
        const items = data.data || [];
        const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        return { items, subtotal };
    });

    const { mutate: removeCart, isPending: isRemoving } = useRemoveFromCart();
    const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();

    const cartItems = cartData?.items || [];
    const subtotal = cartData?.subtotal || 0;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleRemove = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            removeCart(deleteId, {
                onSuccess: (data: { message: string }) => {
                    toast.success(data.message);
                    setDeleteId(null);
                },
                onError: (error: ApiError) => {
                    toast.error(error?.response?.data?.message || 'Gagal menghapus item');
                    setDeleteId(null);
                },
            });
        }
    };

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatingId(id);
        updateCart(
            { cartItemId: id, quantity: newQuantity },
            {
                onSuccess: () => {
                    setUpdatingId(null);
                },
                onError: () => {
                    toast.error('Gagal mengubah jumlah');
                    setUpdatingId(null);
                },
            }
        );
    };

    return (
        <WebLayout>
            <title>Keranjang Belanja - TokoKita</title>
            <div className="bg-gray-50 min-h-screen py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                        <div className="p-2 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-200">
                            <FiShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        Keranjang Belanja
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <Loading />
                        </div>
                    ) : cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                            {/* Cart Items List */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        id={item.id}
                                        title={item.product.name}
                                        image={getImageUrl(item.product.images?.[0]?.image_url || '')}
                                        price={item.product.price}
                                        quantity={item.quantity}
                                        stock={item.product.stock}
                                        isUpdating={isUpdating && updatingId === item.id}
                                        onQuantityChange={handleQuantityChange}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <CartSummary
                                    totalItems={cartItems.length}
                                    subtotal={subtotal}
                                />
                            </div>
                        </div>
                    ) : (
                        <CartEmptyState />
                    )}
                </div>
            </div>

            <DeleteModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={isRemoving}
                title="Hapus dari Keranjang?"
                message="Produk ini akan dihapus dari daftar belanjaan Anda. Anda yakin?"
                confirmText="Ya, Hapus"
            />
        </WebLayout>
    );
};

export default Cart;