import React from 'react';
import CustomerLayout from '../../../layouts/Customer';
import Loading from '../../../components/general/Loading';
import OrderHistory from '../../../components/web/order/OrderHistory';
import { useMyOrders } from '../../../hooks/web/order/useMyOrders';

const Dashboard: React.FC = () => {
  const { data: response, isLoading } = useMyOrders();
  const orders = response?.data || [];

  return (
    <CustomerLayout>
      <title>Customer Dashboard - TokoKita</title>
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-40">
          <Loading />
        </div>
      ) : (
        <OrderHistory orders={orders} />
      )}
    </CustomerLayout>
  );
};

export default Dashboard;