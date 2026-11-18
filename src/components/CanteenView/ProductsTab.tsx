import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, Check, X, AlertTriangle, Image as ImageIcon, Flame, Clock } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Product, ProductCategory } from '../../types';
import { formatRupiah } from '../../utils/helpers';

const PRESET_IMAGES = [
  { label: 'Ayam Geprek', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ayam Goreng', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nasi Telur', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mie Goreng', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mie Kuah Telur', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
  { label: 'Risol Mayo', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { label: 'Aneka Gorengan', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cireng Crispy', url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nutrisari Dingin', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80' },
  { label: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Air Mineral', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80' },
];

export const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductAvailability, updateProductStock } = useCanteen();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Makanan' | 'Minuman'>('Makanan');
  const [price, setPrice] = useState<number>(10000);
  const [stock, setStock] = useState<number>(20);
  const [prepTime, setPrepTime] = useState<number>(5);
  const [calories, setCalories] = useState<number>(300);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Makanan');
    setPrice(10000);
    setStock(20);
    setPrepTime(5);
    setCalories(300);
    setImage(PRESET_IMAGES[0].url);
    setDescription('');
    setBadge('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setStock(p.stock);
    setPrepTime(p.preparationTimeMinutes);
    setCalories(p.calories || 0);
    setImage(p.image);
    setDescription(p.description);
    setBadge(p.badge || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: name.trim(),
        category: category as any,
        price: Number(price),
        stock: Number(stock),
        isAvailable: Number(stock) > 0,
        preparationTimeMinutes: Number(prepTime),
        calories: calories ? Number(calories) : undefined,
        image: image.trim() || PRESET_IMAGES[0].url,
        description: description.trim(),
        badge: badge.trim() || undefined,
      });
    } else {
      addProduct({
        name: name.trim(),
        category: category as any,
        price: Number(price),
        stock: Number(stock),
        isAvailable: Number(stock) > 0,
        preparationTimeMinutes: Number(prepTime),
        calories: calories ? Number(calories) : undefined,
        image: image.trim() || PRESET_IMAGES[0].url,
        description: description.trim(),
        badge: badge.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, productName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus menu "${productName}" dari kantin?`)) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search & Category Filter */}
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari menu kantin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
          </select>
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>

      </div>

      {/* Products Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3.5">Menu</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Harga</th>
                <th className="px-4 py-3.5">Kelola Stok</th>
                <th className="px-4 py-3.5">Status Jual</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isOutOfStock = !p.isAvailable || p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Menu Photo & Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{p.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> ~{p.preparationTimeMinutes} mnt
                            </span>
                            {p.badge && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {formatRupiah(p.price)}
                    </td>

                    {/* Stock stepper */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 flex items-center justify-center"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={p.stock}
                          onChange={(e) => updateProductStock(p.id, parseInt(e.target.value) || 0)}
                          className="w-14 text-center py-1 rounded-lg border border-slate-200 font-bold text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleProductAvailability(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          !isOutOfStock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${!isOutOfStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{!isOutOfStock ? 'Tersedia' : 'Habis'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Menu"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProduct ? 'Edit Menu Kantin' : 'Tambah Menu Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Menu Makanan / Minuman <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Nasi Bakar Cakalang Suwir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs bg-white"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga (Rp) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="500"
                    step="500"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Saji (Mnt)</label>
                  <input
                    type="number"
                    min="1"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Terlaris, Promo..."
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Photo URL & Presets */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Foto Menu (URL Gambar)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                </div>

                {/* Preset image buttons for quick click */}
                <div className="mt-2">
                  <span className="text-[10px] text-slate-500 font-medium">Atau pilih cepat foto preset kantin:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition-colors ${
                          image === preset.url
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Image */}
                {image && (
                  <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Menu</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan bahan, rasa, dan kelezatan menu ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambahkan Menu'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
