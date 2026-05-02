import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  placeOrder: (
    customer: string, email: string, phone: string,
    address: string, city: string, cartItems: CartItem[],
    subtotal: number, deliveryFee: number, paymentMethod?: string
  ) => Order;
  getOrderById: (id: string) => Order | undefined;
  getOrderByIdAndPhone: (id: string, phone: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateTrackingDetails: (id: string, trackingNumber: string, courierName: string, courierUrl: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

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

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('gold_beauty_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('gold_beauty_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (
    customer: string, email: string, phone: string,
    address: string, city: string, cartItems: CartItem[],
    subtotal: number, deliveryFee: number, paymentMethod = 'COD'
  ): Order => {
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
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);

  const getOrderByIdAndPhone = (id: string, phone: string) =>
    orders.find(o => o.id.toLowerCase() === id.toLowerCase() &&
      o.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
    ));
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
    ));
  };

  const updateTrackingDetails = (id: string, trackingNumber: string, courierName: string, courierUrl: string) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, trackingNumber, courierName, courierUrl, updatedAt: new Date().toISOString() } : o
    ));
  };

  return (
    <OrderContext.Provider value={{
      orders, placeOrder, getOrderById, getOrderByIdAndPhone,
      updateOrderStatus, updateOrder, updateTrackingDetails,
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
