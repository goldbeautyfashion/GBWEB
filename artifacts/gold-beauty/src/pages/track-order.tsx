import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, Search } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;
    
    setIsTracking(true);
    // Simulate API call
    setTimeout(() => {
      setIsTracking(false);
      setHasSearched(true);
    }, 1200);
  };

  const steps = [
    { id: 1, label: 'Order Placed', date: 'Oct 24, 09:30 AM', icon: Package, completed: true },
    { id: 2, label: 'Processing', date: 'Oct 24, 02:15 PM', icon: Clock, completed: true },
    { id: 3, label: 'Shipped', date: 'Oct 25, 10:00 AM', icon: Truck, completed: true },
    { id: 4, label: 'Out for Delivery', date: 'Oct 26, 08:30 AM', icon: MapPin, completed: false, current: true },
    { id: 5, label: 'Delivered', date: 'Estimated: Oct 26', icon: CheckCircle, completed: false }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-[#FAF8F4] pb-24"
    >
      {/* Header */}
      <div className="bg-white border-b border-border py-16 md:py-24 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">Track Your Glow</h1>
          <p className="text-muted-foreground text-sm tracking-[0.2em] font-medium uppercase max-w-xl mx-auto">
            Follow your luxury beauty package to your doorstep
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Tracking Form */}
          <div className="bg-white border border-border p-8 md:p-12 mb-12 shadow-sm">
            <form onSubmit={handleTrack} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="orderId" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Order Number</label>
                  <input 
                    id="orderId"
                    type="text" 
                    placeholder="e.g. GB-84729" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="phone" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Phone Number</label>
                  <input 
                    id="phone"
                    type="tel" 
                    placeholder="e.g. 077 123 4567" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isTracking}
                className="w-full bg-primary text-primary-foreground py-5 tracking-[0.2em] text-xs font-bold hover:bg-accent transition-colors flex justify-center items-center gap-3 shadow-md"
              >
                {isTracking ? 'LOCATING...' : <><Search size={18} /> TRACK PACKAGE</>}
              </button>
            </form>
          </div>

          {/* Tracking Results */}
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-border p-8 md:p-12 shadow-sm"
            >
              <div className="flex justify-between items-end mb-10 border-b border-border pb-8">
                <div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-2">Order Status</p>
                  <h3 className="font-serif text-3xl text-primary">{orderId}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold mb-2">Carrier</p>
                  <p className="font-serif text-xl text-foreground tracking-wide">Gold Beauty Express</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative ml-4 md:ml-10 space-y-10 py-4">
                {/* Vertical Line */}
                <div className="absolute top-4 bottom-8 left-[-1px] w-0.5 bg-border -z-10" />
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '65%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="absolute top-4 left-[-1px] w-0.5 bg-primary -z-10" 
                />

                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div 
                      key={step.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="relative flex items-start gap-8"
                    >
                      {/* Node */}
                      <div className={`
                        absolute -left-[2.1rem] md:-left-[2.85rem] mt-0.5 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white
                        ${step.completed ? 'border-primary text-primary' : 
                          step.current ? 'border-primary text-primary shadow-[0_0_15px_rgba(167,127,27,0.3)]' : 
                          'border-border text-muted-foreground'}
                      `}>
                        {step.completed ? <CheckCircle size={20} fill="var(--color-primary)" className="text-white" /> : 
                         step.current ? <span className="w-3 h-3 rounded-full bg-primary" /> :
                         <span className="w-2 h-2 rounded-full bg-border" />}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 ml-4 md:ml-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className={`font-serif text-xl ${step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </h4>
                          <span className="text-xs text-muted-foreground tracking-widest font-medium">{step.date}</span>
                        </div>
                        {step.current && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ delay: 0.8 }}
                            className="mt-4 p-5 bg-[#FAF8F4] border border-primary/20 text-sm text-foreground flex items-start gap-4 shadow-sm"
                          >
                            <Icon className="text-primary mt-0.5 shrink-0" size={20} />
                            <p className="leading-relaxed">Your package is out for delivery in Colombo 07 area. Our rider will contact you shortly before arrival.</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}