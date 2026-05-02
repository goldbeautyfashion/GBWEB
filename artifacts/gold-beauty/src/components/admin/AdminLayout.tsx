import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Palette, Settings, LogOut, Search, Bell, TrendingUp, Database,
} from 'lucide-react';

interface AdminLayoutProps { children: ReactNode; }

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { logout } = useAdminAuth();

  const handleLogout = () => { logout(); setLocation('/admin/login'); };

  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/products': 'Products',
    '/admin/customers': 'Customers',
    '/admin/website-editor': 'Website Editor',
    '/admin/analytics': 'Analytics',
    '/admin/settings': 'Settings',
    '/admin/financial-report': 'Financial Report',
    '/admin/data-management': 'Data Management',
  };

  const navItems = [
    {
      group: 'STORE', items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
      ]
    },
    {
      group: 'TOOLS', items: [
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/admin/financial-report', icon: TrendingUp, label: 'Financial Report' },
        { path: '/admin/website-editor', icon: Palette, label: 'Website Editor' },
      ]
    },
    {
      group: 'ADMIN', items: [
        { path: '/admin/data-management', icon: Database, label: 'Data & Backup' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-foreground font-sans">
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div>
            <h2 className="font-bold text-lg leading-tight">GB Admin</h2>
            <p className="text-xs text-muted-foreground">Gold Beauty Fashion</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-4">
          {navItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-1.5 px-3">
                {group.group}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer border-l-2 text-sm',
                        isActive
                          ? 'bg-amber-50 text-primary border-primary font-medium'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      )}>
                        <item.icon size={17} />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md w-full transition-colors text-sm font-medium"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Pages</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{titles[location] ?? 'Admin'}</span>
          </div>

          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <button className="hover:text-foreground transition-colors relative">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-white" />
            </button>
            <Link href="/admin/settings">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                <Settings size={20} strokeWidth={1.5} />
              </span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold border border-primary/20">
              SR
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
