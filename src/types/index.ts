export type ProductCategory = 'Semua' | 'Makanan' | 'Minuman';

export interface Product {
  id: string;
  name: string;
  category: 'Makanan' | 'Minuman';
  price: number;
  description: string;
  image: string;
  stock: number;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  calories?: number;
  rating?: number; // e.g. 4.8
  reviewCount?: number;
  badge?: string; // e.g. "Favorit Siswa", "Promo", "Baru"
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type PaymentMethod = 'CASH' | 'QRIS';
export type PaymentStatus = 'BELUM_BAYAR' | 'SUDAH_BAYAR';

export type OrderStatus = 
  | 'MENUNGGU_KONFIRMASI' // Order placed, waiting for canteen acknowledgment
  | 'SEDANG_DISIAPKAN'     // Cooking / Preparing
  | 'SIAP_DIAMBIL'        // Ready at counter, customer can pick up
  | 'SELESAI'             // Customer picked up & transaction finished
  | 'DIBATALKAN';         // Canceled

export interface Order {
  id: string;
  orderNumber: string; // e.g. "YG-108"
  pickupPin: string;   // 4-digit PIN for verification, e.g. "8492"
  customerName: string;
  customerClass: string;
  customerPhone?: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  pickupTime: string; // e.g. "Istirahat 1 (09:45)", "Istirahat 2 (12:15)", "15 Menit Lagi"
  orderNotes?: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface CanteenSettings {
  stallName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  pickupLocation: string; // e.g. "Loket 2 - Kantin Sejahtera Lantai 1"
  announcement: string;
  qrisMerchantName: string;
  qrisNmid: string;
  adminPassword?: string;
}

export type UserRole = 'LANDING' | 'SISWA' | 'KANTIN';

export interface StudentUser {
  id: string;
  name: string;
  studentClass: string;
  nis?: string;
  phone?: string;
  password?: string;
  avatar?: string;
}

export interface StaffUser {
  id: string;
  username: string;
  name: string;
  roleTitle: string;
}

