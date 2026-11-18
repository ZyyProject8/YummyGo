import React from 'react';
import { CheckCircle2, Clock, MapPin, Receipt, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { formatRupiah, formatDateTime } from '../utils/helpers';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen?: boolean;
  onClose: () => void;
  onTrackOrder?: (order: Order) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen = true,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
        
        {/* Success Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold">Pesanan Berhasil Dibuat!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Simpan nomor antrean ini untuk ditunjukkan saat mengambil pesanan
          </p>
        </div>

        {/* Boarding Pass / Ticket Body */}
        <div className="p-6">
          
          {/* Ticket Card */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 relative overflow-hidden">
            
            {/* Top row: Order Number & PIN */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-300">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Nomor Antrean
                </span>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  #{order.orderNumber}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  PIN Pengambilan
                </span>
                <p className="text-2xl font-black text-emerald-600 tracking-widest font-mono">
                  {order.pickupPin}
                </p>
              </div>
            </div>

            {/* Middle: Details */}
            <div className="py-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pemesan:</span>
                <span className="font-semibold text-slate-800">{order.customerName} ({order.customerClass})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Waktu Ambil:
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {order.pickupTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Loket:
                </span>
                <span className="font-semibold text-slate-800">Loket Kantin Utama</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-semibold">
                  {order.paymentMethod === 'QRIS' ? (
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      QRIS (Lunas)
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                      Tunai di Loket (Bayar saat ambil)
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Ordered Items summary */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Item Dipesan:</span>
              <ul className="mt-1 space-y-1 text-xs text-slate-700">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-medium text-slate-500">{formatRupiah(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Biaya:</span>
                <span className="text-emerald-600">{formatRupiah(order.totalPrice)}</span>
              </div>
            </div>

          </div>

          {/* Note reminder */}
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p>
              Tunjukkan nomor <strong>#{order.orderNumber}</strong> atau sebutkan PIN <strong>{order.pickupPin}</strong> kepada penjaga loket saat jam istirahat untuk mengambil makananmu!
            </p>
          </div>

          {/* Action button: Langsung Oke saja gausah ada pantau */}
          <div className="mt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all text-center cursor-pointer"
            >
              Oke
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
