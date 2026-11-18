import React, { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed, ShoppingBag, Clock, Lock, LogOut, Menu, X, User, ChevronDown, Check } from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenAuth: (initialTab?: 'SISWA' | 'KANTIN') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenOrders,
  onOpenAuth,
}) => {
  const {
    currentRole,
    setRole,
    isAdminAuthenticated,
    logoutAdmin,
    currentStudent,
    logoutStudent,
    currentStaff,
    cartCount,
    orders,
    settings,
  } = useCanteen();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active orders count for student
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'SELESAI' && o.orderStatus !== 'DIBATALKAN'
  ).length;

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setRole('KANTIN');
    } else {
      onOpenAuth('KANTIN');
    }
  };

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (currentRole === 'KANTIN') {
      setRole('SISWA');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Status */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setRole('SISWA');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:border-slate-300 transition-colors">
                <img
                  src="/yummy.jpg"
                  alt="YummyGo! Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                  Yummy<span className="text-emerald-600">Go!</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${settings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{settings.isOpen ? 'Buka' : 'Tutup'}</span>
                  <span>•</span>
                  <span>{settings.openTime}-{settings.closeTime}</span>
                </span>
              </div>
            </button>

            {/* Clean Center Navigation (Desktop, Student mode) */}
            {currentRole === 'SISWA' && (
              <nav className="hidden md:flex items-center gap-6 pl-2 text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => handleScrollTo('katalog-menu')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Menu
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollTo('cara-pesan')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Cara Pesan
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollTo('lokasi-kantin')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Lokasi Loket
                </button>
              </nav>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* If in CANTEEN mode */}
            {currentRole === 'KANTIN' ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800">{currentStaff?.name || 'Staf Kantin'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setRole('SISWA')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Lihat Toko
                </button>

                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              /* STUDENT mode */
              <>
                {/* Orders button */}
                <button
                  type="button"
                  onClick={onOpenOrders}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-semibold flex items-center gap-1.5"
                  title="Pesanan Saya"
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Pesanan</span>
                  {activeOrdersCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {activeOrdersCount}
                    </span>
                  )}
                </button>

                {/* Cart Button */}
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Keranjang</span>
                  {cartCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-bold bg-white text-emerald-800">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Vertical Divider */}
                <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                {/* Student Profile / Login Dropdown */}
                {currentStudent ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      <img
                        src={currentStudent.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                        alt={currentStudent.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-xs text-slate-800 hidden sm:inline max-w-[110px] truncate">
                        {currentStudent.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-fade-in">
                        <div className="px-3.5 py-2 border-b border-slate-100">
                          <p className="font-bold text-slate-900 truncate">{currentStudent.name}</p>
                          <p className="text-[11px] text-slate-400">{currentStudent.studentClass} • NIS {currentStudent.nis}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAuth('SISWA');
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ganti Akun Siswa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleAdminClick();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 border-t border-slate-50"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Masuk Staf Kantin</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            logoutStudent();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2 border-t border-slate-50"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenAuth('SISWA')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Masuk
                  </button>
                )}

                {/* Subtle Staff Lock Icon (Quick Canteen Access) */}
                <button
                  type="button"
                  onClick={handleAdminClick}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Akses Staf Kantin"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden ml-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 text-xs">
          <button
            type="button"
            onClick={() => handleScrollTo('katalog-menu')}
            className="w-full text-left py-2 px-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
          >
            Daftar Menu
          </button>
          <button
            type="button"
            onClick={() => handleScrollTo('cara-pesan')}
            className="w-full text-left py-2 px-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
          >
            Cara Pesan &amp; Ambil
          </button>
          <button
            type="button"
            onClick={() => handleScrollTo('lokasi-kantin')}
            className="w-full text-left py-2 px-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
          >
            Lokasi Loket
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminClick();
              }}
              className="text-slate-500 font-medium hover:text-slate-900 py-1"
            >
              Akses Staf Kantin
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
