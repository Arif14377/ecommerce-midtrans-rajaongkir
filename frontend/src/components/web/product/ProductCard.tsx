import React from "react";
import { useNavigate } from "react-router";
import { FiShoppingCart } from "react-icons/fi";
import { getImageUrl } from "../../../utils/imageUrl";
import { formatPrice } from "../../../utils/formatPrice";

interface ProductCardProps {
  id: number;
  slug: string;
  image: string;
  title: string;
  price: number;
  category?: string;
  badge?: string;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  slug,
  image,
  title,
  price,
  category,
  badge,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  // Handler untuk klik seluruh card
  const handleCardClick = () => {
    navigate(`/products/${slug}`);
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {badge && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-cyan-500 hover:text-white transition-colors"
            title="Tambah ke Keranjang"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {category && (
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {category}
          </span>
        )}

        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2 hover:text-cyan-600 transition-colors">
          {title}
        </h3>

        <div className="mt-2">
          <span className="text-lg font-bold text-cyan-600">
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;