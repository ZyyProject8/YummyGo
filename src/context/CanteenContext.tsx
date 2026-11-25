import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, CartItem, CanteenSettings, UserRole, OrderStatus, PaymentStatus, StudentUser, StaffUser } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, DEFAULT_STUDENTS } from '../data/mockData';
import { generateOrderNumber, generatePickupPin } from '../utils/helpers';
import { soundFx } from '../utils/sound';

interface CanteenContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  settings: CanteenSettings;
  currentRole: UserRole;
  isAdminAuthenticated: boolean;
  currentStudent: StudentUser | null;
  currentStaff: StaffUser | null;
  studentsList: StudentUser[];
  cartTotal: number;
  cartCount: number;
  setRole: (role: UserRole) => void;
  loginAdmin: (password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  loginStudent: (name: string, studentClass?: string) => { success: boolean; message: string; user?: StudentUser };
  registerStudent: (studentData: Omit<StudentUser, 'id'>) => { success: boolean; message: string; user?: StudentUser };
  logoutStudent: () => void;
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (orderData: {
    customerName: string;
    customerClass: string;
    customerPhone?: string;
    pickupTime: string;
    orderNotes?: string;
    paymentMethod: 'CASH' | 'QRIS';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateSettings: (newSettings: Partial<CanteenSettings>) => void;
  verifyPickup: (query: string) => { success: boolean; message: string; order?: Order };
}

const STORAGE_KEYS = {
  PRODUCTS: 'yummygo_products_v2',
  ORDERS: 'yummygo_orders_v1',
  SETTINGS: 'yummygo_settings_v1',
  ROLE: 'yummygo_role_v1',
  STUDENTS: 'yummygo_students_v1',
  CURRENT_STUDENT: 'yummygo_current_student_v1',
};

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered students list
  const [studentsList, setStudentsList] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Current logged in student
  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name !== 'Budi Santoso') {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Current staff user
  const [currentStaff] = useState<StaffUser>({
    id: 'staff-1',
    username: 'kantin',
    name: 'Staf Kantin',
    roleTitle: 'Pengelola Kantin & Kasir',
  });

  // Load products from localStorage or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].category === 'Makanan' || parsed[0].category === 'Minuman')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load orders from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Load settings
  const [settings, setSettings] = useState<CanteenSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  // Authentication for Canteen Admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('yummygo_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Current active role
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const isAuth = sessionStorage.getItem('yummygo_admin_auth') === 'true';
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (saved === 'KANTIN' && isAuth) return 'KANTIN';
      if (saved === 'SISWA') return 'SISWA';
    } catch (e) {
      console.error(e);
    }
    return 'LANDING';
  });

  const loginAdmin = (password: string) => {
    const currentPass = settings.adminPassword || 'kantin123';
    if (password.trim() === currentPass.trim()) {
      setIsAdminAuthenticated(true);
      setCurrentRole('KANTIN');
      try {
        sessionStorage.setItem('yummygo_admin_auth', 'true');
      } catch (e) {
        console.error(e);
      }
      soundFx.playSuccessPing();
      return { success: true, message: 'Login staf berhasil! Selamat datang di Panel Dapur & Kasir.' };
    }
    return { success: false, message: 'Kata sandi salah! Hubungi pihak pengelola kantin jika lupa kata sandi.' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentRole('LANDING');
    try {
      sessionStorage.removeItem('yummygo_admin_auth');
    } catch (e) {
      console.error(e);
    }
  };

  const loginStudent = (name: string, studentClass?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, message: 'Harap masukkan nama siswa!' };
    }
    const trimmedClass = (studentClass || 'Siswa').trim();

    // Check if matching student name exists
    const q = trimmedName.toLowerCase();
    let found = studentsList.find((s) => s.name.toLowerCase() === q);

    if (found) {
      if (trimmedClass && trimmedClass !== 'Siswa' && found.studentClass !== trimmedClass) {
        found = { ...found, studentClass: trimmedClass };
        const updated = studentsList.map((s) => (s.id === found!.id ? found! : s));
        setStudentsList(updated);
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
      setCurrentStudent(found);
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(found));
      } catch (e) {
        console.error(e);
      }
      soundFx.playSuccessPing();
      return { success: true, message: `Halo ${found.name} (${found.studentClass}), kamu berhasil masuk!`, user: found };
    }

    // Auto-create new student
    const newStudent: StudentUser = {
      id: `std-${Date.now()}`,
      name: trimmedName,
      studentClass: trimmedClass || 'Siswa',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };

    const updated = [...studentsList, newStudent];
    setStudentsList(updated);
    setCurrentStudent(newStudent);
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(newStudent));
    } catch (e) {
      console.error(e);
    }
    soundFx.playSuccessPing();
    return { success: true, message: `Selamat datang, ${newStudent.name} (${newStudent.studentClass})!`, user: newStudent };
  };

  const registerStudent = (studentData: Omit<StudentUser, 'id'>) => {
    return loginStudent(studentData.name, studentData.studentClass);
  };

  const logoutStudent = () => {
    setCurrentStudent(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    } catch (e) {
      console.error(e);
    }
  };

  // In-memory cart for the student session
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync state across browser tabs using BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('yummygo_sync_channel');

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'NEW_ORDER') {
        setOrders((prev) => [payload, ...prev.filter((o) => o.id !== payload.id)]);
        soundFx.playOrderChime();
      } else if (type === 'UPDATE_ORDERS') {
        setOrders(payload);
      } else if (type === 'UPDATE_PRODUCTS') {
        setProducts(payload);
      } else if (type === 'UPDATE_SETTINGS') {
        setSettings(payload);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const broadcast = useCallback((type: string, payload: unknown) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('yummygo_sync_channel');
        channel.postMessage({ type, payload });
        channel.close();
      } catch (e) {
        console.error('BroadcastChannel error:', e);
      }
    }
  }, []);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Persist role
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch (e) {
      console.error(e);
    }
  }, [currentRole]);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const addToCart = (product: Product, quantity = 1, notes = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          alert(`Maksimal stok yang tersedia hanya ${product.stock}`);
          return prev;
        }
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          notes: notes || updated[existingIndex].notes,
        };
        return updated;
      } else {
        if (quantity > product.stock) {
          alert(`Maksimal stok yang tersedia hanya ${product.stock}`);
          return prev;
        }
        return [...prev, { product, quantity, notes }];
      }
    });
    soundFx.playSuccessPing();
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            alert(`Stok hanya tersedia ${item.product.stock}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Siswa Checkout Order
  const createOrder = (orderData: {
    customerName: string;
    customerClass: string;
    customerPhone?: string;
    pickupTime: string;
    orderNotes?: string;
    paymentMethod: 'CASH' | 'QRIS';
  }): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderNumber: generateOrderNumber(),
      pickupPin: generatePickupPin(),
      customerName: orderData.customerName.trim(),
      customerClass: orderData.customerClass.trim(),
      customerPhone: orderData.customerPhone?.trim(),
      items: [...cart],
      totalPrice: cartTotal,
      paymentMethod: orderData.paymentMethod,
      // For QRIS, initially marked as PAID once verified; for CASH marked as BELUM_BAYAR (bayar saat ambil)
      paymentStatus: orderData.paymentMethod === 'QRIS' ? 'SUDAH_BAYAR' : 'BELUM_BAYAR',
      orderStatus: 'MENUNGGU_KONFIRMASI',
      pickupTime: orderData.pickupTime,
      orderNotes: orderData.orderNotes?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock from products
    setProducts((prev) => {
      const updated = prev.map((prod) => {
        const cartItem = cart.find((c) => c.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          return {
            ...prod,
            stock: newStock,
            isAvailable: newStock > 0 ? prod.isAvailable : false,
          };
        }
        return prod;
      });
      broadcast('UPDATE_PRODUCTS', updated);
      return updated;
    });

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      broadcast('NEW_ORDER', newOrder);
      return updated;
    });

    clearCart();
    soundFx.playOrderChime();
    return newOrder;
  };

  // Kantin update status (e.g. Masak -> Siap Diambil -> Selesai)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          const isComplete = status === 'SELESAI';
          return {
            ...ord,
            orderStatus: status,
            // If completed and cash was unpaid, auto mark as paid upon handover
            paymentStatus: isComplete && ord.paymentMethod === 'CASH' ? 'SUDAH_BAYAR' : ord.paymentStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      });
      broadcast('UPDATE_ORDERS', updated);
      return updated;
    });
    soundFx.playOrderChime();
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: status, updatedAt: new Date().toISOString() } : ord));
      broadcast('UPDATE_ORDERS', updated);
      return updated;
    });
  };

  // Product management for Kantin
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      broadcast('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === product.id ? product : p));
      broadcast('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      broadcast('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
      broadcast('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const validStock = Math.max(0, newStock);
          return {
            ...p,
            stock: validStock,
            isAvailable: validStock > 0 ? p.isAvailable : false,
          };
        }
        return p;
      });
      broadcast('UPDATE_PRODUCTS', updated);
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<CanteenSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      broadcast('UPDATE_SETTINGS', updated);
      return updated;
    });
  };

  // Quick verification for Kantin cashier: Student provides PIN or OrderNumber
  const verifyPickup = (query: string): { success: boolean; message: string; order?: Order } => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) {
      return { success: false, message: 'Harap masukkan PIN (4 digit) atau Nomor Pesanan (misal: YG-123)' };
    }

    const found = orders.find(
      (o) => o.pickupPin === cleanQuery || o.orderNumber.toUpperCase() === cleanQuery || o.id === cleanQuery
    );

    if (!found) {
      return { success: false, message: `Pesanan dengan kode "${cleanQuery}" tidak ditemukan.` };
    }

    if (found.orderStatus === 'SELESAI') {
      return { success: false, message: `Pesanan ${found.orderNumber} sudah diambil sebelumnya.`, order: found };
    }

    if (found.orderStatus === 'DIBATALKAN') {
      return { success: false, message: `Pesanan ${found.orderNumber} berstatus Dibatalkan.`, order: found };
    }

    // Auto mark as SELESAI
    updateOrderStatus(found.id, 'SELESAI');
    soundFx.playSuccessPing();

    return {
      success: true,
      message: `Berhasil! Pesanan ${found.orderNumber} atas nama ${found.customerName} (${found.customerClass}) terverifikasi dan telah diambil.`,
      order: found,
    };
  };

  return (
    <CanteenContext.Provider
      value={{
        products,
        orders,
        cart,
        settings,
        currentRole,
        isAdminAuthenticated,
        currentStudent,
        currentStaff,
        studentsList,
        cartTotal,
        cartCount,
        setRole,
        loginAdmin,
        logoutAdmin,
        loginStudent,
        registerStudent,
        logoutStudent,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        updateProductStock,
        updateSettings,
        verifyPickup,
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
