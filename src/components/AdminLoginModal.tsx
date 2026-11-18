import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useCanteen();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginAdmin(password);
      setIsSubmitting(false);

      if (res.success) {
        setPassword('');
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
        
        {/* Top Header Decor */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Area Terbatas Staf Kantin
          </span>
          <h2 className="text-xl font-black text-white">Login Pengelola Kantin</h2>
          <p className="text-xs text-slate-300 mt-1">
            Hanya pihak penjual/staf kantin yang berhak masuk untuk mengelola stok, menambah produk, dan memproses pesanan.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi / PIN Pengelola Kantin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Masukkan kata sandi staf..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[11px] text-slate-600">
            <p className="font-semibold text-slate-800">💡 Kata Sandi Default:</p>
            <p className="font-mono font-bold text-emerald-700 text-xs mt-0.5 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
              kantin123
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              (Dapat diubah kapan saja di tab Pengaturan Kantin setelah Anda login)
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Kantin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Kembali ke Menu Siswa
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
