import React from 'react';
import { GraduationCap, Store, Clock, MapPin, CreditCard, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

interface LandingPageProps {
  onEnterStudent: () => void;
  onEnterCanteen: () => void;
  onOpenStudentAuth?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudent,
  onEnterCanteen,
  onOpenStudentAuth,
}) => {
  const { settings, currentStudent, isAdminAuthenticated } = useCanteen();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Simple Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/yummy.jpg"
              alt="YummyGo! Logo"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                Yummy<span className="text-emerald-600">Go!</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Kantin Pintar Sekolah</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="hidden sm:inline font-semibold text-slate-700">
              {settings.isOpen ? 'Kantin Buka' : 'Kantin Tutup'}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>{settings.openTime} – {settings.closeTime} WIB</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Portal Selection */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full flex flex-col justify-center">
        
        {/* Title & Welcome */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            Sistem Pemesanan Mandiri Kantin Sekolah
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Selamat Datang di YummyGo!
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Pesan makanan &amp; minuman favoritmu secara online sebelum jam istirahat. Begitu bel berbunyi, makanan siap diambil langsung di loket kantin.
          </p>
        </div>

        {/* 2 Big Clear Portals (Siswa vs Pengelola Kantin) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          
          {/* Card 1: Portal Siswa */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">Dashboard Siswa</h2>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Pembeli
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-6">
                Buka daftar menu kantin lengkap, masukkan ke keranjang belanja, tentukan jam istirahat pengambilan, dan pantau nomor antrean makananmu.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onEnterStudent}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Masuk Dashboard Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Portal Pengelola Kantin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mb-5">
                <Store className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">Dashboard Kantin</h2>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Penjual / Staf
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-6">
                Khusus pihak penjual untuk mengelola stok makanan, menambah menu baru, memvalidasi nomor PIN antrean siswa, dan memproses pesanan di dapur.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Dilindungi kata sandi staf kantin</span>
              </div>

              <button
                type="button"
                onClick={onEnterCanteen}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>{isAdminAuthenticated ? 'Buka Dashboard Kantin' : 'Masuk Dashboard Kantin'}</span>
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Canteen Summary Info Pills */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto w-full text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Jam Istirahat</p>
              <p className="text-slate-500">Istirahat 1 (09:45) &amp; 2 (12:00)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Loket Pengambilan</p>
              <p className="text-slate-500 truncate">{settings.pickupLocation.split('(')[0]}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Metode Bayar</p>
              <p className="text-slate-500">Tunai di Kasir &amp; QRIS Digital</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-400 text-center">
        <p>© {new Date().getFullYear()} YummyGo! — Kantin Pintar Sekolah</p>
      </footer>

    </div>
  );
};
