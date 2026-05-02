import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  BarChart3, 
  Palette, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  Clock
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    setLocation('/admin/login');
  };

  const getPageTitle = () => {
    if (location === '/admin/dashboard') return 'Dashboard';
    if (location === '/admin/orders') return 'Orders';
    if (location === '/admin/products') return 'Products';
    if (location === '/admin/customers') return 'Customers';
    if (location === '/admin/website-editor') return 'Website Editor';
    if (location === '/admin/analytics') return 'Analytics';
    if (location === '/admin/settings') return 'Settings';
    return 'Admin';
  };

  const navItems = [
    { group: 'GENERAL', items: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/orders', icon: ShoppingBag, label: 'Orders', badge: '24' },
      { path: '/admin/products', icon: Package, label: 'Products' },
      { path: '/admin/customers', icon: Users, label: 'Customers', badge: '6' },
    ]},
    { group: 'TOOLS', items: [
      { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { path: '/admin/website-editor', icon: Palette, label: 'Website Editor' },
      { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ]}
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div>
            <h2 className="font-bold text-lg leading-tight">GB Admin</h2>
            <p className="text-xs text-muted-foreground">Gold Beauty Fashion</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
          {navItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 px-3">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer border-l-2",
                        isActive 
                          ? "bg-amber-50 text-primary border-primary font-medium" 
                          : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      )}>
                        <div className="flex items-center gap-3">
                          <item.icon size={18} />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            isActive ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-600"
                          )}>
                            {item.badge}
                          </span>
                        )}
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
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Pages</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{getPageTitle()}</span>
          </div>

          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="search" 
              placeholder="Search items, categories, or more..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 text-muted-foreground">
            <button className="hover:text-foreground transition-colors"><Clock size={20} strokeWidth={1.5} /></button>
            <button className="hover:text-foreground transition-colors relative">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-white"></span>
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

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
