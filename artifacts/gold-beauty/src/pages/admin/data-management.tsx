import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/context/OrderContext';
import { mockCustomers } from '@/data/admin-data';
import {
  Download, Upload, Database, Users, ShoppingBag, RotateCcw,
  CheckCircle, AlertTriangle, FileJson, FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function DataManagement() {
  const { orders } = useOrders();
  const [importing, setImporting] = useState(false);
  const [backupPreview, setBackupPreview] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const getBackupData = () => ({
    exportedAt: new Date().toISOString(),
    version: '1.0',
    orders: JSON.parse(localStorage.getItem('gold_beauty_orders') ?? '[]'),
    siteConfig: JSON.parse(localStorage.getItem('gold_beauty_site_config') ?? '{}'),
    orderSeq: localStorage.getItem('gold_beauty_order_seq') ?? '0',
  });

  const handleExportBackup = () => {
    const data = getBackupData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gold-beauty-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success(`Backup exported — ${orders.length} orders, config included`);
  };

  const handlePreviewBackup = () => {
    const data = getBackupData();
    setBackupPreview(JSON.stringify(data, null, 2));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.version || !Array.isArray(data.orders)) throw new Error('Invalid backup format');
        if (data.orders?.length > 0) localStorage.setItem('gold_beauty_orders', JSON.stringify(data.orders));
        if (data.siteConfig && Object.keys(data.siteConfig).length > 0) localStorage.setItem('gold_beauty_site_config', JSON.stringify(data.siteConfig));
        if (data.orderSeq) localStorage.setItem('gold_beauty_order_seq', data.orderSeq);
        toast.success(`Backup restored! ${data.orders?.length ?? 0} orders imported. Refreshing...`);
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        toast.error('Invalid backup file. Please use a Gold Beauty backup JSON.');
      } finally { setImporting(false); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const exportOrdersCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Address', 'City', 'Date', 'Status', 'Payment', 'Subtotal', 'Delivery Fee', 'Total (LKR)', 'Tracking Number', 'Courier'],
      ...orders.map(o => [
        o.id, o.customer, o.email, o.phone, o.address, o.city,
        new Date(o.createdAt).toLocaleDateString(), o.status, o.paymentMethod ?? 'COD',
        o.subtotal.toString(), o.deliveryFee.toString(), o.total.toString(),
        o.trackingNumber ?? '', o.courierName ?? '',
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success(`${orders.length} orders exported to CSV`);
  };

  const exportCustomersCSV = () => {
    // Combine real customers from orders + mock customers
    const fromOrders = orders.map((o, i) => ({
      id: `C-${String(i + 1).padStart(3, '0')}`, name: o.customer, email: o.email,
      phone: o.phone, address: `${o.address}, ${o.city}`,
      orderId: o.id, total: o.total.toString(), date: new Date(o.createdAt).toLocaleDateString(),
    }));
    const rows = [
      ['Customer ID', 'Name', 'Email', 'Phone', 'Address', 'Order ID', 'Order Total (LKR)', 'Order Date'],
      ...fromOrders.map(c => [c.id, c.name, c.email, c.phone, c.address, c.orderId, c.total, c.date]),
      ...mockCustomers.map((c, i) => [`C-MOCK-${i + 1}`, c.name, c.email, c.phone, '', '', c.spent.toString(), c.lastOrder]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Customer data exported to CSV');
  };

  const exportInvoicesPDF = () => {
    const win = window.open('', '_blank');
    if (!win) { toast.error('Popup blocked — please allow popups'); return; }

    const invoiceRows = orders.slice(0, 20).map(o => `
      <div style="page-break-inside:avoid;margin-bottom:32px;padding:24px;border:1px solid #eee;border-radius:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #A77F1B">
          <div><h2 style="margin:0;font-size:16px;letter-spacing:2px">GOLD BEAUTY</h2><p style="margin:2px 0 0;color:#A77F1B;font-size:9px;letter-spacing:3px">BY SHANI RANASINGHE</p></div>
          <div style="text-align:right"><p style="margin:0;font-size:9px;color:#999;letter-spacing:1px">INVOICE</p><p style="margin:4px 0;font-family:monospace;font-size:15px;color:#A77F1B;font-weight:bold">${o.id}</p><p style="margin:0;font-size:10px;color:#666">${new Date(o.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;font-size:12px">
          <div><p style="margin:0 0 4px;font-size:9px;color:#999;letter-spacing:1px;text-transform:uppercase">Billed To</p>
            <p style="margin:0;font-weight:bold">${o.customer}</p>
            <p style="margin:2px 0;color:#666">${o.phone}</p>
            ${o.email ? `<p style="margin:2px 0;color:#666">${o.email}</p>` : ''}
            <p style="margin:2px 0;color:#666">${o.address}, ${o.city}</p>
          </div>
          <div style="text-align:right"><p style="margin:0 0 4px;font-size:9px;color:#999;letter-spacing:1px;text-transform:uppercase">Payment</p>
            <p style="margin:0;font-weight:bold">${o.paymentMethod ?? 'COD'}</p>
            <span style="display:inline-block;margin-top:6px;padding:2px 10px;border-radius:99px;background:#FEF3C7;color:#92400E;font-size:10px">${o.status}</span>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px">
          <thead><tr style="background:#FAF8F4">
            <th style="text-align:left;padding:6px 8px;color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px">Product</th>
            <th style="text-align:center;padding:6px 8px;color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px">Qty</th>
            <th style="text-align:right;padding:6px 8px;color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px">Price</th>
            <th style="text-align:right;padding:6px 8px;color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px">Total</th>
          </tr></thead>
          <tbody>${o.items.map(item => `<tr style="border-bottom:1px solid #eee">
            <td style="padding:6px 8px">${item.productName}</td>
            <td style="padding:6px 8px;text-align:center">${item.quantity}</td>
            <td style="padding:6px 8px;text-align:right">LKR ${item.price.toLocaleString()}</td>
            <td style="padding:6px 8px;text-align:right">LKR ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>`).join('')}</tbody>
        </table>
        <div style="text-align:right;font-size:12px">
          <div style="margin-bottom:4px"><span style="color:#999;margin-right:24px">Subtotal</span><span>LKR ${o.subtotal.toLocaleString()}</span></div>
          <div style="margin-bottom:4px"><span style="color:#999;margin-right:24px">Delivery</span><span>${o.deliveryFee === 0 ? 'Complimentary' : 'LKR ' + o.deliveryFee.toLocaleString()}</span></div>
          <div style="font-weight:bold;font-size:14px;color:#A77F1B;border-top:1px solid #eee;padding-top:6px;margin-top:6px"><span style="margin-right:24px">Total</span><span>LKR ${o.total.toLocaleString()}</span></div>
        </div>
      </div>
    `).join('');

    win.document.write(`<!DOCTYPE html><html><head><title>Gold Beauty — All Invoices</title>
      <style>body{font-family:Georgia,serif;margin:0;padding:32px;color:#1a1a1a;background:#fff} @media print{body{padding:16px}} @page{size:A4;margin:15mm}</style>
    </head><body>
      <div style="text-align:center;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #A77F1B">
        <h1 style="font-size:28px;letter-spacing:4px;margin:0">GOLD BEAUTY FASHION</h1>
        <p style="color:#A77F1B;letter-spacing:3px;font-size:11px;margin:6px 0 0">ALL INVOICES — ${new Date().toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      ${invoiceRows || '<p style="text-align:center;color:#999;padding:40px">No live orders found. Place orders from the shop to generate invoices.</p>'}
      <div style="text-align:center;margin-top:32px;font-size:11px;color:#999">Gold Beauty Fashion · hello@goldbeauty.lk · goldbeauty.lk</div>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const storageStats = {
    orders: orders.length,
    ordersSize: new Blob([localStorage.getItem('gold_beauty_orders') ?? '']).size,
    configSize: new Blob([localStorage.getItem('gold_beauty_site_config') ?? '']).size,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data & Backup</h1>
        <p className="text-sm text-muted-foreground mt-1">Export, import, and manage your store data securely.</p>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: ShoppingBag, label: 'Live Orders', value: storageStats.orders.toString(), sub: `~${(storageStats.ordersSize / 1024).toFixed(1)} KB stored` },
          { icon: Users, label: 'Customers', value: (orders.length + mockCustomers.length).toString(), sub: 'Live + sample' },
          { icon: Database, label: 'Config Size', value: `${(storageStats.configSize / 1024).toFixed(1)} KB`, sub: 'Site configuration' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Card key={label} className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={17} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backup & Restore */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><FileJson size={17} className="text-primary" /></div>
            <div>
              <CardTitle className="text-base">Backup & Restore</CardTitle>
              <CardDescription>Full data backup includes all orders and site configuration.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportBackup} className="bg-primary hover:bg-accent text-white flex items-center gap-2">
              <Download size={15} /> Export Full Backup (JSON)
            </Button>
            <Button variant="outline" onClick={handlePreviewBackup} className="flex items-center gap-2">
              <Database size={15} /> Preview Backup Data
            </Button>
            <Button variant="outline" onClick={() => importRef.current?.click()} disabled={importing} className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
              <Upload size={15} /> {importing ? 'Importing...' : 'Restore from Backup'}
            </Button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>

          {backupPreview && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Backup Preview</p>
                <button onClick={() => setBackupPreview(null)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
              </div>
              <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-auto max-h-48 font-mono">
                {backupPreview.slice(0, 800)}...
              </pre>
            </div>
          )}

          <div className="p-3 rounded-md bg-amber-50 border border-amber-200 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">Importing a backup will overwrite current orders and settings. Make a backup first if needed.</p>
          </div>
        </CardContent>
      </Card>

      {/* CSV Exports */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center"><FileText size={17} className="text-green-700" /></div>
            <div>
              <CardTitle className="text-base">Export Data</CardTitle>
              <CardDescription>Export orders, customers, and invoices in various formats.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                title: 'Orders Export (CSV)',
                desc: `${orders.length} live orders with full details — ID, customer, items, tracking, totals`,
                icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50',
                action: exportOrdersCSV, label: 'Export Orders CSV',
              },
              {
                title: 'Customer Data (CSV)',
                desc: `${orders.length + mockCustomers.length} customers with contact info, order history`,
                icon: Users, color: 'text-purple-600', bg: 'bg-purple-50',
                action: exportCustomersCSV, label: 'Export Customers CSV',
              },
              {
                title: 'All Invoices (PDF)',
                desc: `Print all ${orders.length} live order invoices in A4 format`,
                icon: FileText, color: 'text-primary', bg: 'bg-amber-50',
                action: exportInvoicesPDF, label: 'Generate All Invoices PDF',
              },
            ].map(({ title, desc, icon: Icon, color, bg, action, label }) => (
              <div key={title} className="flex items-center justify-between p-4 rounded-lg border border-border bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={action} className="flex items-center gap-2 shrink-0">
                  <Download size={14} /> {label}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Health */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Data Health Check</CardTitle>
          <CardDescription>Overview of stored data integrity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Orders data', ok: true, detail: `${orders.length} records in localStorage` },
              { label: 'Site configuration', ok: !!localStorage.getItem('gold_beauty_site_config'), detail: 'Config stored' },
              { label: 'Order ID sequence', ok: !!localStorage.getItem('gold_beauty_order_seq'), detail: `Current seq: ${localStorage.getItem('gold_beauty_order_seq') ?? '0'}` },
            ].map(({ label, ok, detail }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
                {ok ? <CheckCircle size={16} className="text-green-600 shrink-0" /> : <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {ok ? 'OK' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
