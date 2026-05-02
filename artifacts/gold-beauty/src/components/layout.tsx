import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { itemCount } = useCart();

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/shop', label: 'SHOP' },
    { href: '/track-order', label: 'TRACK ORDER' },
    { href: '/about', label: 'ABOUT' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs font-semibold py-2 px-4 text-center tracking-widest uppercase z-50 relative">
        COMPLIMENTARY ISLAND-WIDE DELIVERY ON ALL ORDERS OVER RS. 10,000
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Nav Left */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className={cn(
                    "text-sm tracking-[0.2em] font-medium transition-colors hover:text-primary cursor-pointer",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <Link href="/">
                <span className="cursor-pointer block">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-foreground">
                    GOLD BEAUTY
                  </h1>
                  <p className="text-[0.6rem] md:text-xs tracking-[0.3em] text-primary mt-1">
                    BY SHANI RANASINGHE
                  </p>
                </span>
              </Link>
            </div>

            {/* Desktop Nav Right */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <Link href="/about">
                <span className="hidden lg:block text-sm tracking-[0.2em] font-medium transition-colors hover:text-primary cursor-pointer text-muted-foreground mr-2">
                  ABOUT
                </span>
              </Link>
              <button className="text-foreground hover:text-primary transition-colors p-2">
                <User size={20} strokeWidth={1.5} />
              </button>
              <Link href="/cart">
                <span className="text-foreground hover:text-primary transition-colors p-2 relative cursor-pointer block">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[0.65rem] font-bold h-4 w-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                      {itemCount}
                    </span>
                  )}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border animate-in slide-in-from-top-2">
            <nav className="flex flex-col py-4 px-6 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={cn(
                      "text-sm tracking-[0.2em] font-medium py-2 border-b border-border/50 block cursor-pointer",
                      location === link.href ? "text-primary" : "text-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 md:py-16 mt-auto">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="font-serif text-2xl font-bold tracking-widest text-foreground mb-2">
                GOLD BEAUTY
              </h2>
              <p className="text-xs tracking-[0.2em] text-primary mb-6">
                BY SHANI RANASINGHE
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                A premium cosmetics house for the modern Sri Lankan woman. Bold, vibrant, unapologetically luxurious.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold tracking-widest text-foreground mb-6">SHOP</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/shop"><span className="hover:text-primary transition-colors cursor-pointer">All Products</span></Link></li>
                <li><Link href="/shop"><span className="hover:text-primary transition-colors cursor-pointer">Best Sellers</span></Link></li>
                <li><Link href="/shop"><span className="hover:text-primary transition-colors cursor-pointer">New Arrivals</span></Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold tracking-widest text-foreground mb-6">SUPPORT</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/track-order"><span className="hover:text-primary transition-colors cursor-pointer">Track Order</span></Link></li>
                <li><Link href="#"><span className="hover:text-primary transition-colors cursor-pointer">Shipping & Returns</span></Link></li>
                <li><Link href="#"><span className="hover:text-primary transition-colors cursor-pointer">Contact Us</span></Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold tracking-widest text-foreground mb-6">CONNECT</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center md:text-left">
                Join our newsletter for exclusive offers and beauty tips.
              </p>
              <div className="flex w-full max-w-sm">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="flex-grow bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold tracking-wider hover:bg-accent transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-muted-foreground tracking-wider">
            <p>© 2024 Gold Beauty Fashion By Shani Ranasinghe. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#"><span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span></Link>
              <Link href="#"><span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
