import React from "react";
import { Link } from "react-router";
import {
  FiShoppingCart,
  FiMail,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <FiShoppingCart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                TokoKita
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Platform belanja online terpercaya dengan produk
              berkualitas.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Produk
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-cyan-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Pengembalian
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Dapatkan info promo terbaru.
            </p>
            <form
              className="flex"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-r-lg transition-colors"
              >
                <FiMail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TokoKita. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;