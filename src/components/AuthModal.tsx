import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, X, AlertCircle, ArrowRight, GraduationCap, Store, Check, Sparkles } from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'SISWA' | 'KANTIN';
  onLoginSuccess?: (role: 'SISWA' | 'KANTIN') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'SISWA',
  onLoginSuccess,
}) => {
  const { loginAdmin, loginStudent, studentsList, currentStudent } = useCanteen();

  const [activeTab, setActiveTab] = useState<'SISWA' | 'KANTIN'>(initialTab);

  // Student Input: Cukup Nama dan Kelas
  const [studentName, setStudentName] = useState(currentStudent?.name || '');
  const [studentClass, setStudentClass] = useState(currentStudent?.studentClass || '');

  // Admin Input: Kata sandi staf
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Student Login Submit (Cukup Nama & Kelas)
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!studentName.trim()) {
      setErrorMessage('Harap masukkan nama lengkap siswa!');
      return;
    }

    if (!studentClass.trim()) {
      setErrorMessage('Harap masukkan kelas / jurusan siswa!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginStudent(studentName.trim(), studentClass.trim());
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onClose();
          if (onLoginSuccess) onLoginSuccess('SISWA');
        }, 400);
      } else {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  // Admin Login Submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginAdmin(adminPassword);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onClose();
          if (onLoginSuccess) onLoginSuccess('KANTIN');
        }, 400);
      } else {
        setErrorMessage(res.message);
      }
    }, 300);
  };

  // Quick Admin Login Demo
  const handleQuickAdminLogin = () => {
    loginAdmin('kantin123');
    setSuccessMessage('Login staf dapur & kasir berhasil!');
    setTimeout(() => {
      onClose();
      if (onLoginSuccess) onLoginSuccess('KANTIN');
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0">
              <img src="/yummy.jpg" alt="YummyGo!" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {activeTab === 'SISWA' ? 'Masuk Akun Siswa' : 'Panel Staf Pengelola'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {activeTab === 'SISWA'
                  ? 'Cukup isi nama dan kelas untuk mulai memesan.'
                  : 'Khusus pihak dapur & kasir (Kata sandi staf).'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('SISWA');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'SISWA'
                ? 'border-slate-900 text-slate-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Siswa (Pembeli)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('KANTIN');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'KANTIN'
                ? 'border-slate-900 text-slate-900 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4 text-slate-700" />
            <span>Staf Kantin (Penjual)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Notification Messages */}
          {successMessage && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 font-semibold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= TAB SISWA: CUKUP NAMA & KELAS ================= */}
          {activeTab === 'SISWA' && (
            <div className="space-y-4">
              <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                
                {/* Input 1: Nama Lengkap */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Nama Lengkap Siswa <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap siswa"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-slate-900 outline-none text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Input 2: Kelas / Jurusan */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Kelas / Jurusan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Masukkan kelas / jurusan (misal: XII RPL 1)"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-slate-900 outline-none text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !studentName.trim() || !studentClass.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Masuk Dashboard Siswa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB STAF KANTIN ================= */}
          {activeTab === 'KANTIN' && (
            <div className="space-y-4">
              <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Kata Sandi Staf Kantin <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan kata sandi (default: kantin123)"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-slate-900 outline-none text-xs sm:text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !adminPassword}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Masuk Dashboard Dapur &amp; Kasir</span>
                  <Lock className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Test for Staff */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Uji Coba Masuk Staf (Sandi Otomatis)</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
