import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/data/admin-data';
import { useOrders, OrderStatus } from '@/context/OrderContext';
import {
  Search, Eye, Edit, Download, X, CheckCircle, Save,
  Truck, Copy, ExternalLink, Package, Printer
} from 'lucide-react';
import { toast } from 'sonner';

type AnyOrder = {
  id: string; customer: string;
  products?: string[];
  items?: { productName: string; price: number; quantity: number; category: string; image: string }[];
  date?: string; createdAt?: string; status: string;
  amount?: number; total?: number; subtotal?: number; deliveryFee?: number;
  phone?: string; address?: string; city?: string; email?: string; paymentMethod?: string;
  trackingNumber?: string; courierName?: string; courierUrl?: string;
};

const ALL_STATUSES: OrderStatus[] = ['Pending', 'In Progress', 'Shipped', 'Out for Delivery', 'Completed', 'Cancelled'];

const statusColor: Record<string, string> = {
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Shipped': 'bg-purple-50 text-purple-700 border-purple-200',
  'Out for Delivery': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200',
  'Cancelled': 'bg-red-50 text-red-700 border-red-200',
};

function EditOrderModal({ order, onClose, onSave, onSaveTracking }: {
  order: AnyOrder; onClose: () => void;
  onSave: (id: string, status: OrderStatus, notes?: string) => void;
  onSaveTracking: (id: string, trackingNumber: string, courierName: string, courierUrl: string) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [notes, setNotes] = useState('');
  const [tracking, setTracking] = useState({
    trackingNumber: order.trackingNumber ?? '',
    courierName: order.courierName ?? '',
    courierUrl: order.courierUrl ?? '',
  });
  const [tab, setTab] = useState<'status' | 'tracking'>('status');

  const handleSave = () => {
    onSave(order.id, status, notes);
    if (tracking.trackingNumber) onSaveTracking(order.id, tracking.trackingNumber, tracking.courierName, tracking.courierUrl);
    onClose();
    toast.success(`Order ${order.id} updated`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Edit Order</h3>
            <p className="text-xs text-primary font-mono mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(['status', 'tracking'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {t === 'status' ? '📦 Order Status' : '🚚 Courier Tracking'}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-md p-3 text-sm grid grid-cols-2 gap-y-1.5">
            <span className="text-muted-foreground">Customer</span><span className="font-medium">{order.customer}</span>
            <span className="text-muted-foreground">Amount</span><span className="font-medium text-primary">LKR {(order.amount ?? order.total ?? 0).toLocaleString()}</span>
            {order.phone && <><span className="text-muted-foreground">Phone</span><span>{order.phone}</span></>}
          </div>

          {tab === 'status' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map(s => (
                    <button key={s} onClick={() => setStatus(s)} className={`px-3 py-2 rounded-md border text-xs font-semibold transition-all flex items-center gap-2 ${status === s ? `${statusColor[s]} ring-2 ring-offset-1 ring-primary/30` : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                      {status === s && <CheckCircle size={12} />} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Internal Note</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Add a note..." className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
            </>
          )}

          {tab === 'tracking' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
                <Truck size={13} className="inline mr-1.5" />
                Add courier details so customers can track their package on the tracking page.
              </div>
              {[
                { key: 'courierName', label: 'Courier Service Name', placeholder: 'e.g. Pronto Express, Domex...' },
                { key: 'trackingNumber', label: 'Tracking Number', placeholder: 'e.g. PRN123456789LK' },
                { key: 'courierUrl', label: 'Courier Tracking URL', placeholder: 'https://courier.com/track' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                  <Input value={tracking[key as keyof typeof tracking]} onChange={e => setTracking(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
                </div>
              ))}
              {tracking.courierUrl && (
                <p className="text-xs text-muted-foreground">Customers will see a "Track with {tracking.courierName || 'Courier'}" button on the tracking page.</p>
              )}
            </div>
          )}
        </div>

        <div className="p-5 pt-0 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-accent text-white">
            <Save size={14} className="mr-1.5" /> Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function ViewOrderModal({ order, onClose }: { order: AnyOrder; onClose: () => void }) {
  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const items = order.items?.map(item =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.productName}<br/><small style="color:#999">${item.category}</small></td><td style="padding:8px;text-align:center;border-bottom:1px solid #eee">${item.quantity}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee">LKR ${item.price.toLocaleString()}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee">LKR ${(item.price * item.quantity).toLocaleString()}</td></tr>`
    ).join('') ?? `<tr><td colspan="4" style="padding:8px">${order.products?.join(', ') ?? '-'}</td></tr>`;

    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.id}</title><style>
      body{font-family:Georgia,serif;margin:0;padding:40px;color:#1a1a1a;background:#fff}
      @page{size:A4;margin:20mm} @media print{body{padding:0}}
      .header{display:flex;justify-content:space-between;align-items:start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #A77F1B}
      .brand h1{font-size:24px;margin:0;letter-spacing:2px;color:#1a1a1a} .brand p{margin:4px 0 0;color:#A77F1B;font-size:10px;letter-spacing:3px}
      .inv-info{text-align:right} .inv-info .id{font-family:monospace;font-size:16px;color:#A77F1B;font-weight:bold}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
      .info-block h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 8px;font-family:sans-serif}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      thead{background:#FAF8F4} th{padding:10px 12px;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#999;font-family:sans-serif;text-align:left}
      .text-right{text-align:right} .text-center{text-align:center}
      .totals{text-align:right} .total-row{display:flex;justify-content:flex-end;gap:40px;padding:4px 0;font-size:13px}
      .grand{font-size:18px;color:#A77F1B;border-top:2px solid #A77F1B;padding-top:8px;margin-top:8px}
      .footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#999}
      .badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:11px;font-family:sans-serif;background:#FEF3C7;color:#92400E}
    </style></head><body>
      <div class="header">
        <div class="brand"><h1>GOLD BEAUTY</h1><p>BY SHANI RANASINGHE</p></div>
        <div class="inv-info">
          <p style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 4px;font-family:sans-serif">Tax Invoice</p>
          <p class="id">${order.id}</p>
          <p style="font-size:11px;color:#666;margin:4px 0">${order.date ?? (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' }) : '-')}</p>
          <span class="badge">${order.status}</span>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-block">
          <h4>Billed To</h4>
          <p style="margin:0;font-weight:bold">${order.customer}</p>
          ${order.email ? `<p style="margin:2px 0;color:#666;font-size:12px">${order.email}</p>` : ''}
          ${order.phone ? `<p style="margin:2px 0;color:#666;font-size:12px">${order.phone}</p>` : ''}
          ${order.address ? `<p style="margin:4px 0 0;color:#666;font-size:12px">${order.address}${order.city ? ', ' + order.city : ''}</p>` : ''}
        </div>
        <div class="info-block" style="text-align:right">
          <h4>Payment</h4>
          <p style="margin:0;font-weight:bold">${order.paymentMethod ?? 'Cash on Delivery'}</p>
          ${order.trackingNumber ? `<p style="margin:6px 0 0;font-size:11px;color:#666">Tracking: ${order.trackingNumber}</p>` : ''}
        </div>
      </div>
      <table>
        <thead><tr><th>Product</th><th class="text-center">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Total</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div class="totals">
        ${order.subtotal !== undefined ? `<div class="total-row"><span style="color:#999">Subtotal</span><span>LKR ${order.subtotal.toLocaleString()}</span></div>` : ''}
        ${order.deliveryFee !== undefined ? `<div class="total-row"><span style="color:#999">Delivery</span><span>${order.deliveryFee === 0 ? 'Complimentary' : 'LKR ' + order.deliveryFee.toLocaleString()}</span></div>` : ''}
        <div class="total-row grand"><span>Grand Total</span><strong>LKR ${(order.amount ?? order.total ?? 0).toLocaleString()}</strong></div>
      </div>
      <div class="footer"><p>Thank you for choosing Gold Beauty Fashion &bull; hello@goldbeauty.lk &bull; goldbeauty.lk</p></div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Order Details</h3>
            <p className="text-xs text-primary font-mono mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status] ?? 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
          </div>
          {[['Customer', order.customer], ['Phone', order.phone], ['Email', order.email], ['Address', order.address ? `${order.address}${order.city ? ', ' + order.city : ''}` : undefined], ['Payment', order.paymentMethod ?? 'COD']].map(([k, v]) => v ? (
            <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium max-w-[55%] text-right">{v}</span></div>
          ) : null)}

          {order.trackingNumber && (
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white">
                <Truck size={14} />
                <span className="text-xs font-bold tracking-wider uppercase">Courier Tracking</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Courier</span>
                  <span className="font-semibold text-foreground">{order.courierName || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tracking No.</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-white border border-blue-200 px-2.5 py-1 rounded-md font-bold tracking-widest text-blue-700">
                      {order.trackingNumber}
                    </span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(order.trackingNumber!); toast.success('Tracking number copied!'); }}
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                      title="Copy"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                {order.courierUrl && (
                  <a
                    href={order.courierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors tracking-wider uppercase"
                  >
                    <ExternalLink size={13} /> Track Order with {order.courierName || 'Courier'}
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">Items</p>
            <div className="space-y-1.5">
              {order.products?.map((p, i) => <div key={i} className="text-sm bg-gray-50 px-3 py-2 rounded">{p}</div>)}
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                  <span>{item.productName} <span className="text-muted-foreground">×{item.quantity}</span></span>
                  <span className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">LKR {(order.amount ?? order.total ?? 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="p-5 pt-0 flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={14} /> Print Invoice
          </Button>
          <Button onClick={onClose} className="flex-1 bg-primary hover:bg-accent text-white">Close</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders: liveOrders, updateOrderStatus, updateTrackingDetails } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingOrder, setEditingOrder] = useState<AnyOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<AnyOrder | null>(null);

  const liveAsAny: AnyOrder[] = liveOrders.map(o => ({
    id: o.id, customer: o.customer, items: o.items,
    createdAt: o.createdAt, status: o.status, total: o.total,
    amount: o.total, subtotal: o.subtotal, deliveryFee: o.deliveryFee,
    phone: o.phone, address: o.address, city: o.city, email: o.email,
    paymentMethod: o.paymentMethod,
    trackingNumber: o.trackingNumber, courierName: o.courierName, courierUrl: o.courierUrl,
  }));

  const mockAsAny: AnyOrder[] = mockOrders.map(o => ({
    id: o.id, customer: o.customer, products: o.products,
    date: o.date, status: o.status, amount: o.amount,
  }));

  const allOrders = [...liveAsAny, ...mockAsAny];

  const filtered = allOrders.filter(o => {
    const ms = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const mst = statusFilter === 'All' || o.status === statusFilter;
    return ms && mst;
  });

  const exportCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Phone', 'Date', 'Status', 'Amount (LKR)'],
      ...allOrders.map(o => [o.id, o.customer, o.phone ?? '', o.date ?? (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''), o.status, (o.amount ?? o.total ?? 0).toString()]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
    toast.success('Orders exported to CSV');
  };

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = allOrders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-primary font-medium">{liveOrders.length} live orders</span> + {mockOrders.length} sample
          </p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(prev => prev === s ? 'All' : s)}
            className={`p-3 rounded-xl border text-center transition-all ${statusFilter === s ? 'border-primary bg-amber-50 shadow-sm' : 'border-border bg-white hover:border-primary/40'}`}>
            <p className={`text-xl font-bold ${statusFilter === s ? 'text-primary' : 'text-foreground'}`}>{statusCounts[s] ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{s}</p>
          </button>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 rounded-t-xl">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search by order ID or customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-white" />
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {['All', ...ALL_STATUSES].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 text-xs rounded-full font-medium transition-colors border ${statusFilter === s ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/50 bg-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white border-b border-border">
                <tr>
                  <th className="px-5 py-4 font-medium">Order ID</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Tracking</th>
                  <th className="px-5 py-4 font-medium text-right">Amount</th>
                  <th className="px-5 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />No orders found.
                  </td></tr>
                ) : filtered.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-primary font-medium">{order.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{order.customer}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{order.date ?? (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-')}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-1.5">
                          <Truck size={13} className="text-primary" />
                          <span className="text-xs font-mono text-foreground">{order.trackingNumber}</span>
                          <button onClick={() => { navigator.clipboard.writeText(order.trackingNumber!); toast.success('Tracking number copied!'); }} className="text-muted-foreground hover:text-primary">
                            <Copy size={12} />
                          </button>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">LKR {(order.amount ?? order.total ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setViewingOrder(order)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="View"><Eye size={15} /></button>
                        <button onClick={() => setEditingOrder(order)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit"><Edit size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {allOrders.length} orders
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onSave={(id, status) => updateOrderStatus(id, status)}
            onSaveTracking={updateTrackingDetails}
          />
        )}
        {viewingOrder && <ViewOrderModal order={viewingOrder} onClose={() => setViewingOrder(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
