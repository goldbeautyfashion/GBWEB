import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'Pending' | 'In Progress' | 'Shipped' | 'Out for Delivery' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  trackingNumber?: string;
  courierName?: string;
  courierUrl?: string;
  paymentMethod?: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  placeOrder: (
    customer: string, email: string, phone: string,
    address: string, city: string, cartItems: CartItem[],
    subtotal: number, deliveryFee: number, paymentMethod?: string
  ) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  getOrderByIdAndPhone: (id: string, phone: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateTrackingDetails: (id: string, trackingNumber: string, courierName: string, courierUrl: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const API_BASE = '/api/gb';

function getNextSeq(): number {
  const current = parseInt(localStorage.getItem('gold_beauty_order_seq') || '0', 10);
  const next = current + 1;
  localStorage.setItem('gold_beauty_order_seq', String(next));
  return next;
}

function generateOrderId(): string {
  const seq = getNextSeq();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let unique = '';
  for (let i = 0; i < 4; i++) unique += chars[Math.floor(Math.random() * chars.length)];
  return `GBF${seq}${unique}`;
}

function normalizeOrder(raw: Record<string, unknown>): Order {
  return {
    id: raw.id as string,
    customer: raw.customer as string,
    email: raw.email as string,
    phone: raw.phone as string,
    address: raw.address as string,
    city: raw.city as string,
    items: (raw.items as OrderItem[]) ?? [],
    subtotal: Number(raw.subtotal ?? raw.subtotal),
    deliveryFee: Number(raw.deliveryFee ?? raw.delivery_fee ?? 0),
    total: Number(raw.total ?? 0),
    status: (raw.status as OrderStatus) ?? 'Pending',
    createdAt: raw.createdAt as string ?? raw.created_at as string ?? new Date().toISOString(),
    updatedAt: raw.updatedAt as string ?? raw.updated_at as string ?? new Date().toISOString(),
    notes: raw.notes as string | undefined,
    trackingNumber: raw.trackingNumber as string | undefined ?? raw.tracking_number as string | undefined,
    courierName: raw.courierName as string | undefined ?? raw.courier_name as string | undefined,
    courierUrl: raw.courierUrl as string | undefined ?? raw.courier_url as string | undefined,
    paymentMethod: raw.paymentMethod as string | undefined ?? raw.payment_method as string | undefined,
  };
}

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders((data.orders as Record<string, unknown>[]).map(normalizeOrder));
      }
    } catch {
      // Fallback to localStorage if API unavailable
      try {
        const saved = localStorage.getItem('gold_beauty_orders');
        if (saved) setOrders(JSON.parse(saved));
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshOrders(); }, [refreshOrders]);

  const placeOrder = async (
    customer: string, email: string, phone: string,
    address: string, city: string, cartItems: CartItem[],
    subtotal: number, deliveryFee: number, paymentMethod = 'COD'
  ): Promise<Order> => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: generateOrderId(),
      customer, email, phone, address, city,
      items: cartItems.map(ci => ({
        productId: ci.product.id,
        productName: ci.product.name,
        category: ci.product.category,
        image: ci.product.image,
        price: ci.product.price,
        quantity: ci.quantity,
      })),
      subtotal, deliveryFee, total: subtotal + deliveryFee,
      status: 'Pending', createdAt: now, updatedAt: now, paymentMethod,
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const data = await res.json();
        const saved = normalizeOrder(data.order);
        setOrders(prev => [saved, ...prev]);
        return saved;
      }
    } catch { /* fallback below */ }

    // Fallback: save locally
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('gold_beauty_orders', JSON.stringify(updated));
      return updated;
    });
    return newOrder;
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);

  const getOrderByIdAndPhone = (id: string, phone: string) =>
    orders.find(o =>
      o.id.toLowerCase() === id.toLowerCase() &&
      o.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
    );

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
    ));
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch { /* optimistic update already applied */ }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
    ));
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch { /* optimistic update applied */ }
  };

  const updateTrackingDetails = async (id: string, trackingNumber: string, courierName: string, courierUrl: string) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, trackingNumber, courierName, courierUrl, updatedAt: new Date().toISOString() } : o
    ));
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, courierName, courierUrl }),
      });
    } catch { /* optimistic update applied */ }
  };

  return (
    <OrderContext.Provider value={{
      orders, loading, placeOrder, getOrderById, getOrderByIdAndPhone,
      updateOrderStatus, updateOrder, updateTrackingDetails, refreshOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
