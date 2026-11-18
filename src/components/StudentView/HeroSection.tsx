import React from 'react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreMenu, onHowItWorks }) => {
  const { settings, currentStudent, products } = useCanteen();

  // Selected highlight food for a clean visual banner
  const featured = products[0];

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 mb-8 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Status info */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
              <span className={`w-1.5 h-1.5 rounded-full ${settings.isOpen ? 'bg-emerald-600' : 'bg-rose-500'}`} />
              {settings.isOpen ? 'Kantin Buka' : 'Kantin Tutup'}
            </span>

            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {settings.openTime} – {settings.closeTime} WIB
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <span className="flex items-center gap-1 font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {settings.pickupLocation.split('(')[0]}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Pesan Makanan Online, Ambil di Loket Tanpa Antre
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            {currentStudent ? (
              <span className="font-medium text-slate-800">Halo {currentStudent.name.split(' ')[0]}, </span>
            ) : null}
            Pesan makanan &amp; minuman lebih awal sebelum jam istirahat sekolah. Makanan disiapkan tepat waktu dan langsung diambil di loket tanpa perlu mengantre.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreMenu}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Lihat Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onHowItWorks}
              className="px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              Cara Pengambilan
            </button>
          </div>

        </div>

        {/* Right Column: Clean Food Visual */}
        {featured && (
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 group">
              <img
                src={featured.image}
                alt={featured.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                  Menu Unggulan
                </span>
                <p className="font-bold text-sm text-white truncate">{featured.name}</p>
                <p className="text-xs text-slate-200 font-semibold">Rp {featured.price.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Announcement notice */}
      {settings.announcement && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700 shrink-0">Pengumuman:</span>
          <span className="truncate">{settings.announcement}</span>
        </div>
      )}
    </section>
  );
};
