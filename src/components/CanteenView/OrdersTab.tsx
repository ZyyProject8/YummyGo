import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Clock, AlertCircle, Check, X, Banknote, CreditCard, User, Phone, MapPin } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDateTime, getStatusBadge } from '../../utils/helpers';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus } = useCanteen();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'ALL') return true;
    return ord.orderStatus === filterStatus;
  });

  const getCountByStatus = (status: OrderStatus) => {
    return orders.filter((o) => o.orderStatus === status).length;
  };

  return (
    <div className="space-y-6">
      
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setFilterStatus('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'ALL'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Semua Pesanan ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('MENUNGGU_KONFIRMASI')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'MENUNGGU_KONFIRMASI'
              ? 'bg-amber-600 text-white shadow'
              : 'bg-white text-amber-700 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <span>Perlu Diterima</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
            {getCountByStatus('MENUNGGU_KONFIRMASI')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('SEDANG_DISIAPKAN')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'SEDANG_DISIAPKAN'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-700 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <span>Sedang Dimasak</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
            {getCountByStatus('SEDANG_DISIAPKAN')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('SIAP_DIAMBIL')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'SIAP_DIAMBIL'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <span>Siap Diambil di Loket</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {getCountByStatus('SIAP_DIAMBIL')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('SELESAI')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filterStatus === 'SELESAI'
              ? 'bg-slate-700 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Selesai ({getCountByStatus('SELESAI')})
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-base text-slate-800">Tidak Ada Pesanan pada Kategori Ini</h3>
          <p className="text-xs text-slate-500 mt-1">
            Pesanan baru dari siswa akan otomatis masuk secara real-time ke layar ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.orderStatus);

            return (
              <div
                key={ord.id}
                className={`bg-white rounded-2xl border shadow-sm flex flex-col justify-between transition-all overflow-hidden ${
                  ord.orderStatus === 'MENUNGGU_KONFIRMASI'
                    ? 'border-amber-300 ring-2 ring-amber-300/30'
                    : ord.orderStatus === 'SIAP_DIAMBIL'
                    ? 'border-emerald-300 ring-2 ring-emerald-300/30'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Antrean</span>
                    <h4 className="text-lg font-black text-slate-900 leading-tight">#{ord.orderNumber}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">PIN Ambil</span>
                    <p className="font-mono text-sm font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {ord.pickupPin}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 space-y-3 text-xs">
                  
                  {/* Status Badge & Timestamp */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                      {badge.label}
                    </span>
                    <span className="text-slate-400 text-[11px]">{formatDateTime(ord.createdAt)}</span>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{ord.customerName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-semibold">{ord.customerClass}</span>
                    </div>

                    {ord.customerPhone && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{ord.customerPhone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold pt-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Diambil: {ord.pickupTime}</span>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Daftar Menu Dipesan:</p>
                    <div className="space-y-1 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-800">{item.quantity}x </span>
                            <span className="text-slate-700">{item.product.name}</span>
                            {item.notes && (
                              <p className="text-[10px] text-amber-700 italic pl-4">
                                Catatan: "{item.notes}"
                              </p>
                            )}
                          </div>
                          <span className="font-medium text-slate-500 shrink-0 ml-2">
                            {formatRupiah(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General order notes */}
                  {ord.orderNotes && (
                    <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-[11px] text-amber-900">
                      <strong>Catatan Siswa:</strong> "{ord.orderNotes}"
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Metode Bayar</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {ord.paymentMethod === 'QRIS' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                            <CreditCard className="w-3 h-3" />
                            QRIS (Lunas)
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] ${
                            ord.paymentStatus === 'SUDAH_BAYAR'
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-amber-800 bg-amber-100'
                          }`}>
                            <Banknote className="w-3 h-3" />
                            {ord.paymentStatus === 'SUDAH_BAYAR' ? 'Tunai (Sudah Bayar)' : 'Tunai (Belum Bayar)'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                      <p className="text-sm font-extrabold text-slate-900">{formatRupiah(ord.totalPrice)}</p>
                    </div>
                  </div>

                  {/* If CASH and unpaid, provide 1-click toggle to mark paid */}
                  {ord.paymentMethod === 'CASH' && ord.paymentStatus === 'BELUM_BAYAR' && ord.orderStatus !== 'DIBATALKAN' && (
                    <button
                      type="button"
                      onClick={() => updatePaymentStatus(ord.id, 'SUDAH_BAYAR')}
                      className="w-full py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3 text-amber-700" />
                      <span>Terima Pembayaran Tunai di Kasir ({formatRupiah(ord.totalPrice)})</span>
                    </button>
                  )}

                </div>

                {/* Bottom Actions based on status */}
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  {ord.orderStatus === 'MENUNGGU_KONFIRMASI' && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(ord.id, 'DIBATALKAN')}
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors"
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(ord.id, 'SEDANG_DISIAPKAN')}
                        className="flex-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Terima & Mulai Masak</span>
                      </button>
                    </div>
                  )}

                  {ord.orderStatus === 'SEDANG_DISIAPKAN' && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, 'SIAP_DIAMBIL')}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Siap Diambil di Loket</span>
                    </button>
                  )}

                  {ord.orderStatus === 'SIAP_DIAMBIL' && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(ord.id, 'SELESAI')}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesaikan (Makanan Telah Diserahkan)</span>
                    </button>
                  )}

                  {ord.orderStatus === 'SELESAI' && (
                    <div className="text-center py-1 text-slate-400 font-bold text-xs flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Pesanan Telah Selesai</span>
                    </div>
                  )}

                  {ord.orderStatus === 'DIBATALKAN' && (
                    <div className="text-center py-1 text-rose-500 font-bold text-xs flex items-center justify-center gap-1">
                      <X className="w-4 h-4" />
                      <span>Pesanan Dibatalkan</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
