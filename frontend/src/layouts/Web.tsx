// Import React
import React from 'react';

//import component Header
import Header from '../components/web/header/Header';

//import component Footer
import Footer from '../components/web/footer/Footer';

const WebLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebLayout;