import React from 'react';
import { Link } from 'react-router';
import { FiShoppingBag } from 'react-icons/fi';
import Button from '../../general/Button';

const CartEmptyState: React.FC = () => {
  return (
    <div className="text-center py-24 bg-white rounded-4xl border border-gray-100 shadow-sm px-6">
      <div className="relative w-32 h-32 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
        <FiShoppingBag className="w-14 h-14 text-cyan-500" />
        <div className="absolute -top-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xl">🛒</span>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
        Keranjang Belanja Kosong
      </h2>

      <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
        Wah, keranjang belanjaanmu masih kosong nih. Yuk,
        cari produk favoritmu sekarang!
      </p>

      <Link to="/">
        <Button className="px-10 py-4 shadow-xl shadow-cyan-100 text-base font-bold hover:scale-105 transition-transform active:scale-95">
          Mulai Belanja
        </Button>
      </Link>
    </div>
  );
};

export default CartEmptyState;