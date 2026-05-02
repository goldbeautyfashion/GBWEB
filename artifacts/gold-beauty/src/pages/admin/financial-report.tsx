import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/context/OrderContext';
import { mockOrders } from '@/data/admin-data';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package, Download, Printer, Calendar } from 'lucide-react';

const COLORS = ['#A77F1B', '#C9A84C', '#E8C87E', '#94a3b8', '#ef4444', '#8b5cf6'];

function StatCard({ icon: Icon, label, value, sub, color = 'text-primary' }: {
  icon: typeof TrendingUp; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{label}</p>
          <p className={`text-2xl font-bold ${color} mt-0.5`}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialReport() {
  const { orders } = useOrders();
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d');
  const reportRef = useRef<HTMLDivElement>(null);

  // Combine live + mock orders for report
  const allOrders = [
    ...orders.map(o => ({ id: o.id, total: o.total, status: o.status, date: o.createdAt.split('T')[0], customer: o.customer, items: o.items })),
    ...mockOrders.map(o => ({ id: o.id, total: o.amount, status: o.status, date: o.date ?? '2024-05-01', customer: o.customer, items: [] })),
  ];

  // Filter by period
  const now = new Date();
  const periodOrders = allOrders.filter(o => {
    if (period === 'all') return true;
    const days = period === '7d' ? 7 : 30;
    const from = new Date(now); from.setDate(from.getDate() - days);
    return new Date(o.date) >= from;
  });

  const completedOrders = periodOrders.filter(o => o.status === 'Completed' || o.status === 'Shipped' || o.status === 'Out for Delivery');
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = completedOrders.length ? Math.round(totalRevenue / completedOrders.length) : 0;
  const cancelRate = periodOrders.length ? Math.round((periodOrders.filter(o => o.status === 'Cancelled').length / periodOrders.length) * 100) : 0;

  // Status distribution
  const statusDist = ['Pending', 'In Progress', 'Shipped', 'Out for Delivery', 'Completed', 'Cancelled'].map(status => ({
    name: status,
    value: allOrders.filter(o => o.status === status).length,
  })).filter(d => d.value > 0);

  // Monthly revenue (last 6 months from live + mock combined)
  const monthlyData: Record<string, { month: string; revenue: number; orders: number }> = {};
  allOrders.forEach(o => {
    const d = new Date(o.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-LK', { month: 'short', year: '2-digit' });
    if (!monthlyData[key]) monthlyData[key] = { month: label, revenue: 0, orders: 0 };
    if (o.status !== 'Cancelled') {
      monthlyData[key].revenue += o.total;
      monthlyData[key].orders += 1;
    }
  });
  const monthlyChart = Object.values(monthlyData).slice(-8);

  // Top products from live orders
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      productSales[item.productId].qty += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Date', 'Status', 'Total (LKR)'],
      ...allOrders.map(o => [o.id, o.customer, o.date, o.status, o.total.toString()]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12" ref={reportRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Report</h1>
          <p className="text-sm text-muted-foreground mt-1">Revenue analysis and business insights for Gold Beauty Fashion.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2"><Download size={15} /> Export CSV</Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2"><Printer size={15} /> Print</Button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Period:</span>
        {([['7d', 'Last 7 Days'], ['30d', 'Last 30 Days'], ['all', 'All Time']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setPeriod(val)} className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors border ${period === val ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground bg-white hover:border-primary/50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={`LKR ${totalRevenue.toLocaleString()}`} sub={`${completedOrders.length} completed orders`} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={periodOrders.length.toString()} sub={`${period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'All time'}`} />
        <StatCard icon={Package} label="Avg. Order Value" value={`LKR ${avgOrderValue.toLocaleString()}`} sub="Per completed order" />
        <StatCard icon={Users} label="Cancellation Rate" value={`${cancelRate}%`} sub="Of all orders" color={cancelRate > 15 ? 'text-destructive' : 'text-foreground'} />
      </div>

      {/* Revenue Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle className="text-base">Monthly Revenue & Orders</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyChart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A77F1B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#A77F1B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`LKR ${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#A77F1B" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-base">Order Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-base">Top Selling Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-sm">No live order data yet. Place orders to see top products.</div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                    </div>
                    <span className="text-sm font-semibold text-primary shrink-0">LKR {p.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status Bar */}
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle className="text-base">Orders by Status</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusDist} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Orders" radius={[4, 4, 0, 0]}>
                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Status', 'Amount'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground uppercase font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allOrders.slice(0, 10).map((o, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-primary">{o.id}</td>
                    <td className="px-5 py-3 font-medium">{o.customer}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(o.date).toLocaleDateString('en-LK')}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.status === 'Completed' ? 'bg-green-50 text-green-700' : o.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-primary">LKR {o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
