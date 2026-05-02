import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setLocation('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FAF8F4] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10 border border-border"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold tracking-widest text-foreground mb-2">
            GOLD BEAUTY
          </h1>
          <p className="text-sm tracking-widest text-muted-foreground uppercase">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium tracking-wide text-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-destructive text-xs mt-2">Incorrect password. Please try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold tracking-wider py-3 rounded-md transition-colors"
          >
            SIGN IN
          </button>
        </form>
      </motion.div>
    </div>
  );
}
