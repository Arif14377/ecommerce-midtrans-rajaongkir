import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useSearch } from '../../../hooks/web/search/useSearch';
import { getImageUrl } from '../../../utils/imageUrl';
import { formatPrice } from '../../../utils/formatPrice';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, results, isLoading, isSearching } = useSearch();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen, setQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
          />

          {(isLoading || isSearching) && (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-cyan-500 rounded-full animate-spin" />
          )}

          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Tutup
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              Ketik minimal 2 karakter untuk mencari...
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Mencari produk...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada produk ditemukan untuk "{query}"
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={getImageUrl(product.images?.[0]?.image_url || '')}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.category?.name}
                    </p>
                    <p className="text-cyan-600 font-bold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 bg-gray-50 text-center text-sm text-gray-500 border-t">
            Tekan ESC untuk menutup
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;