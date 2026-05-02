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
    }, 800);
  };

  const steps = [
    { id: 1, label: 'Order Placed', date: 'Oct 24, 09:30 AM', icon: Package, completed: true },
    { id: 2, label: 'Processing', date: 'Oct 24, 02:15 PM', icon: Clock, completed: true },
    { id: 3, label: 'Shipped', date: 'Oct 25, 10:00 AM', icon: Truck, completed: true },
    { id: 4, label: 'Out for Delivery', date: 'Oct 26, 08:30 AM', icon: MapPin, completed: false, current: true },
    { id: 5, label: 'Delivered', date: 'Estimated: Oct 26', icon: CheckCircle, completed: false }
  ];

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Track Your Glow</h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase max-w-xl mx-auto">
            Follow your luxury beauty package to your doorstep
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Tracking Form */}
          <div className="bg-card border border-border p-6 md:p-8 mb-12">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="orderId" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Order Number</label>
                  <input 
                    id="orderId"
                    type="text" 
                    placeholder="e.g. GB-84729" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Phone Number</label>
                  <input 
                    id="phone"
                    type="tel" 
                    placeholder="e.g. 077 123 4567" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isTracking}
                className="w-full bg-primary text-primary-foreground py-4 tracking-widest text-xs font-semibold hover:bg-accent transition-colors flex justify-center items-center gap-2"
              >
                {isTracking ? 'LOCATING...' : <><Search size={16} /> TRACK PACKAGE</>}
              </button>
            </form>
          </div>

          {/* Tracking Results */}
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-6 md:p-8"
            >
              <div className="flex justify-between items-end mb-8 border-b border-border pb-6">
                <div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Order Status</p>
                  <h3 className="font-serif text-2xl text-primary">{orderId}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Carrier</p>
                  <p className="font-semibold text-foreground tracking-wide">Gold Beauty Express</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative ml-4 md:ml-8 space-y-8">
                {/* Vertical Line */}
                <div className="absolute top-2 bottom-6 left-[-1px] w-0.5 bg-border -z-10" />
                <div 
                  className="absolute top-2 left-[-1px] w-0.5 bg-primary -z-10 transition-all duration-1000" 
                  style={{ height: '65%' }} 
                />

                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="relative flex items-start gap-6">
                      {/* Node */}
                      <div className={`
                        absolute -left-4 md:-left-8 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 
                        ${step.completed ? 'bg-primary border-primary text-primary-foreground' : 
                          step.current ? 'bg-background border-primary text-primary shadow-[0_0_10px_rgba(167,127,27,0.5)]' : 
                          'bg-background border-border text-muted-foreground'}
                      `}>
                        {step.completed ? <CheckCircle size={16} /> : <span className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 ml-4 md:ml-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className={`font-semibold tracking-wide ${step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </h4>
                          <span className="text-xs text-muted-foreground tracking-wider">{step.date}</span>
                        </div>
                        {step.current && (
                          <div className="mt-3 p-4 bg-primary/10 border border-primary/20 rounded-none text-sm text-foreground flex items-start gap-3">
                            <Icon className="text-primary mt-0.5 shrink-0" size={18} />
                            <p>Your package is out for delivery in Colombo 07 area. Our rider will contact you shortly before arrival.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
