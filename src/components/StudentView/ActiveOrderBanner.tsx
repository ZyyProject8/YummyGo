import React from 'react';
import { Clock, ArrowRight, PackageCheck, ChefHat } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

interface ActiveOrderBannerProps {
  onOpenOrders: () => void;
}

export const ActiveOrderBanner: React.FC<ActiveOrderBannerProps> = ({ onOpenOrders }) => {
  const { orders } = useCanteen();

  // Find the most recent active order
  const activeOrder = orders.find(
    (o) => o.orderStatus !== 'SELESAI' && o.orderStatus !== 'DIBATALKAN'
  );

  if (!activeOrder) return null;

  const isReady = activeOrder.orderStatus === 'SIAP_DIAMBIL';

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 z-40 max-w-md animate-fade-in">
      <div
        onClick={onOpenOrders}
        className={`p-4 rounded-2xl shadow-xl border cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between gap-3 ${
          isReady
            ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-400/30'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isReady ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
            {isReady ? <PackageCheck className="w-5 h-5" /> : <ChefHat className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm">
                Antrean #{activeOrder.orderNumber}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isReady ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {isReady ? 'Siap Diambil' : 'Sedang Dimasak'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[220px]">
              PIN: <strong className="text-white font-mono">{activeOrder.pickupPin}</strong> • {activeOrder.pickupTime}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
