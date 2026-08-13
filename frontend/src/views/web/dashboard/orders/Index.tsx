import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { FiPackage, FiArrowLeft } from 'react-icons/fi';


import CustomerLayout from '../../../../layouts/Customer';
import Loading from '../../../../components/general/Loading';
import { useGetOrderDetail } from '../../../../hooks/web/order/useGetOrderDetail';
import toast from 'react-hot-toast';


// Refactored Components
import OrderDetailHeader from '../../../../components/web/order/OrderDetailHeader';
import OrderItemList from '../../../../components/web/order/OrderItemList';
import OrderShippingCard from '../../../../components/web/order/OrderShippingCard';
import OrderSummaryCard from '../../../../components/web/order/OrderSummaryCard';

// Types - import for global Window.snap declaration
import '../../../../types/midtrans';

// Constants
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';
const SNAP_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: response, isLoading } = useGetOrderDetail(id || '');
    const order = response?.data;

    useEffect(() => {
        if (!MIDTRANS_CLIENT_KEY) return;
        const scriptId = 'midtrans-script';
        const existingScript = document.getElementById(scriptId);

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = SNAP_SCRIPT_URL;
            script.id = scriptId;
            script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (order?.id) {
            document.title = `Detail Pesanan #${order.id} - TokoKita`;
        } else {
            document.title = 'Detail Pesanan - TokoKita';
        }
    }, [order?.id]);

    const handlePayment = () => {
        if (order?.snap_token && window.snap) {
            window.snap.pay(order.snap_token, {
                onSuccess: function () {
                    toast.success('Pembayaran Berhasil!');
                    window.location.reload();
                },
                onPending: function () {
                    toast('Menunggu Pembayaran', { icon: '⏳' });
                },
                onError: function () {
                    toast.error('Pembayaran Gagal');
                },
            });
        } else {
            toast.error('Sistem pembayaran belum siap');
        }
    };

    if (isLoading) return <CustomerLayout><Loading /></CustomerLayout>;

    if (!order) {
        return (
            <CustomerLayout>
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-gray-300">
                        <FiPackage className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-800">Pesanan tidak ditemukan</h2>
                    <Link to="/dashboard" className="text-cyan-600 mt-4 font-bold flex items-center gap-2 hover:underline">
                        <FiArrowLeft /> Kembali ke Dashboard
                    </Link>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <OrderDetailHeader
                orderId={order.id}
                createdAt={order.created_at}
                status={order.status}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-5">
                    <OrderItemList
                        items={order.items || []}
                        status={order.status}
                    />

                    <OrderShippingCard
                        name={order.shipping_name}
                        phone={order.shipping_phone}
                        address={order.shipping_address}
                    />
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <OrderSummaryCard
                        totalPrice={order.total_price}
                        shippingCost={order.shipping_cost}
                        status={order.status}
                        onPayment={handlePayment}
                    />
                </div>
            </div>

        </CustomerLayout>
    );
};

export default OrderDetail;
