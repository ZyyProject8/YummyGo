import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Flame, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/helpers';
import { useCanteen } from '../../context/CanteenContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart, settings } = useCanteen();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen || !product) return null;

  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !settings.isOpen) return;
    addToCart(product, quantity, notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-rose-600 text-white text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                {product.category}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{product.name}</h2>
            </div>
            <p className="text-xl font-extrabold text-emerald-600 shrink-0">
              {formatRupiah(product.price)}
            </p>
          </div>

          {/* Quick info metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-500 py-2 border-y border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Saji: ~{product.preparationTimeMinutes} menit
            </span>
            {product.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                {product.calories} kkal
              </span>
            )}
            <span className="font-semibold text-slate-700">
              Sisa stok: {product.stock} porsi
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Tambahan untuk Menu Ini (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Sambal dipisah, jangan pakai timun, kuah banyakin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-slate-500 hover:text-slate-900 disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm w-6 text-center tabular-nums">{quantity}</span>
            <button
              type="button"
              disabled={quantity >= product.stock || isOutOfStock}
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="text-slate-500 hover:text-slate-900 disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            disabled={isOutOfStock || !settings.isOpen}
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tambah ke Keranjang • {formatRupiah(product.price * quantity)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
