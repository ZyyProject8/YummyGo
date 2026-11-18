import React, { useState } from 'react';
import { Utensils, ShoppingBag, Clock, ArrowLeft, Search, X, Plus, Minus, Trash2, Banknote, CreditCard, User, Check, PackageCheck, ChefHat, AlertCircle, ArrowRight, ChevronDown, LogOut } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { Product, ProductCategory, Order, PaymentMethod } from '../../types';
import { PICKUP_TIME_OPTIONS } from '../../data/mockData';
import { formatRupiah, formatDateTime, getStatusBadge } from '../../utils/helpers';

const CATEGORIES: ProductCategory[] = [
  'Semua',
  'Makanan',
  'Minuman',
];

interface StudentDashboardProps {
  onBackToLanding: () => void;
  onOpenQRIS: (amount: number, orderData: {
    customerName: string;
    customerClass: string;
    customerPhone?: string;
    pickupTime: string;
    orderNotes?: string;
    paymentMethod: 'QRIS';
  }) => void;
  onOrderCreated: (order: Order) => void;
  onOpenAuth: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onBackToLanding,
  onOpenQRIS,
  onOrderCreated,
  onOpenAuth,
}) => {
  const {
    products,
    cart,
    cartTotal,
    cartCount,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    orders,
    settings,
    currentStudent,
    logoutStudent,
  } = useCanteen();

  // Active view tab inside Student Dashboard: 'MENU' | 'CART' | 'ORDERS'
  const [activeTab, setActiveTab] = useState<'MENU' | 'CART' | 'ORDERS'>('MENU');

  // Menu Search & Filter States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Cart / Checkout Form States
  const [customerName, setCustomerName] = useState(currentStudent?.name || '');
  const [customerClass, setCustomerClass] = useState(currentStudent?.studentClass || '');
  const [customerPhone, setCustomerPhone] = useState(currentStudent?.phone || '');
  const [pickupTime, setPickupTime] = useState(PICKUP_TIME_OPTIONS[0].label);
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [formError, setFormError] = useState('');

  // Sync student data to checkout form
  React.useEffect(() => {
    if (currentStudent) {
      setCustomerName(currentStudent.name);
      setCustomerClass(currentStudent.studentClass);
      if (currentStudent.phone) setCustomerPhone(currentStudent.phone);
    }
  }, [currentStudent]);

  // Active and past orders
  const activeOrders = orders.filter((o) => o.orderStatus !== 'SELESAI' && o.orderStatus !== 'DIBATALKAN');
  const pastOrders = orders.filter((o) => o.orderStatus === 'SELESAI' || o.orderStatus === 'DIBATALKAN');

  // Filtered products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'Semua' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = !onlyAvailable || (prod.isAvailable && prod.stock > 0);

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!settings.isOpen) {
      setFormError('Kantin sedang tutup saat ini.');
      return;
    }

    if (cart.length === 0) {
      setFormError('Keranjang belanja Anda masih kosong.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Harap isi Nama Siswa');
      return;
    }

    if (!customerClass.trim()) {
      setFormError('Harap isi Kelas / Jurusan (Contoh: XII RPL 1)');
      return;
    }

    if (paymentMethod === 'QRIS') {
      onOpenQRIS(cartTotal, {
        customerName: customerName.trim(),
        customerClass: customerClass.trim(),
        customerPhone: customerPhone.trim(),
        pickupTime,
        orderNotes: orderNotes.trim(),
        paymentMethod: 'QRIS',
      });
    } else {
      const newOrder = createOrder({
        customerName: customerName.trim(),
        customerClass: customerClass.trim(),
        customerPhone: customerPhone.trim(),
        pickupTime,
        orderNotes: orderNotes.trim(),
        paymentMethod: 'CASH',
      });
      onOrderCreated(newOrder);
      setActiveTab('ORDERS');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Student Dashboard Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left: Logo & Back to Portal Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onBackToLanding}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Kembali ke Halaman Awal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <img
                  src="/yummy.jpg"
                  alt="YummyGo!"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                  Yummy<span className="text-emerald-600">Go!</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden lg:block ml-1">
                  Dashboard Siswa
                </span>
              </div>
            </div>

            {/* Center: 3 Clean Integrated Tabs (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('MENU')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'MENU'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5 shrink-0" />
                <span>Daftar Menu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CART')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'CART'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>Keranjang</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ORDERS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ORDERS'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Pesanan Saya</span>
                {activeOrders.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                    {activeOrders.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Right: Info Siswa (Tanpa Foto Profil) */}
            <div className="flex items-center gap-2 shrink-0">
              {currentStudent ? (
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                  <div className="text-right max-w-[120px] sm:max-w-[160px] truncate">
                    <p className="font-bold text-slate-800 leading-tight truncate">{currentStudent.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{currentStudent.studentClass}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logoutStudent();
                      onBackToLanding();
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Keluar / Ganti Siswa"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Masuk Siswa
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Tab Navigation Bar (Row 2, Mobile Only) */}
        <div className="md:hidden px-3 pb-2 pt-0.5 border-t border-slate-100">
          <nav className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold w-full">
            <button
              type="button"
              onClick={() => setActiveTab('MENU')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'MENU'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 shrink-0" />
              <span>Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CART')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'CART'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ORDERS')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'ORDERS'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Pesanan</span>
              {activeOrders.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                  {activeOrders.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area based on Tab */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
        
        {/* ================= TAB 1: DAFTAR MENU ================= */}
        {activeTab === 'MENU' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Welcome banner strip for student */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Daftar Menu Makanan &amp; Minuman
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih menu favoritmu, tambahkan ke keranjang, lalu tentukan jam istirahat untuk pengambilan di loket.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {cartCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('CART')}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Lihat Keranjang ({cartCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari makanan atau minuman kantin..."
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

                {/* Only available checkbox */}
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none shrink-0 px-2">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
                  />
                  <span>Hanya yang tersedia</span>
                </label>

              </div>

              {/* Category tabs: Responsive full-width grid on mobile, flex on desktop */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full sm:flex sm:items-center sm:w-auto pt-1">
                {CATEGORIES.map((cat) => {
                  const count = cat === 'Semua' 
                    ? products.length 
                    : products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Menu Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8">
                <p className="font-bold text-slate-800 text-sm">Tidak ada menu yang sesuai</p>
                <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                    setOnlyAvailable(false);
                  }}
                  className="mt-4 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg"
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

            {/* Floating Quick Cart Bar when items are selected */}
            {cartCount > 0 && (
              <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('CART')}
                  className="pointer-events-auto w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 px-4 sm:px-5 rounded-2xl shadow-xl shadow-emerald-900/20 flex items-center justify-between font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] sm:text-xs font-black">
                      {cartCount}
                    </span>
                    <span>Keranjang Belanja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{formatRupiah(cartTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: KERANJANG BELANJA & CHECKOUT ================= */}
        {activeTab === 'CART' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Keranjang Belanja</h1>
                <p className="text-xs text-slate-500">Periksa pesanan dan tentukan waktu pengambilan</p>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Kosongkan Keranjang
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-800">Keranjang Masih Kosong</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Belum ada menu yang dipilih. Silakan kembali ke tab Daftar Menu untuk memilih makanan.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('MENU')}
                  className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Buka Daftar Menu</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Cart Items List */}
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    Daftar Pesanan ({cart.length} menu)
                  </h3>

                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-white rounded-xl border border-slate-200 p-3.5 flex gap-3 items-center justify-between shadow-2xs"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                        />

                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {formatRupiah(item.product.price)}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
                              "{item.notes}"
                            </p>
                          )}
                        </div>

                        {/* Stepper controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pick up time selection */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 mt-4">
                    <label className="block text-xs font-bold text-slate-800">
                      Pilih Jam Pengambilan di Loket
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PICKUP_TIME_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-2 ${
                            pickupTime === opt.label
                              ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="pickupTime"
                            value={opt.label}
                            checked={pickupTime === opt.label}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="font-bold text-[11px]">{opt.label.split('(')[0]}</p>
                            <p className="text-[10px] text-slate-500">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Checkout Info & Payment Form */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Student Details Form */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      Identitas Pemesan
                    </h3>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nama Lengkap Siswa <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Kelas / Jurusan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerClass}
                          onChange={(e) => setCustomerClass(e.target.value)}
                          placeholder="XII RPL 1"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          No. HP / WA
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0812xxxx"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Catatan Khusus ke Kantin
                      </label>
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Sambal dipisah / kuah banyakin..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Pilihan Metode Pembayaran
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CASH')}
                        className={`p-2.5 rounded-xl border text-left transition-colors ${
                          paymentMethod === 'CASH'
                            ? 'border-emerald-600 bg-emerald-50/60 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs text-slate-900 mb-0.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">Tunai / Cash</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Bayar di kasir loket saat ambil</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('QRIS')}
                        className={`p-2.5 rounded-xl border text-left transition-colors ${
                          paymentMethod === 'QRIS'
                            ? 'border-emerald-600 bg-emerald-50/60 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs text-slate-900 mb-0.5">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">QRIS Kantin</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Scan digital dari e-wallet/bank</p>
                      </button>
                    </div>
                  </div>

                  {/* Error banner */}
                  {formError && (
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                      {formError}
                    </p>
                  )}

                  {/* Price Breakdown & Submit */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Subtotal Menu</span>
                      <span className="font-semibold">{formatRupiah(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Biaya Layanan</span>
                      <span className="font-semibold text-emerald-600">Gratis (Rp 0)</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Biaya</span>
                      <span className="text-emerald-600">{formatRupiah(cartTotal)}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{paymentMethod === 'QRIS' ? 'Lanjut ke QRIS Kantin' : 'Konfirmasi Pesanan Tunai'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </form>
            )}

          </div>
        )}

        {/* ================= TAB 3: PESANAN & STATUS ANTREAN ================= */}
        {activeTab === 'ORDERS' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="border-b border-slate-200 pb-3">
              <h1 className="text-xl font-bold text-slate-900">Pesanan &amp; Antrean Saya</h1>
              <p className="text-xs text-slate-500">Pantau proses pembuatan makanan dan nomor tiket antrean</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-base text-slate-800">Belum Ada Pesanan</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Anda belum pernah memesan makanan. Silakan pesan menu di tab Daftar Menu.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('MENU')}
                  className="mt-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg inline-flex items-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Pesan Menu Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const badge = getStatusBadge(ord.orderStatus);
                  const isReady = ord.orderStatus === 'SIAP_DIAMBIL';

                  return (
                    <div
                      key={ord.id}
                      className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                        isReady ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Antrean</span>
                            <p className="font-black text-lg text-slate-900">#{ord.orderNumber}</p>
                          </div>
                          <div className="border-l border-slate-200 pl-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">PIN Ambil</span>
                            <p className="font-mono font-bold text-base text-emerald-700">{ord.pickupPin}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                            {badge.label}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(ord.createdAt)}</p>
                        </div>
                      </div>

                      {/* Ready banner alert */}
                      {isReady && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 font-semibold">
                          <span>Makanan Anda sudah siap di loket! Datang dan tunjukkan PIN {ord.pickupPin}.</span>
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">Loket Utama</span>
                        </div>
                      )}

                      {/* Items details */}
                      <div className="py-3 text-xs space-y-1.5 text-slate-600">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Jam Ambil: <strong className="text-slate-700">{ord.pickupTime}</strong></span>
                          <span>Metode: <strong className="text-slate-700">{ord.paymentMethod === 'QRIS' ? 'QRIS (Lunas)' : 'Tunai di Loket'}</strong></span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.product.name}</span>
                              <span className="font-medium">{formatRupiah(it.product.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                          <span>Total</span>
                          <span className="text-emerald-700">{formatRupiah(ord.totalPrice)}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />

    </div>
  );
};

