export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';
}

export function generateOrderNumber(): string {
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `YG-${randomNum}`;
}

export function generatePickupPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'MENUNGGU_KONFIRMASI':
      return {
        label: 'Menunggu Konfirmasi',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500'
      };
    case 'SEDANG_DISIAPKAN':
      return {
        label: 'Sedang Disiapkan',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-500'
      };
    case 'SIAP_DIAMBIL':
      return {
        label: 'Siap Diambil di Loket',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-300',
        dotColor: 'bg-emerald-500'
      };
    case 'SELESAI':
      return {
        label: 'Selesai',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-700',
        borderColor: 'border-slate-200',
        dotColor: 'bg-slate-400'
      };
    case 'DIBATALKAN':
      return {
        label: 'Dibatalkan',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200',
        dotColor: 'bg-rose-500'
      };
    default:
      return {
        label: status,
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-200',
        dotColor: 'bg-slate-400'
      };
  }
}
