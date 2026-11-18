import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentView/StudentDashboard';
import { CanteenDashboard } from './components/CanteenView/CanteenDashboard';
import { QRISModal } from './components/QRISModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { Order } from './types';

const MainApp: React.FC = () => {
  const { currentRole, setRole, isAdminAuthenticated, createOrder } = useCanteen();

  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'SISWA' | 'KANTIN'>('SISWA');
  
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Temporary holder when student is paying via QRIS
  const [pendingQRISData, setPendingQRISData] = useState<{
    amount: number;
    orderData: {
      customerName: string;
      customerClass: string;
      customerPhone?: string;
      pickupTime: string;
      orderNotes?: string;
      paymentMethod: 'QRIS';
    };
  } | null>(null);

  const handleOpenQRIS = (
    amount: number,
    orderData: {
      customerName: string;
      customerClass: string;
      customerPhone?: string;
      pickupTime: string;
      orderNotes?: string;
      paymentMethod: 'QRIS';
    }
  ) => {
    setPendingQRISData({ amount, orderData });
    setIsQRISModalOpen(true);
  };

  const handleQRISPaymentSuccess = () => {
    if (!pendingQRISData) return;

    // Create verified order
    const newOrder = createOrder({
      customerName: pendingQRISData.orderData.customerName,
      customerClass: pendingQRISData.orderData.customerClass,
      customerPhone: pendingQRISData.orderData.customerPhone,
      pickupTime: pendingQRISData.orderData.pickupTime,
      orderNotes: pendingQRISData.orderData.orderNotes,
      paymentMethod: 'QRIS',
    });

    setIsQRISModalOpen(false);
    setPendingQRISData(null);
    setLatestOrder(newOrder);
    setIsSuccessModalOpen(true);
  };

  const handleCashOrderCreated = (order: Order) => {
    setLatestOrder(order);
    setIsSuccessModalOpen(true);
  };

  const handleOpenAuth = (tab: 'SISWA' | 'KANTIN' = 'SISWA') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setRole('KANTIN');
    } else {
      handleOpenAuth('KANTIN');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* View routing: LANDING | SISWA | KANTIN */}
      {currentRole === 'LANDING' && (
        <LandingPage
          onEnterStudent={() => setRole('SISWA')}
          onEnterCanteen={handleAdminAccess}
          onOpenStudentAuth={() => handleOpenAuth('SISWA')}
        />
      )}

      {currentRole === 'SISWA' && (
        <StudentDashboard
          onBackToLanding={() => setRole('LANDING')}
          onOpenQRIS={handleOpenQRIS}
          onOrderCreated={handleCashOrderCreated}
          onOpenAuth={() => handleOpenAuth('SISWA')}
        />
      )}

      {currentRole === 'KANTIN' && isAdminAuthenticated && (
        <CanteenDashboard
          onBackToLanding={() => setRole('LANDING')}
        />
      )}

      {/* Floating Global Modals */}
      <QRISModal
        isOpen={isQRISModalOpen}
        onClose={() => setIsQRISModalOpen(false)}
        amount={pendingQRISData?.amount || 0}
        orderNumber="YG-QRIS"
        onPaymentSuccess={handleQRISPaymentSuccess}
      />

      <OrderSuccessModal
        order={latestOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* Unified Authentication Modal (Siswa & Staf Kantin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(role) => {
          if (role === 'KANTIN') {
            setRole('KANTIN');
          } else {
            setRole('SISWA');
          }
        }}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CanteenProvider>
      <MainApp />
    </CanteenProvider>
  );
};

export default App;
