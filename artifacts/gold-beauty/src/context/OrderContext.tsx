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
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (customer: string, email: string, phone: string, address: string, city: string, cartItems: CartItem[], subtotal: number, deliveryFee: number) => Order;
  getOrderById: (id: string) => Order | undefined;
  getOrderByIdAndPhone: (id: string, phone: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function generateOrderId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `GB-${year}-${num}`;
}

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('gold_beauty_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gold_beauty_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (
    customer: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    cartItems: CartItem[],
    subtotal: number,
    deliveryFee: number
  ): Order => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: generateOrderId(),
      customer,
      email,
      phone,
      address,
      city,
      items: cartItems.map(ci => ({
        productId: ci.product.id,
        productName: ci.product.name,
        category: ci.product.category,
        image: ci.product.image,
        price: ci.product.price,
        quantity: ci.quantity,
      })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);

  const getOrderByIdAndPhone = (id: string, phone: string) =>
    orders.find(o => o.id === id && o.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''));

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)
    );
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrderById, getOrderByIdAndPhone, updateOrderStatus, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
