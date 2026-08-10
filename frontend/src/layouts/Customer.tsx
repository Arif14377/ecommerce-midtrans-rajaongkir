import React from 'react';
import WebLayout from './Web';
import CustomerSidebar from '../components/web/sidebar/CustomerSidebar';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <WebLayout>
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 items-center gap-4 flex">
            <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
            Dashboard Customer
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CustomerSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  );
};

export default CustomerLayout;