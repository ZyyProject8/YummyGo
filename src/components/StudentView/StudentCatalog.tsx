import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { CanteenLocationSection } from './CanteenLocationSection';
import { ActiveOrderBanner } from './ActiveOrderBanner';
import { Product, ProductCategory } from '../../types';

const CATEGORIES: ProductCategory[] = [
  'Semua',
  'Makanan',
  'Minuman',
];

interface StudentCatalogProps {
  onOpenOrders: () => void;
}

export const StudentCatalog: React.FC<StudentCatalogProps> = ({ onOpenOrders }) => {
  const { products } = useCanteen();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filter products based on search, category, and availability
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory = selectedCategory === 'Semua' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAvailability = !onlyAvailable || (prod.isAvailable && prod.stock > 0);

      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [products, selectedCategory, searchQuery, onlyAvailable]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Clean, Simple Hero Section */}
      <HeroSection
        onExploreMenu={() => scrollToSection('katalog-menu')}
        onHowItWorks={() => scrollToSection('cara-pesan')}
      />

      {/* Catalog Search & Category Filter Section */}
      <section id="katalog-menu" className="scroll-mt-24 pt-2">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Daftar Menu Kantin
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih makanan dan minuman yang ingin dipesan untuk jam istirahat.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total {filteredProducts.length} menu tersedia
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari menu makanan atau minuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Checkbox only available */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none shrink-0 px-2">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
              />
              <span>Hanya menu yang tersedia</span>
            </label>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8">
            <h3 className="font-bold text-base text-slate-800">Menu Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ada menu yang sesuai dengan pencarian "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setOnlyAvailable(false);
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setDetailProduct(p)}
              />
            ))}
          </div>
        )}

      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Canteen Location & Operation Section */}
      <CanteenLocationSection />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      {/* Floating Bottom Active Order Banner for Student */}
      <ActiveOrderBanner onOpenOrders={onOpenOrders} />

    </div>
  );
};
