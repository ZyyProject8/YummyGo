import React from 'react';
import { MapPin, Clock, ShieldCheck, Check } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

export const CanteenLocationSection: React.FC = () => {
  const { settings } = useCanteen();

  return (
    <section id="lokasi-kantin" className="my-10 scroll-mt-24 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Informasi Loket &amp; Jam Operasional
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pengambilan makanan dilayani di loket khusus untuk siswa yang telah memesan online.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Lokasi Pengambilan:</p>
                <p className="text-slate-600 mt-0.5">{settings.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Jam Operasional:</p>
                <p className="text-slate-600 mt-0.5">
                  Senin – Jumat: Pukul {settings.openTime} – {settings.closeTime} WIB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info: Standar Mutu */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5 text-xs text-slate-600">
            <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standar Kebersihan &amp; Pelayanan</span>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Bahan makanan dipilih segar dan dimasak higienis setiap hari.</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Penyajian menggunakan wadah food-grade yang bersih.</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Mendukung pembayaran Tunai (Cash) di kasir dan QRIS standar nasional.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-400">
            Kantin Pintar Era Digital
          </div>
        </div>

      </div>
    </section>
  );
};
