import React from 'react';
import { ShoppingBag, Clock, CreditCard, TicketCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Pilih Menu',
      desc: 'Pilih makanan dan minuman yang diinginkan dari daftar menu kantin.',
      icon: <ShoppingBag className="w-5 h-5 text-slate-700" />,
    },
    {
      num: '2',
      title: 'Pilih Jam Ambil',
      desc: 'Tentukan waktu istirahat (Istirahat 1, Istirahat 2, atau segera).',
      icon: <Clock className="w-5 h-5 text-slate-700" />,
    },
    {
      num: '3',
      title: 'Metode Bayar',
      desc: 'Pilih bayar tunai di kasir saat ambil atau gunakan QRIS digital.',
      icon: <CreditCard className="w-5 h-5 text-slate-700" />,
    },
    {
      num: '4',
      title: 'Ambil di Loket',
      desc: 'Tunjukkan Nomor Antrean / PIN ke loket kantin saat jam istirahat tiba.',
      icon: <TicketCheck className="w-5 h-5 text-slate-700" />,
    },
  ];

  return (
    <section id="cara-pesan" className="my-10 scroll-mt-24">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Alur Pemesanan &amp; Pengambilan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Panduan ringkas pemesanan makanan kantin sekolah secara online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Langkah {item.num}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
