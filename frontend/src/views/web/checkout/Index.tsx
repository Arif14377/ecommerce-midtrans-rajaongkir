// import components
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

import WebLayout from '../../../layouts/Web';
import Loading from '../../../components/general/Loading';
import Button from '../../../components/general/Button';

// Refactored Components
import AddressModal from '../../../components/web/checkout/AddressModal';
import ShippingAddress from '../../../components/web/checkout/ShippingAddress';
import CourierSelection from '../../../components/web/checkout/CourierSelection';
import CheckoutSummary from '../../../components/web/checkout/CheckoutSummary';

// Hooks
import { useGetCart } from '../../../hooks/web/cart/useGetCart';
import { useCheckout } from '../../../hooks/web/order/useCheckout';
import { useGetAddresses } from '../../../hooks/web/address/useGetAddresses';
import { useCheckCost } from '../../../hooks/web/rajaongkir/useCheckCost';

// Types
import type { AddressResponse, ApiError, ShippingCostResponse } from '../../../types';
import '../../../types/midtrans';


const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';
const SNAP_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

const Checkout: React.FC = () => {
    const navigate = useNavigate();

    const { data: cartResponse, isLoading: isLoadingCart } = useGetCart();
    const { mutate: checkout, isPending: isProcessing } = useCheckout();
    const { data: addressResponse, isLoading: isLoadingAddresses } = useGetAddresses();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        district_id: '',
    });

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState('');
    const [selectedService, setSelectedService] = useState<ShippingCostResponse | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const cartItems = useMemo(() => cartResponse?.data || [], [cartResponse]);
    const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cartItems]);
    const totalWeight = useMemo(() => cartItems.reduce((acc, item) => acc + (500 * item.quantity), 0), [cartItems]);
    const addresses = useMemo(() => addressResponse?.data || [], [addressResponse]);

    const { data: shippingOptions = [], isLoading: isLoadingOptions } = useCheckCost({
        destination: formData.district_id,
        weight: totalWeight,
        courier: selectedCourier,
    });

    useEffect(() => {
        setSelectedService(null);
    }, [shippingOptions]);

    useEffect(() => {
        if (addresses.length > 0 && !formData.name) {
            const primaryAddress = addresses.find(a => a.is_primary) || addresses[0];
            if (primaryAddress) {
                setFormData({
                    name: primaryAddress.recipient_name,
                    phone: primaryAddress.phone,
                    address: `${primaryAddress.address_line1}, ${primaryAddress.district}, ${primaryAddress.city}, ${primaryAddress.province}, ${primaryAddress.postal_code}`,
                    district_id: primaryAddress.district_id,
                });
                setSelectedAddressId(primaryAddress.id);
            }
        }
    }, [addresses]);

    useEffect(() => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectAddress = (address: AddressResponse) => {
        setFormData({
            name: address.recipient_name,
            phone: address.phone,
            address: `${address.address_line1}, ${address.district}, ${address.city}, ${address.province}, ${address.postal_code}`,
            district_id: address.district_id,
        });
        setSelectedAddressId(address.id);
        setIsAddressModalOpen(false);
        setSelectedService(null);
        toast.success('Alamat terpilih');
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            toast.error('Mohon lengkapi detail pengiriman');
            return;
        }

        if (!selectedService) {
            toast.error('Mohon pilih kurir dan jenis layanan pengiriman');
            return;
        }

        checkout(
            {
                shipping_name: formData.name,
                shipping_phone: formData.phone,
                shipping_address: formData.address,
                shipping_cost: selectedService?.cost || 0,
                courier: selectedCourier,
                service: selectedService?.service,
            },
            {
                onSuccess: (response) => {
                    if (response.success && window.snap) {
                        window.snap.pay(response.data.snap_token, {
                            onSuccess: function () {
                                toast.success('Pembayaran Berhasil!');
                                navigate(`/dashboard/orders/${response.data.order_id}`);
                            },
                            onPending: function () {
                                toast('Menunggu Pembayaran', { icon: '⏳' });
                                navigate(`/dashboard/orders/${response.data.order_id}`);
                            },
                            onError: function () {
                                toast.error('Pembayaran Gagal');
                            },
                            onClose: function () {
                                navigate(`/dashboard/orders/${response.data.order_id}`);
                            },
                        });
                    } else {
                        toast.error('Gagal memuat sistem pembayaran');
                    }
                },
                onError: (err: ApiError) => {
                    toast.error(err?.response?.data?.message || 'Gagal memproses checkout');
                }
            }
        );
    };

    const isLoading = isLoadingCart || isLoadingAddresses;

    console.log({
        destination: formData.district_id,
        weight: totalWeight,
        courier: selectedCourier,
    });

    return (
        <WebLayout>
            <title>Checkout - TokoKita</title>
            <div className="bg-gray-50 min-h-screen py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 flex items-center gap-4">
                        <div className="p-3 bg-cyan-500 rounded-xl shadow-xl shadow-cyan-200">
                            <FiCreditCard className="w-7 h-7 text-white" />
                        </div>
                        Checkout & Pengiriman
                    </h1>

                    {isLoading ? (
                        <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-40">
                            <Loading />
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                                <FiCreditCard className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 mb-3">Wah, Keranjangmu Kosong!</h2>
                            <p className="text-gray-500 mb-10 max-w-xs leading-relaxed font-bold">
                                Tambahkan produk ke keranjang belanja anda sebelum melakukan checkout.
                            </p>
                            <Button onClick={() => navigate('/products')} className="px-10 h-12 shadow-lg shadow-cyan-100">
                                Belanja Sekarang
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
                            <div className="lg:col-span-2 space-y-8 md:space-y-10">
                                <ShippingAddress
                                    addresses={addresses}
                                    formData={formData}
                                    onInputChange={handleInputChange}
                                    onOpenModal={() => setIsAddressModalOpen(true)}
                                />

                                <CourierSelection
                                    districtId={formData.district_id}
                                    selectedCourier={selectedCourier}
                                    onCourierChange={setSelectedCourier}
                                    shippingOptions={shippingOptions}
                                    selectedService={selectedService}
                                    onServiceSelect={setSelectedService}
                                    isLoadingOptions={isLoadingOptions}
                                />
                            </div>

                            <div className="lg:col-span-1 sticky top-28 self-start">
                                <CheckoutSummary
                                    subtotal={subtotal}
                                    shippingCost={selectedService?.cost || 0}
                                    isProcessing={isProcessing}
                                    onPayment={handlePayment}
                                    isServiceSelected={!!selectedService}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                addresses={addresses}
                onSelect={selectAddress}
                selectedId={selectedAddressId}
            />
        </WebLayout>
    );
};

export default Checkout;