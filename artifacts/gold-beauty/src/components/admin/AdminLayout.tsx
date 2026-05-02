import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  Palette, Settings, LogOut, Bell, TrendingUp, Database,
  Sparkles,
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
    '/admin/settings': 'Settings',
    '/admin/financial-report': 'Financial Report',
    '/admin/data-management': 'Data Management',
  };

  const navItems = [
    {
      group: 'STORE',
      items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
      ]
    },
    {
      group: 'TOOLS',
      items: [
        { path: '/admin/financial-report', icon: TrendingUp, label: 'Financial Report' },
        { path: '/admin/website-editor', icon: Palette, label: 'Website Editor' },
      ]
    },
    {
      group: 'ADMIN',
      items: [
        { path: '/admin/data-management', icon: Database, label: 'Data & Backup' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    },
  ];

  const currentTitle = titles[location] ?? 'Admin';

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white flex flex-col fixed h-full z-20 shadow-[1px_0_0_0_#E8E4DC]">

        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#EDE9E0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#A77F1B] to-[#C9A84C] flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide text-[#1A1A1A] leading-none">GB Admin</p>
              <p className="text-[11px] text-[#A77F1B] mt-0.5 font-medium tracking-widest uppercase">Gold Beauty</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
          {navItems.map((group, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#B8AFA0] uppercase px-3 mb-2">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span className={cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium',
                        isActive
                          ? 'bg-[#FBF7EE] text-[#A77F1B] shadow-[inset_0_0_0_1px_#E8D9A8]'
                          : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F8F5EF]'
                      )}>
                        <span className={cn(
                          'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                          isActive ? 'bg-[#A77F1B]/10' : 'bg-transparent'
                        )}>
                          <item.icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                        </span>
                        {item.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A77F1B]" />
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#EDE9E0] space-y-1">
          <Link href="/" target="_blank">
            <span className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F8F5EF] rounded-lg transition-all cursor-pointer font-medium">
              <span className="w-7 h-7 rounded-md bg-transparent flex items-center justify-center">
                <Package size={13} strokeWidth={1.8} />
              </span>
              View Website
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
          >
            <span className="w-7 h-7 rounded-md bg-transparent flex items-center justify-center">
              <LogOut size={13} strokeWidth={1.8} />
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="h-14 bg-white border-b border-[#EDE9E0] flex items-center justify-between px-7 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#B8AFA0] text-xs">Admin</span>
            <span className="text-[#D4CCBF] text-xs">›</span>
            <span className="font-semibold text-[#1A1A1A] text-sm">{currentTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8F5EF] transition-colors text-[#6B6560] hover:text-[#1A1A1A]">
              <Bell size={17} strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <Link href="/admin/settings">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8F5EF] transition-colors text-[#6B6560] hover:text-[#1A1A1A] cursor-pointer">
                <Settings size={17} strokeWidth={1.8} />
              </span>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A77F1B] to-[#C9A84C] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              SR
            </div>
          </div>
        </header>

        <main className="flex-1 p-7 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
