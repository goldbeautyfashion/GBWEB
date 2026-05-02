import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/data/admin-data';
import { useOrders, OrderStatus } from '@/context/OrderContext';
import { Search, Filter, Eye, Edit, Download, X, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

type AnyOrder = {
  id: string;
  customer: string;
  products?: string[];
  items?: { productName: string }[];
  date?: string;
  createdAt?: string;
  status: string;
  amount?: number;
  total?: number;
  phone?: string;
  address?: string;
  city?: string;
};

const ALL_STATUSES: OrderStatus[] = ['Pending', 'In Progress', 'Shipped', 'Out for Delivery', 'Completed', 'Cancelled'];

function EditOrderModal({ order, onClose, onSave }: {
  order: AnyOrder;
  onClose: () => void;
  onSave: (id: string, status: OrderStatus, notes?: string) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    onSave(order.id, status, notes);
    onClose();
    toast.success(`Order ${order.id} updated to "${status}"`);
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Shipped': 'bg-purple-50 text-purple-700 border-purple-200',
    'Out for Delivery': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Edit Order</h3>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-md p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium text-foreground">{order.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-primary">LKR {(order.amount ?? order.total ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">{order.date ?? (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-')}</span>
            </div>
            {order.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-foreground">{order.phone}</span>
              </div>
            )}
            {order.address && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="text-foreground text-right max-w-[200px] truncate">{order.address}, {order.city}</span>
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Update Status</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-md border text-xs font-semibold transition-all flex items-center gap-2 ${
                    status === s ? `${statusColors[s]} ring-2 ring-offset-1 ring-primary/30` : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {status === s && <CheckCircle size={12} />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Internal Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Add a note about this order..."
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-accent text-white">
            <Save size={15} className="mr-2" /> Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function ViewOrderModal({ order, onClose }: { order: AnyOrder; onClose: () => void }) {
  const statusColors: Record<string, string> = {
    'Completed': 'bg-green-50 text-green-700',
    'In Progress': 'bg-blue-50 text-blue-700',
    'Pending': 'bg-amber-50 text-amber-700',
    'Shipped': 'bg-purple-50 text-purple-700',
    'Out for Delivery': 'bg-cyan-50 text-cyan-700',
    'Cancelled': 'bg-red-50 text-red-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Order Details</h3>
            <p className="text-sm text-primary font-mono mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Customer</span>
            <span className="text-sm font-medium">{order.customer}</span>
          </div>
          {order.phone && <div className="flex justify-between"><span className="text-sm text-muted-foreground">Phone</span><span className="text-sm">{order.phone}</span></div>}
          {order.address && <div className="flex justify-between"><span className="text-sm text-muted-foreground">Address</span><span className="text-sm text-right max-w-[55%]">{order.address}{order.city ? `, ${order.city}` : ''}</span></div>}
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm">{order.date ?? (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-')}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-sm font-bold">Total</span>
            <span className="text-sm font-bold text-primary">LKR {(order.amount ?? order.total ?? 0).toLocaleString()}</span>
          </div>

          {/* Items */}
          {(order.products || order.items) && (
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Products</p>
              <div className="space-y-1.5">
                {order.products?.map((p, i) => <div key={i} className="text-sm text-foreground bg-gray-50 px-3 py-2 rounded">{p}</div>)}
                {order.items?.map((item, i) => <div key={i} className="text-sm text-foreground bg-gray-50 px-3 py-2 rounded">{item.productName}</div>)}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 pt-0">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-accent text-white">Close</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders: liveOrders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingOrder, setEditingOrder] = useState<AnyOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<AnyOrder | null>(null);

  // Merge live orders (real) + mock orders, live ones first
  const liveAsAny: AnyOrder[] = liveOrders.map(o => ({
    id: o.id,
    customer: o.customer,
    items: o.items,
    createdAt: o.createdAt,
    status: o.status,
    total: o.total,
    phone: o.phone,
    address: o.address,
    city: o.city,
    amount: o.total,
  }));

  const mockAsAny: AnyOrder[] = mockOrders.map(o => ({
    id: o.id,
    customer: o.customer,
    products: o.products,
    date: o.date,
    status: o.status,
    amount: o.amount,
  }));

  const allOrders = [...liveAsAny, ...mockAsAny];

  const filtered = allOrders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSaveOrder = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
  };

  const statusColors: Record<string, string> = {
    'Completed': 'bg-green-50 text-green-700 border border-green-200',
    'In Progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Shipped': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Out for Delivery': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    'Cancelled': 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all customer orders. <span className="text-primary font-medium">{liveOrders.length} live</span> + {mockOrders.length} sample.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2"><Download size={16} />Export</Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 rounded-t-xl">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search by order ID or customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-white" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Pending', 'In Progress', 'Shipped', 'Completed', 'Cancelled'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors border ${statusFilter === s ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/50 bg-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No orders found.</td></tr>
                ) : filtered.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary font-mono text-xs">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{order.customer}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{order.date ?? (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">LKR {(order.amount ?? order.total ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewingOrder(order)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setEditingOrder(order)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit Status">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filtered.length} of {allOrders.length} orders</span>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {editingOrder && <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onSave={handleSaveOrder} />}
        {viewingOrder && <ViewOrderModal order={viewingOrder} onClose={() => setViewingOrder(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
