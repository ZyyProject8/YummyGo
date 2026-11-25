import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Clock, User, Sparkles, CreditCard, Banknote, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';
import { PICKUP_TIME_OPTIONS } from '../data/mockData';
import { formatRupiah } from '../utils/helpers';
import { Order, PaymentMethod } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQRIS: (amount: number, orderData: {
    customerName: string;
    customerClass: string;
    customerPhone?: string;
    pickupTime: string;
    orderNotes?: string;
    paymentMethod: 'QRIS';
  }) => void;
  onOrderCreated: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenQRIS,
  onOrderCreated,
}) => {
  const { cart, cartTotal, updateCartItemQuantity, removeFromCart, clearCart, createOrder, settings, currentStudent } = useCanteen();

  const [customerName, setCustomerName] = useState(currentStudent?.name || '');
  const [customerClass, setCustomerClass] = useState(currentStudent?.studentClass || '');
  const [customerPhone, setCustomerPhone] = useState(currentStudent?.phone || '');
  const [pickupTime, setPickupTime] = useState(PICKUP_TIME_OPTIONS[0].label);
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [formError, setFormError] = useState('');

  // Keep synced with current student
  React.useEffect(() => {
    if (currentStudent) {
      setCustomerName(currentStudent.name);
      setCustomerClass(currentStudent.studentClass);
      if (currentStudent.phone) setCustomerPhone(currentStudent.phone);
    }
  }, [currentStudent, isOpen]);

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!settings.isOpen) {
      setFormError('Maaf, kantin saat ini sedang tutup.');
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
      setFormError('Harap isi Kelas / Jurusan');
      return;
    }

    if (paymentMethod === 'QRIS') {
      // Hand over to QRIS flow
      onOpenQRIS(cartTotal, {
        customerName,
        customerClass,
        customerPhone,
        pickupTime,
        orderNotes,
        paymentMethod: 'QRIS',
      });
      onClose();
    } else {
      // CASH payment directly completes order
      const newOrder = createOrder({
        customerName,
        customerClass,
        customerPhone,
        pickupTime,
        orderNotes,
        paymentMethod: 'CASH',
      });
      onOrderCreated(newOrder);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900">Keranjang Pesanan</h2>
                <p className="text-xs text-slate-500">{cart.length} menu dipilih</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 hover:bg-rose-50 rounded"
                >
                  Kosongkan
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Contents */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Keranjangmu Masih Kosong</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Pilih menu lezat favoritmu dari katalog kantin untuk memesan terlebih dahulu.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden">
              
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Warning if canteen is closed */}
                {!settings.isOpen && (
                  <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Kantin sedang tutup saat ini. Pesanan tidak dapat diproses.</span>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Daftar Menu
                  </h3>
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors ml-2"
                            title="Hapus menu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {formatRupiah(item.product.price)}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5 truncate">
                            Catatan: "{item.notes}"
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                          <span className="text-[11px] text-slate-500">Jumlah:</span>
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup Time Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Pilih Waktu Pengambilan di Kantin
                  </label>
                  <div className="space-y-2">
                    {PICKUP_TIME_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          pickupTime === opt.label
                            ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-semibold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
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
                          <p className="font-bold">{opt.label}</p>
                          <p className="text-[11px] text-slate-500 font-normal">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Student Info Form */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Data Siswa Pemesan
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nama Lengkap Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Kelas / Jurusan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan kelas / jurusan"
                        value={customerClass}
                        onChange={(e) => setCustomerClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        No. WA (Opsional)
                      </label>
                      <input
                        type="tel"
                        placeholder="0812xxxxxxx"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Catatan Tambahan untuk Kantin
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Cabai dipisah / saus banyakin"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Pilih Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* CASH */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Banknote className={`w-4 h-4 ${paymentMethod === 'CASH' ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <span className="font-bold text-xs text-slate-900">Cash / Tunai</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Bayar langsung di kasir loket saat mengambil makanan.
                      </p>
                    </button>

                    {/* QRIS */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('QRIS')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === 'QRIS'
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className={`w-4 h-4 ${paymentMethod === 'QRIS' ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <span className="font-bold text-xs text-slate-900">QRIS Kantin</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Scan QRIS dari e-wallet/bank. Bebas ribet uang kembalian.
                      </p>
                    </button>

                  </div>
                </div>

                {/* Form Error Banner */}
                {formError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg font-medium">
                    {formError}
                  </p>
                )}

              </div>

              {/* Bottom Sticky Checkout Bar */}
              <div className="p-5 bg-white border-t border-slate-200 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal Menu</span>
                    <span className="font-semibold">{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan Kantin Pintar</span>
                    <span className="font-semibold text-emerald-600">Gratis (Rp 0)</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Pembayaran</span>
                    <span className="text-emerald-600 text-base">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!settings.isOpen}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{paymentMethod === 'QRIS' ? 'Lanjut ke QRIS Kantin' : 'Pesan & Ambil di Loket'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
