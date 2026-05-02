import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Package, Truck, CheckCircle, Clock, MapPin, Search,
  Printer, AlertCircle, ArrowRight, Copy, ExternalLink, FileDown
} from 'lucide-react';
import { useOrders, Order, OrderStatus } from '@/context/OrderContext';
import { toast } from 'sonner';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Package; detail: string }[] = [
  { status: 'Pending', label: 'Order Placed', icon: Package, detail: 'Your order has been received and is awaiting confirmation.' },
  { status: 'In Progress', label: 'Processing', icon: Clock, detail: 'Our team is carefully preparing your items.' },
  { status: 'Shipped', label: 'Shipped', icon: Truck, detail: 'Your package is on its way!' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin, detail: 'Your package is out for delivery. Our rider will contact you shortly.' },
  { status: 'Completed', label: 'Delivered', icon: CheckCircle, detail: 'Your order has been delivered. We hope you love it!' },
];

function getStepIndex(status: OrderStatus): number {
  if (status === 'Cancelled') return -1;
  return STATUS_STEPS.findIndex(s => s.status === status);
}

function printInvoice(order: Order) {
  const win = window.open('', '_blank');
  if (!win) { toast.error('Popup blocked — please allow popups'); return; }
  const items = order.items.map(item =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${item.productName}<br/><small style="color:#999">${item.category}</small></td><td style="padding:8px 12px;text-align:center;border-bottom:1px solid #eee">${item.quantity}</td><td style="padding:8px 12px;text-align:right;border-bottom:1px solid #eee">LKR ${item.price.toLocaleString()}</td><td style="padding:8px 12px;text-align:right;border-bottom:1px solid #eee">LKR ${(item.price * item.quantity).toLocaleString()}</td></tr>`
  ).join('');

  win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.id}</title>
    <style>
      body{font-family:Georgia,serif;margin:0;padding:40px;color:#1a1a1a;background:#fff}
      @page{size:A4;margin:20mm} @media print{body{padding:0}}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2.5px solid #A77F1B}
      h1{margin:0;font-size:22px;letter-spacing:3px} .tagline{margin:4px 0 0;color:#A77F1B;font-size:9px;letter-spacing:3px}
      .id{font-family:monospace;font-size:17px;color:#A77F1B;font-weight:bold;margin:0}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
      .info-block h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 8px}
      .info-block p{margin:2px 0;font-size:12px}
      table{width:100%;border-collapse:collapse;margin-bottom:16px}
      thead{background:#FFF5F8} th{padding:10px 12px;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#999;text-align:left}
      .tr{text-align:right} .tc{text-align:center}
      .totals{text-align:right;font-size:13px}
      .total-line{display:flex;justify-content:flex-end;gap:48px;padding:3px 0}
      .grand{border-top:2px solid #A77F1B;padding-top:8px;margin-top:6px;font-size:18px;color:#A77F1B}
      .footer{text-align:center;margin-top:48px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#999}
      .badge{display:inline-block;padding:3px 12px;border-radius:99px;font-size:10px;background:#FEF3C7;color:#92400E}
      .track-box{margin:16px 0;padding:12px 16px;border:1px solid #d1e8ff;border-radius:6px;background:#f0f8ff;font-size:11px;color:#1e4fa0}
    </style></head><body>
    <div class="header">
      <div><h1>GOLD BEAUTY</h1><p class="tagline">BY SHANI RANASINGHE</p></div>
      <div style="text-align:right">
        <p style="margin:0;font-size:9px;color:#999;letter-spacing:2px;text-transform:uppercase">Invoice</p>
        <p class="id">${order.id}</p>
        <p style="margin:4px 0;font-size:11px;color:#666">${new Date(order.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <span class="badge">${order.status}</span>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-block">
        <h4>Billed To</h4>
        <p style="font-weight:bold">${order.customer}</p>
        ${order.email ? `<p>${order.email}</p>` : ''}
        <p>${order.phone}</p>
        <p style="margin-top:4px">${order.address}, ${order.city}</p>
      </div>
      <div class="info-block" style="text-align:right">
        <h4>Payment Method</h4>
        <p style="font-weight:bold">${order.paymentMethod ?? 'Cash on Delivery'}</p>
      </div>
    </div>
    ${order.trackingNumber ? `<div class="track-box">🚚 Courier: ${order.courierName} &bull; Tracking #: ${order.trackingNumber}${order.courierUrl ? ` &bull; Track at: ${order.courierUrl}` : ''}</div>` : ''}
    <table>
      <thead><tr><th>Product</th><th class="tc">Qty</th><th class="tr">Unit Price</th><th class="tr">Total</th></tr></thead>
      <tbody>${items}</tbody>
    </table>
    <div class="totals">
      <div class="total-line"><span style="color:#999">Subtotal</span><span>LKR ${order.subtotal.toLocaleString()}</span></div>
      <div class="total-line"><span style="color:#999">Delivery</span><span>${order.deliveryFee === 0 ? 'Complimentary' : 'LKR ' + order.deliveryFee.toLocaleString()}</span></div>
      <div class="total-line grand"><span>Grand Total</span><strong>LKR ${order.total.toLocaleString()}</strong></div>
    </div>
    <div class="footer"><p>Thank you for choosing Gold Beauty Fashion &bull; hello@goldbeauty.lk</p></div>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

function OrderTrackingResult({ order }: { order: Order }) {
  const currentIndex = getStepIndex(order.status);
  const isCancelled = order.status === 'Cancelled';
  const [copied, setCopied] = useState(false);

  const copyTracking = () => {
    if (!order.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    toast.success('Tracking number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

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
              'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Customer</p><p className="text-foreground font-medium">{order.customer}</p></div>
          <div><p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Phone</p><p className="text-foreground">{order.phone}</p></div>
          <div><p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-1">Delivery To</p><p className="text-foreground">{order.address}, {order.city}</p></div>
        </div>
      </div>

      {/* Courier Tracking Box */}
      {order.trackingNumber && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-b border-border">
          <div className="p-5 md:p-6 bg-blue-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={18} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-800">Courier Tracking</p>
              {order.courierName && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{order.courierName}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-md px-3 py-2">
                <span className="text-xs text-muted-foreground">Tracking #</span>
                <span className="font-mono text-sm font-semibold text-foreground">{order.trackingNumber}</span>
              </div>
              <button onClick={copyTracking} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-colors ${copied ? 'bg-green-100 text-green-700 border-green-200' : 'border-blue-200 text-blue-700 hover:bg-blue-100'}`}>
                {copied ? <CheckCircle size={13} /> : <Copy size={13} />} {copied ? 'Copied!' : 'Copy'}
              </button>
              {order.courierUrl && (
                <a href={order.courierUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors">
                  <ExternalLink size={13} /> Track on {order.courierName || 'Courier Website'}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tracking Timeline */}
      <div className="p-6 md:p-8">
        {isCancelled ? (
          <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 text-red-700">
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <p className="font-semibold">Order Cancelled</p>
              <p className="text-sm text-red-600 mt-0.5">This order has been cancelled. Please contact us for further assistance.</p>
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
                  <div className={`absolute -left-[2.1rem] md:-left-[2.85rem] mt-0.5 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${completed ? 'border-primary text-primary' : current ? 'border-primary shadow-[0_0_12px_rgba(167,127,27,0.3)]' : 'border-border text-muted-foreground'}`}>
                    {completed ? <CheckCircle size={20} fill="var(--color-primary)" className="text-white" /> : current ? <span className="w-3 h-3 rounded-full bg-primary animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-border" />}
                  </div>
                  <div className="flex-1 ml-4 md:ml-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`font-serif text-lg ${upcoming ? 'text-muted-foreground' : 'text-foreground'}`}>{step.label}</h4>
                      {(completed || current) && <span className="text-xs text-muted-foreground tracking-widest">{new Date(order.updatedAt).toLocaleDateString('en-LK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                    {current && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.8 }} className="mt-2 p-4 bg-[#FFF5F8] border border-primary/20 text-sm text-foreground flex items-start gap-3">
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
              <div className="w-12 h-12 bg-[#FFF5F8] border border-border p-1 shrink-0">
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
        <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span>LKR {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span>{order.deliveryFee === 0 ? 'Complimentary' : `LKR ${order.deliveryFee.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2 mt-1">
            <span className="font-bold tracking-widest uppercase text-xs">Total</span>
            <span className="font-serif text-xl text-primary">LKR {order.total.toLocaleString()}</span>
          </div>
        </div>
        {order.paymentMethod && (
          <p className="text-xs text-muted-foreground mt-3">Payment: <span className="font-medium text-foreground">{order.paymentMethod}</span></p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-border p-6 md:p-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => printInvoice(order)}
          className="flex-1 border border-primary text-primary py-3 tracking-widest text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <Printer size={14} /> VIEW INVOICE
        </button>
        <button
          onClick={() => printInvoice(order)}
          className="flex-1 bg-primary/10 text-primary py-3 tracking-widest text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
        >
          <FileDown size={14} /> DOWNLOAD INVOICE (PDF)
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full min-h-screen bg-[#FFF5F8] pb-24">
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
          <div className="bg-white border border-border p-8 md:p-12 shadow-sm">
            <form onSubmit={handleTrack} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Order Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GBF14GG7"
                    value={orderId}
                    onChange={e => { setOrderId(e.target.value); setTrackedOrder(null); }}
                    className="w-full bg-[#FFF5F8] border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground font-mono"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setTrackedOrder(null); }}
                    className="w-full bg-[#FFF5F8] border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={isTracking} className="w-full bg-primary text-primary-foreground py-5 tracking-[0.2em] text-xs font-bold hover:bg-accent transition-colors flex justify-center items-center gap-3 shadow-md disabled:opacity-60">
                {isTracking ? 'LOCATING...' : <><Search size={18} /> TRACK PACKAGE</>}
              </button>
            </form>
          </div>

          {trackedOrder === 'not-found' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border p-8 text-center shadow-sm">
              <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">Order Not Found</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                We couldn't find an order matching your ID and phone number. Please double-check the details from your invoice, or contact us at <span className="text-primary">hello@goldbeauty.lk</span>.
              </p>
            </motion.div>
          )}

          {trackedOrder && trackedOrder !== 'not-found' && <OrderTrackingResult order={trackedOrder} />}
        </div>
      </div>
    </motion.div>
  );
}
