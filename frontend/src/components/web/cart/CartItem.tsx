import React from "react";
import { FiTrash2 } from "react-icons/fi";
import QuantitySelector from "../../general/QuantitySelector";
import { formatPrice } from "../../../utils/formatPrice";

interface CartItemProps {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
  isUpdating: boolean;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  image,
  title,
  price,
  quantity,
  stock,
  isUpdating,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 line-clamp-1">
          {title}
        </h3>
        <p className="text-cyan-600 font-bold mt-1">
          {formatPrice(price)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <QuantitySelector
            value={quantity}
            max={stock}
            onChange={(val) =>
              onQuantityChange(id, val)
            }
            isLoading={isUpdating}
          />
          <span className="text-xs text-gray-400 ml-1">
            Stok: {stock}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        <span className="font-bold text-gray-800 text-lg">
          {formatPrice(price * quantity)}
        </span>
        <button
          onClick={() => onRemove(id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus item"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;