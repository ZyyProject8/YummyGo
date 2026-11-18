import React, { useState } from 'react';
import { Store, Clock, MapPin, Bell, ShieldCheck, Check, RotateCcw } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../../data/mockData';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useCanteen();

  const [isOpen, setIsOpen] = useState(settings.isOpen);
  const [stallName, setStallName] = useState(settings.stallName);
  const [openTime, setOpenTime] = useState(settings.openTime);
  const [closeTime, setCloseTime] = useState(settings.closeTime);
  const [pickupLocation, setPickupLocation] = useState(settings.pickupLocation);
  const [announcement, setAnnouncement] = useState(settings.announcement);
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'kantin123');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      isOpen,
      stallName,
      openTime,
      closeTime,
      pickupLocation,
      announcement,
      adminPassword: adminPassword.trim() || 'kantin123',
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda ingin mereset seluruh data menu & pesanan ke data awal demo YummyGo?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs text-slate-700">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Pengaturan Kantin Pintar</h3>
          <p className="text-slate-500">Sesuaikan jam operasional, status buka/tutup, dan lokasi loket</p>
        </div>
        
        {/* Master Open / Close Toggle */}
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-xl border border-slate-200">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={(e) => setIsOpen(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
          <span className="font-bold text-xs text-slate-800">
            {isOpen ? 'Kantin Buka' : 'Kantin Tutup'}
          </span>
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        <div>
          <label className="block font-bold text-slate-800 mb-1">Nama Kantin / Gerai</label>
          <input
            type="text"
            required
            value={stallName}
            onChange={(e) => setStallName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Jam Buka</label>
            <input
              type="text"
              placeholder="07:00"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-800 mb-1">Jam Tutup</label>
            <input
              type="text"
              placeholder="15:30"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1">Lokasi Loket Pengambilan Makanan</label>
          <input
            type="text"
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Loket fisik tempat siswa mengambil pesanan saat jam istirahat tiba.
          </p>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1">Teks Pengumuman Berjalan (Ticker Siswa)</label>
          <textarea
            rows={2}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs resize-none"
          />
        </div>

        {/* Security & Admin Password Section */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <label className="block font-bold text-slate-800">
            Kata Sandi / PIN Staf Pengelola Kantin
          </label>
          <input
            type="text"
            required
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono font-bold"
          />
          <p className="text-[11px] text-slate-500">
            Sandi ini digunakan saat staf kantin membuka panel admin dari halaman depan agar siswa tidak bisa mengubah stok atau harga.
          </p>
        </div>

        {/* QRIS Merchant Info Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Konfigurasi QRIS Kantin</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Merchant: <strong>{settings.qrisMerchantName}</strong> (NMID: {settings.qrisNmid})
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
