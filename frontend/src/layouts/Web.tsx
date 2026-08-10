// Import React
import React from 'react';
import { Toaster } from 'react-hot-toast';

//import component Header
import Header from '../components/web/header/Header';

//import component Footer
import Footer from '../components/web/footer/Footer';

const WebLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebLayout;