import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [, setLocation] = useLocation();
  const { login } = useAdminAuth();
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');
    if (value && index < 3) pinRefs[index + 1].current?.focus();
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError('Too many failed attempts. Please refresh the page.');
      return;
    }
    const pinStr = pin.join('');
    if (!username || !password || pinStr.length < 4) {
      setError('Please fill in all fields including the 4-digit PIN.');
      return;
    }
    const ok = login(username, password, pinStr);
    if (ok) {
      setLocation('/admin/dashboard');
    } else {
      setAttempts(prev => prev + 1);
      setError('Invalid credentials. Please check your username, password, and PIN.');
      setPin(['', '', '', '']);
      pinRefs[0].current?.focus();
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#FFF5F8] p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary px-8 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
            <Shield size={26} className="text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-widest text-white">GOLD BEAUTY</h1>
          <p className="text-xs tracking-[0.25em] text-white/70 mt-1 uppercase">Secure Admin Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Username</label>
            <input
              type="text"
              value={username}
              autoComplete="username"
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-foreground"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm text-foreground pr-12"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* 4-digit PIN */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              <Lock size={12} /> Security PIN
            </label>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={pinRefs[i]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handlePinChange(i, e.target.value)}
                  onKeyDown={e => handlePinKeyDown(i, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-border rounded-lg bg-gray-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">Enter your 4-digit security PIN</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Shield size={14} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-destructive text-xs leading-snug">{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={attempts >= 5}
            className="w-full bg-primary hover:bg-accent disabled:opacity-50 text-primary-foreground font-semibold tracking-[0.15em] py-3.5 rounded-lg transition-colors text-sm mt-2"
          >
            SIGN IN
          </button>
        </form>

        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            Access via direct URL only · Not publicly linked
          </p>
        </div>
      </motion.div>
    </div>
  );
}
