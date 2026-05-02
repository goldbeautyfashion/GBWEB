import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, Search, Printer, AlertCircle, ArrowRight } from 'lucide-react';
import { useOrders, Order, OrderStatus } from '@/context/OrderContext';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Package; detail: string }[] = [
  { status: 'Pending', label: 'Order Placed', icon: Package, detail: 'Your order has been received and is awaiting confirmation.' },
  { status: 'In Progress', label: 'Processing', icon: Clock, detail: 'Our team is preparing your items with care.' },
  { status: 'Shipped', label: 'Shipped', icon: Truck, detail: 'Your package is on its way via Gold Beauty Express.' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin, detail: 'Your package is out for delivery. Our rider will contact you shortly.' },
  { status: 'Completed', label: 'Delivered', icon: CheckCircle, detail: 'Your order has been delivered. We hope you love it!' },
];

function getStepIndex(status: OrderStatus): number {
  if (status === 'Cancelled') return -1;
  return STATUS_STEPS.findIndex(s => s.status === status);
}

function OrderTrackingResult({ order }: { order: Order }) {
  const currentIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white border border-border shadow-sm">
      {/* Order Header */}
      <div className="p-6 md:p-8 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Order Number</p>
            <h3 className="font-serif text-2xl text-primary">{order.id}</h3>
            <p className="text-xs text-muted-foreground mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Status</p>
            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full tracking-wider ${
              isCancelled ? 'bg-red-50 text-red-700 border border-red-200' :
              order.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Customer</p>
            <p className="text-foreground font-medium">{order.customer}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Phone</p>
            <p className="text-foreground">{order.phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Delivery To</p>
            <p className="text-foreground">{order.address}, {order.city}</p>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="p-6 md:p-8">
        {isCancelled ? (
          <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-200 text-red-700">
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <p className="font-semibold">Order Cancelled</p>
              <p className="text-sm text-red-600 mt-1">This order has been cancelled. Please contact us for further assistance.</p>
            </div>
          </div>
        ) : (
          <div className="relative ml-4 md:ml-10 space-y-8 py-2">
            <div className="absolute top-4 bottom-4 left-[-1px] w-0.5 bg-border -z-10" />
            {currentIndex >= 0 && (
              <motion.div initial={{ height: 0 }} animate={{ height: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }} className="absolute top-4 left-[-1px] w-0.5 bg-primary -z-10" />
            )}
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const completed = index < currentIndex;
              const current = index === currentIndex;
              const upcoming = index > currentIndex;
              return (
                <motion.div key={step.status} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="relative flex items-start gap-6">
                  <div className={`absolute -left-[2.1rem] md:-left-[2.85rem] mt-0.5 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white
                    ${completed ? 'border-primary text-primary' : current ? 'border-primary text-primary shadow-[0_0_15px_rgba(167,127,27,0.3)]' : 'border-border text-muted-foreground'}`}>
                    {completed ? <CheckCircle size={20} fill="var(--color-primary)" className="text-white" /> :
                      current ? <span className="w-3 h-3 rounded-full bg-primary animate-pulse" /> :
                        <span className="w-2 h-2 rounded-full bg-border" />}
                  </div>
                  <div className="flex-1 ml-4 md:ml-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className={`font-serif text-lg ${upcoming ? 'text-muted-foreground' : 'text-foreground'}`}>{step.label}</h4>
                      {(completed || current) && <span className="text-xs text-muted-foreground tracking-widest font-medium">{new Date(order.updatedAt).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                    {current && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.8 }} className="mt-2 p-4 bg-[#FAF8F4] border border-primary/20 text-sm text-foreground flex items-start gap-3">
                        <Icon className="text-primary mt-0.5 shrink-0" size={18} />
                        <p className="leading-relaxed">{step.detail}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items Ordered */}
      <div className="border-t border-border p-6 md:p-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Items Ordered</p>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FAF8F4] border border-border p-1 shrink-0">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/FAF8F4/A77F1B?text=GB`; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.category} · Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-foreground shrink-0">LKR {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-sm font-bold tracking-widest uppercase">Total</span>
          <span className="font-serif text-xl text-primary">LKR {order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border p-6 md:p-8 flex flex-col sm:flex-row gap-3">
        <button onClick={() => window.print()} className="flex-1 border border-primary text-primary py-3 tracking-widest text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
          <Printer size={14} /> PRINT INVOICE
        </button>
        <Link href="/shop" className="flex-1">
          <button className="w-full bg-primary text-primary-foreground py-3 tracking-widest text-xs font-semibold hover:bg-accent transition-colors flex items-center justify-center gap-2">
            CONTINUE SHOPPING <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function TrackOrder() {
  const { getOrderByIdAndPhone } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null | 'not-found'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) return;
    setIsTracking(true);
    setTimeout(() => {
      const found = getOrderByIdAndPhone(orderId.trim(), phone.trim());
      setTrackedOrder(found ?? 'not-found');
      setIsTracking(false);
    }, 900);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full min-h-screen bg-[#FAF8F4] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border py-16 md:py-24 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">Track Your Glow</h1>
          <p className="text-muted-foreground text-sm tracking-[0.2em] font-medium uppercase max-w-xl mx-auto">
            Follow your luxury beauty package to your doorstep
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Tracking Form */}
          <div className="bg-white border border-border p-8 md:p-12 shadow-sm">
            <form onSubmit={handleTrack} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="orderId" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Order Number</label>
                  <input
                    id="orderId"
                    type="text"
                    placeholder="e.g. GB-2025-84729"
                    value={orderId}
                    onChange={e => { setOrderId(e.target.value); setTrackedOrder(null); }}
                    className="w-full bg-[#FAF8F4] border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="phone" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setTrackedOrder(null); }}
                    className="w-full bg-[#FAF8F4] border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isTracking}
                className="w-full bg-primary text-primary-foreground py-5 tracking-[0.2em] text-xs font-bold hover:bg-accent transition-colors flex justify-center items-center gap-3 shadow-md disabled:opacity-60"
              >
                {isTracking ? 'LOCATING...' : <><Search size={18} /> TRACK PACKAGE</>}
              </button>
            </form>
          </div>

          {/* Results */}
          {trackedOrder === 'not-found' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border p-8 text-center shadow-sm">
              <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">Order Not Found</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                We couldn't find an order matching your ID and phone number. Please double-check the details from your invoice, or contact us at <span className="text-primary">hello@goldbeauty.lk</span>.
              </p>
            </motion.div>
          )}

          {trackedOrder && trackedOrder !== 'not-found' && (
            <OrderTrackingResult order={trackedOrder} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
