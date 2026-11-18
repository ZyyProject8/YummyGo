import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

interface QRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderNumber: string;
  onPaymentSuccess: () => void;
}

export const QRISModal: React.FC<QRISModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderNumber,
  onPaymentSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setIsProcessing(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const handleCopyNmid = () => {
    navigator.clipboard?.writeText('ID1020083921932');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pembayaran QRIS Kantin</h3>
              <p className="text-xs text-slate-400">Scan melalui aplikasi e-Wallet atau M-Banking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center">
          
          {/* Official QRIS Card Styling */}
          <div className="w-full max-w-xs border-2 border-red-500 rounded-xl p-4 bg-white shadow-md relative">
            
            {/* QRIS Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-red-600">QRIS</span>
                <span className="text-[10px] font-bold text-slate-500 tracking-tight">PEMBAYARAN DIGITAL</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                GPN
              </span>
            </div>

            {/* Merchant Details */}
            <div className="text-center mb-3">
              <p className="font-extrabold text-sm text-slate-900 uppercase">YUMMYGO KANTIN SEKOLAH</p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <span>NMID: ID1020083921932</span>
                <button
                  type="button"
                  onClick={handleCopyNmid}
                  className="hover:text-slate-800"
                  title="Salin NMID"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Simulated Vector QR Code */}
            <div className="relative mx-auto w-52 h-52 bg-white p-2 rounded-lg border border-slate-200 shadow-inner flex items-center justify-center">
              {/* Detailed crisp QR code SVG matrix representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                {/* Corner Finder 1 */}
                <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="13" y="13" width="12" height="12" rx="1" />
                {/* Corner Finder 2 */}
                <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="75" y="13" width="12" height="12" rx="1" />
                {/* Corner Finder 3 */}
                <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="13" y="75" width="12" height="12" rx="1" />
                {/* Grid modules simulation */}
                <rect x="38" y="7" width="5" height="5" />
                <rect x="47" y="10" width="5" height="5" />
                <rect x="56" y="7" width="5" height="5" />
                <rect x="42" y="18" width="5" height="5" />
                <rect x="51" y="22" width="5" height="5" />
                <rect x="7" y="38" width="5" height="5" />
                <rect x="18" y="42" width="5" height="5" />
                <rect x="25" y="38" width="5" height="5" />
                <rect x="38" y="38" width="6" height="6" />
                <rect x="56" y="38" width="6" height="6" />
                <rect x="68" y="42" width="5" height="5" />
                <rect x="85" y="38" width="6" height="6" />
                <rect x="42" y="48" width="7" height="7" />
                <rect x="52" y="55" width="6" height="6" />
                <rect x="65" y="52" width="6" height="6" />
                <rect x="82" y="48" width="8" height="5" />
                <rect x="38" y="68" width="6" height="6" />
                <rect x="48" y="72" width="5" height="5" />
                <rect x="58" y="68" width="6" height="6" />
                <rect x="68" y="75" width="6" height="6" />
                <rect x="78" y="70" width="6" height="6" />
                <rect x="88" y="80" width="6" height="6" />
                <rect x="45" y="85" width="6" height="6" />
                <rect x="58" y="88" width="6" height="6" />
                <rect x="72" y="88" width="6" height="6" />
              </svg>

              {/* Center Logo badge */}
              <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center p-0.5 overflow-hidden">
                <img src="/yummy.jpg" alt="YummyGo! Logo" className="w-full h-full object-cover rounded" />
              </div>
            </div>

            {/* Total Nominal Highlight */}
            <div className="mt-3 pt-2 border-t border-dashed border-slate-200">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide">Total Pembayaran</p>
              <p className="text-xl font-black text-emerald-600">{formatRupiah(amount)}</p>
              <p className="text-[10px] text-slate-400">Pesanan #{orderNumber}</p>
            </div>

          </div>

          {/* Countdown Timer */}
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Selesaikan dalam: </span>
            <span className="font-bold text-slate-800 tabular-nums">{formattedTime}</span>
          </div>

          {/* Supported Apps List */}
          <p className="mt-2 text-[11px] text-slate-400">
            Dukung: GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, dll.
          </p>

          {/* Action Simulation Button */}
          <div className="w-full mt-5 space-y-2">
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-xs transition-colors"
            >
              Batal / Ubah Metode Pembayaran
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
