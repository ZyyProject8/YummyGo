import React, { useState } from 'react';
import { LayoutDashboard, Utensils, Settings, DollarSign, ShoppingCart, Clock, AlertTriangle, Search, CheckCircle2, QrCode, ArrowLeft, LogOut } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';
import { SettingsTab } from './SettingsTab';
import { formatRupiah } from '../../utils/helpers';

interface CanteenDashboardProps {
  onBackToLanding?: () => void;
}

export const CanteenDashboard: React.FC<CanteenDashboardProps> = ({ onBackToLanding }) => {
  const { orders, products, verifyPickup, logoutAdmin, currentStaff } = useCanteen();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PRODUCTS' | 'SETTINGS'>('ORDERS');
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  // Financial and operational metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'SUDAH_BAYAR' && o.orderStatus !== 'DIBATALKAN')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const pendingCookingCount = orders.filter(
    (o) => o.orderStatus === 'MENUNGGU_KONFIRMASI' || o.orderStatus === 'SEDANG_DISIAPKAN'
  ).length;

  const readyPickupCount = orders.filter((o) => o.orderStatus === 'SIAP_DIAMBIL').length;

  const lowStockProductsCount = products.filter((p) => p.stock <= 5 || !p.isAvailable).length;

  const handleVerifyPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupCodeInput.trim()) return;

    const res = verifyPickup(pickupCodeInput);
    setVerifyResult(res);
    if (res.success) {
      setPickupCodeInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header for Canteen */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Kembali ke Halaman Awal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <img src="/yummy.jpg" alt="Logo" className="w-7 h-7 rounded-lg object-cover border border-slate-200" />
          <span className="font-bold text-slate-900 text-sm">YummyGo! • Panel Pengelola Kantin</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Login sebagai: <strong className="text-slate-800">{currentStaff?.name || 'Staf Kantin'}</strong>
          </span>
          <button
            type="button"
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Staf</span>
          </button>
        </div>
      </div>

      {/* Canteen Top Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Panel Pengelola Kantin &amp; Kasir
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Dashboard Dapur &amp; Pesanan</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola antrean pesanan online siswa, validasi pengambilan makanan, dan kelola stok secara langsung.
          </p>
        </div>

        {/* Quick Pickup PIN Verification Box */}
        <form
          onSubmit={handleVerifyPickup}
          className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md w-full"
        >
          <div className="relative flex-1">
            <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="PIN (4 digit) / No. Antrean..."
              value={pickupCodeInput}
              onChange={(e) => setPickupCodeInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
          >
            Verifikasi
          </button>
        </form>
      </div>

      {/* Verification notification banner */}
      {verifyResult && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold animate-fade-in ${
            verifyResult.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {verifyResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{verifyResult.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setVerifyResult(null)}
            className="font-bold underline ml-4 hover:opacity-75"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Omzet */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase truncate">Pendapatan Masuk</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              {formatRupiah(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase truncate">Total Pesanan</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              {orders.length} <span className="text-xs font-normal text-slate-400">pesanan</span>
            </p>
          </div>
        </div>

        {/* Needs cooking / preparing */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase truncate">Perlu Dimasak</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              {pendingCookingCount} <span className="text-xs font-normal text-slate-400">antrean</span>
            </p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase truncate">Stok Menipis / Habis</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              {lowStockProductsCount} <span className="text-xs font-normal text-slate-400">menu</span>
            </p>
          </div>
        </div>

      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'ORDERS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Pesanan & Layar Dapur</span>
          {pendingCookingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white animate-pulse">
              {pendingCookingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRODUCTS')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'PRODUCTS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Kelola Menu & Stok</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SETTINGS')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'SETTINGS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Kantin</span>
        </button>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'ORDERS' && <OrdersTab />}
        {activeTab === 'PRODUCTS' && <ProductsTab />}
        {activeTab === 'SETTINGS' && <SettingsTab />}
      </div>

    </div>
  );
};
