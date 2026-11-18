import React, { useState } from 'react';
import { X, Clock, CheckCircle2, ChefHat, PackageCheck, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatRupiah, formatDateTime, getStatusBadge } from '../utils/helpers';
import { useCanteen } from '../context/CanteenContext';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder?: Order | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  selectedOrder,
}) => {
  const { orders } = useCanteen();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

  if (!isOpen) return null;

  const activeOrders = orders.filter((o) => o.orderStatus !== 'SELESAI' && o.orderStatus !== 'DIBATALKAN');
  const pastOrders = orders.filter((o) => o.orderStatus === 'SELESAI' || o.orderStatus === 'DIBATALKAN');

  const displayedOrders = activeTab === 'ACTIVE' ? activeOrders : pastOrders;

  // Timeline step helper
  const getTimelineStep = (status: OrderStatus) => {
    switch (status) {
      case 'MENUNGGU_KONFIRMASI':
        return 1;
      case 'SEDANG_DISIAPKAN':
        return 2;
      case 'SIAP_DIAMBIL':
        return 3;
      case 'SELESAI':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Pesanan & Antrean Saya</h2>
              <p className="text-xs text-slate-400">Pantau progres makanan dan tiket pengambilan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Pesanan Aktif vs Riwayat Selesai */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'ACTIVE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Pesanan Sedang Diproses</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeOrders.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
              {activeOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'HISTORY'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Riwayat Selesai</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-600">
              {pastOrders.length}
            </span>
          </button>
        </div>

        {/* Orders list container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {displayedOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">
                {activeTab === 'ACTIVE' ? 'Tidak ada pesanan yang sedang diproses.' : 'Belum ada riwayat pesanan selesai.'}
              </p>
              <p className="text-xs text-slate-400">
                {activeTab === 'ACTIVE' ? 'Silakan pesan makanan favoritmu di menu utama!' : 'Pesanan yang telah kamu ambil akan muncul di sini.'}
              </p>
            </div>
          ) : (
            displayedOrders.map((ord) => {
              const badge = getStatusBadge(ord.orderStatus);
              const currentStep = getTimelineStep(ord.orderStatus);

              return (
                <div
                  key={ord.id}
                  className={`border rounded-2xl p-5 shadow-sm transition-all ${
                    ord.orderStatus === 'SIAP_DIAMBIL'
                      ? 'border-emerald-400 bg-emerald-50/30 ring-2 ring-emerald-400/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Top Bar: Order ID, Badge, Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Antrean</span>
                        <h3 className="text-xl font-black text-slate-900">#{ord.orderNumber}</h3>
                      </div>
                      <div className="border-l border-slate-200 pl-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">PIN Ambil</span>
                        <p className="text-base font-extrabold text-emerald-600 font-mono">{ord.pickupPin}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                        <span className={`w-2 h-2 rounded-full ${badge.dotColor} ${ord.orderStatus === 'SIAP_DIAMBIL' ? 'animate-ping' : ''}`} />
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDateTime(ord.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Step Progress Tracker (for Active Orders) */}
                  {ord.orderStatus !== 'DIBATALKAN' && (
                    <div className="py-4">
                      <div className="grid grid-cols-4 relative text-center text-xs">
                        
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-slate-200 -z-0">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-500"
                            style={{
                              width:
                                currentStep === 1
                                  ? '0%'
                                  : currentStep === 2
                                  ? '33%'
                                  : currentStep === 3
                                  ? '66%'
                                  : '100%',
                            }}
                          />
                        </div>

                        {/* Step 1: Diterima */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= 1 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-500'}`}>
                            1
                          </div>
                          <span className="mt-1.5 font-bold text-[11px] text-slate-700">Diterima</span>
                        </div>

                        {/* Step 2: Dimasak */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= 2 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-500'}`}>
                            <ChefHat className="w-4 h-4" />
                          </div>
                          <span className="mt-1.5 font-bold text-[11px] text-slate-700">Dimasak</span>
                        </div>

                        {/* Step 3: Siap Diambil */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= 3 ? 'bg-emerald-600 text-white shadow animate-bounce' : 'bg-slate-200 text-slate-500'}`}>
                            <PackageCheck className="w-4 h-4" />
                          </div>
                          <span className={`mt-1.5 font-bold text-[11px] ${currentStep === 3 ? 'text-emerald-700 font-extrabold' : 'text-slate-700'}`}>
                            Siap Diambil
                          </span>
                        </div>

                        {/* Step 4: Selesai */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= 4 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 text-slate-500'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="mt-1.5 font-bold text-[11px] text-slate-700">Selesai</span>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Ready for pickup special banner */}
                  {ord.orderStatus === 'SIAP_DIAMBIL' && (
                    <div className="mt-2 mb-3 p-3 bg-emerald-600 text-white rounded-xl flex items-center justify-between text-xs font-bold animate-pulse">
                      <span>Makanamu sudah siap di loket! Datang dan tunjukkan PIN {ord.pickupPin}.</span>
                      <span className="bg-white text-emerald-800 px-2 py-1 rounded-md text-[11px]">
                        Loket Utama
                      </span>
                    </div>
                  )}

                  {/* Order Details Body */}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 mt-2">
                    <div className="flex justify-between text-slate-500">
                      <span>Waktu Pengambilan:</span>
                      <span className="font-bold text-slate-800">{ord.pickupTime}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Metode Pembayaran:</span>
                      <span className="font-bold text-slate-800">
                        {ord.paymentMethod === 'QRIS' ? 'QRIS Kantin (Lunas)' : 'Tunai di Kasir (Bayar saat ambil)'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span>{i.quantity}x {i.product.name}</span>
                          <span className="font-semibold text-slate-900">{formatRupiah(i.product.price * i.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                      <span>Total Biaya</span>
                      <span className="text-emerald-600">{formatRupiah(ord.totalPrice)}</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
