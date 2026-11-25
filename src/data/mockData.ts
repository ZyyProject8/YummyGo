import { Product, CanteenSettings } from '../types';

export const INITIAL_SETTINGS: CanteenSettings = {
  stallName: "Kantin Sekolah",
  isOpen: true,
  openTime: "07:00",
  closeTime: "15:30",
  pickupLocation: "Loket Utama Kantin Sekolah",
  announcement: "Pesan makanan & minuman secara online, ambil langsung di loket saat jam istirahat!",
  qrisMerchantName: "YUMMYGO KANTIN SEKOLAH",
  qrisNmid: "ID1020083921932",
  adminPassword: "kantin123"
};

export const DEFAULT_STUDENTS: any[] = [];

export const INITIAL_PRODUCTS: Product[] = [
  // ================= MAKANAN =================
  {
    id: "prod-1",
    name: "Ayam Geprek Sambal Bawang + Nasi",
    category: "Makanan",
    price: 15000,
    description: "Ayam goreng tepung super renyah digeprek dengan sambal bawang pedas gurih, disajikan lengkap dengan nasi hangat pulen dan lalapan timun segar.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 520,
    rating: 4.9,
    reviewCount: 148,
    badge: "Terlaris 🔥"
  },
  {
    id: "prod-2",
    name: "Ayam Goreng Krispi + Nasi",
    category: "Makanan",
    price: 15000,
    description: "Potongan ayam goreng renyah keemasan berpadu bumbu rempah gurih, disajikan dengan nasi putih hangat, sambal terasi, dan lalapan timun segar.",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    stock: 20,
    isAvailable: true,
    preparationTimeMinutes: 8,
    calories: 490,
    rating: 4.8,
    reviewCount: 95,
    badge: "Favorit Siswa"
  },
  {
    id: "prod-3",
    name: "Nasi Goreng Spesial Telur",
    category: "Makanan",
    price: 13000,
    description: "Nasi goreng racikan bumbu khas kantin dengan suwiran ayam, potongan sosis, kerupuk renyah, dan telur ceplok matang / setengah matang.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    stock: 30,
    isAvailable: true,
    preparationTimeMinutes: 7,
    calories: 460,
    rating: 4.9,
    reviewCount: 182,
    badge: "Rekomendasi"
  },
  {
    id: "prod-4",
    name: "Nasi Telur Ceplok / Dadar Pontianak",
    category: "Makanan",
    price: 10000,
    description: "Nasi hangat pulen dengan telur ceplok krispi disiram bumbu kecap bawang gurih khas Pontianak dan taburan daun bawang harum.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 380,
    rating: 4.8,
    reviewCount: 114,
    badge: "Hemat & Kenyang"
  },
  {
    id: "prod-5",
    name: "Mie Goreng Spesial Telur",
    category: "Makanan",
    price: 10000,
    description: "Mie goreng gurih sedap dengan topping telur orak-arik lembut, sayur sawi hijau segar, potongan bakso, dan taburan bawang goreng renyah.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    stock: 35,
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 410,
    rating: 4.7,
    reviewCount: 88
  },
  {
    id: "prod-6",
    name: "Mie Kuah Telur Sayur",
    category: "Makanan",
    price: 10000,
    description: "Mie kuah kaldu hangat gurih dengan rebusan telur bulat, sayur sawi hijau, cabai rawit iris, dan taburan bawang goreng harum.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 390,
    rating: 4.7,
    reviewCount: 62
  },
  {
    id: "prod-7",
    name: "Risol Mayo Smoked Beef (Isi 2)",
    category: "Makanan",
    price: 7000,
    description: "Risol isi smoked beef gurih, telur rebus cincang lembut, dan saus mayonaise creamy lezat dibalut kulit panir renyah keemasan.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    stock: 30,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 250,
    rating: 4.9,
    reviewCount: 120,
    badge: "Camilan Hits"
  },
  {
    id: "prod-8",
    name: "Aneka Gorengan (Bakwan & Mendoan Isi 3)",
    category: "Makanan",
    price: 5000,
    description: "Paket 3 gorengan renyah hangat (bakwan sayur gurih & tempe mendoan tepung bumbu) disajikan lengkap dengan cabai rawit hijau pedas.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    stock: 40,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 210,
    rating: 4.8,
    reviewCount: 105
  },
  {
    id: "prod-9",
    name: "Cireng Crispy Bumbu Rujak",
    category: "Makanan",
    price: 6000,
    description: "Cireng kenyal gurih dengan luar krispi renyah, disajikan dengan cocolan saus bumbu rujak gula aren pedas manis yang bikin nagih.",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    isAvailable: true,
    preparationTimeMinutes: 3,
    calories: 195,
    rating: 4.8,
    reviewCount: 77
  },

  // ================= MINUMAN =================
  {
    id: "prod-10",
    name: "Nutrisari Jeruk Peras Dingin",
    category: "Minuman",
    price: 4000,
    description: "Minuman sari buah jeruk peras segar bervitamin C tinggi dengan es batu kristal higienis, manis asam pas melegakan dahaga.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    stock: 50,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 80,
    rating: 4.9,
    reviewCount: 140,
    badge: "Segar Dingin ❄️"
  },
  {
    id: "prod-11",
    name: "Nutrisari Sweet Mango Dingin",
    category: "Minuman",
    price: 4000,
    description: "Varian Nutrisari rasa mangga manis segar dengan es batu melimpah, aroma buah harum menyegarkan di jam istirahat.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    stock: 40,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 85,
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: "prod-12",
    name: "Es Teh Manis Melati Jumbo",
    category: "Minuman",
    price: 3500,
    description: "Seduhan teh melati wangi dan pekat khas kantin sekolah dengan manis yang pas disajikan dalam gelas cup jumbo dingin segar.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    stock: 60,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 70,
    rating: 5.0,
    reviewCount: 260,
    badge: "Paling Laris ❄️"
  },
  {
    id: "prod-13",
    name: "Air Mineral Botol 600ml",
    category: "Minuman",
    price: 3000,
    description: "Air mineral pegunungan alami higienis ukuran botol sedang 600ml, tersedia pilihan dingin segar atau suhu ruang biasa.",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    stock: 80,
    isAvailable: true,
    preparationTimeMinutes: 1,
    calories: 0,
    rating: 4.9,
    reviewCount: 110
  }
];

export const PICKUP_TIME_OPTIONS = [
  { id: "istirahat-1", label: "Istirahat 1 (Pukul 09:45 - 10:15)", desc: "Cocok untuk sarapan pagi" },
  { id: "istirahat-2", label: "Istirahat 2 (Pukul 12:00 - 12:45)", desc: "Waktu makan siang utama" },
  { id: "segera", label: "Segera / 15 Menit Lagi", desc: "Langsung diambil saat siap" },
  { id: "pulang-sekolah", label: "Pulang Sekolah (Pukul 15:00)", desc: "Camilan sebelum pulang" }
];
