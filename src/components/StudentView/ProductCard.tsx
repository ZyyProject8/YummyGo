import React from 'react';
import { Plus, Clock, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/helpers';
import { useCanteen } from '../../context/CanteenContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { cart, addToCart, settings } = useCanteen();

  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const cartItem = cart.find((c) => c.product.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || !settings.isOpen) return;
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      <div>
        {/* Product Image */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <span className="bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase">
                Stok Habis
              </span>
            </div>
          )}

          {cartItem && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-white flex items-center gap-1 shadow-sm">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{cartItem.quantity} dipilih</span>
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-600">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {product.preparationTimeMinutes} mnt
            </span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Harga</span>
          <p className="font-bold text-base text-slate-900">
            {formatRupiah(product.price)}
          </p>
        </div>

        <button
          type="button"
          disabled={isOutOfStock || !settings.isOpen}
          onClick={handleQuickAdd}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-xs transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>
    </div>
  );
};
