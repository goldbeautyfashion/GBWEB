import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, ShieldCheck, Printer, CheckCircle, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders, Order } from '@/context/OrderContext';
import { toast } from 'sonner';

function CheckoutModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (order: Order) => void }) {
  const { items, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const deliveryFee = cartTotal > 10000 ? 0 : 500;

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Colombo' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const order = placeOrder(form.name, form.email, form.phone, form.address, form.city, items, cartTotal, deliveryFee);
      clearCart();
      setLoading(false);
      onSuccess(order);
    }, 1000);
  };

  const Field = ({ label, id, type = 'text', required = false }: { label: string; id: keyof typeof form; type?: string; required?: boolean }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{label}{required && ' *'}</label>
      <input
        type={type}
        value={form[id]}
        onChange={e => { setForm(p => ({ ...p, [id]: e.target.value })); setErrors(p => ({ ...p, [id]: '' })); }}
        className={`w-full bg-[#FFF5F8] border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors ${errors[id] ? 'border-destructive' : 'border-border'}`}
      />
      {errors[id] && <p className="text-destructive text-xs">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-2xl text-foreground">Complete Your Order</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary mini */}
          <div className="bg-[#FFF5F8] border border-border p-4 space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Order Summary</p>
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-foreground">{item.product.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                <span className="font-semibold text-foreground">LKR {(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span>{deliveryFee === 0 ? <span className="text-primary text-xs tracking-widest">COMPLIMENTARY</span> : `LKR ${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary font-serif text-lg">LKR {(cartTotal + deliveryFee).toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Delivery Details</p>
            <Field label="Full Name" id="name" required />
            <Field label="Email Address" id="email" type="email" />
            <Field label="Phone Number" id="phone" required />
            <Field label="Delivery Address" id="address" required />
            <Field label="City" id="city" required />
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 text-xs text-foreground tracking-wide leading-relaxed">
            <ShieldCheck size={14} className="inline text-primary mr-2" />
            Cash on Delivery (COD) is available. We'll confirm your order via phone before dispatch.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 tracking-[0.2em] text-xs font-bold hover:bg-accent transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? 'PLACING ORDER...' : <><Package size={16} /> PLACE ORDER</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [, setLocation] = useLocation();

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Success Header */}
        <div className="bg-primary/5 border-b border-border p-6 text-center">
          <CheckCircle className="mx-auto text-primary mb-3" size={48} />
          <h2 className="font-serif text-2xl text-foreground mb-1">Order Confirmed!</h2>
          <p className="text-sm text-muted-foreground">Your order has been placed successfully.</p>
        </div>

        {/* Invoice */}
        <div className="p-6 print:p-8" id="invoice-content">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="font-serif text-xl font-bold tracking-widest text-foreground">GOLD BEAUTY</h1>
              <p className="text-[0.65rem] tracking-[0.25em] text-primary">BY SHANI RANASINGHE</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold">Invoice</p>
              <p className="font-mono text-sm font-bold text-primary mt-1">{order.id}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Bill To</p>
              <p className="font-semibold text-foreground">{order.customer}</p>
              {order.email && <p className="text-muted-foreground text-xs">{order.email}</p>}
              <p className="text-muted-foreground text-xs">{order.phone}</p>
              <p className="text-muted-foreground text-xs mt-1">{order.address}</p>
              <p className="text-muted-foreground text-xs">{order.city}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Order Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">{order.status}</span>
              <p className="text-xs text-muted-foreground mt-2">Payment: Cash on Delivery</p>
            </div>
          </div>

          <div className="border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[#FFF5F8]">
                <tr>
                  <th className="text-left px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">Product</th>
                  <th className="text-center px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">Qty</th>
                  <th className="text-right px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">Price</th>
                  <th className="text-right px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">LKR {item.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">LKR {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border p-4 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>LKR {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? 'Complimentary' : `LKR ${order.deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                <span>Grand Total</span>
                <span className="text-primary font-serif text-lg">LKR {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4 tracking-wide">
            Thank you for your purchase! For any queries: hello@goldbeauty.lk
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <button onClick={handlePrint} className="flex-1 border border-primary text-primary py-3 tracking-widest text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
            <Printer size={16} /> PRINT INVOICE
          </button>
          <button onClick={() => { onClose(); setLocation('/track-order'); }} className="flex-1 bg-primary text-primary-foreground py-3 tracking-widest text-xs font-semibold hover:bg-accent transition-colors flex items-center justify-center gap-2">
            <Package size={16} /> TRACK ORDER
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const deliveryFee = cartTotal > 10000 ? 0 : 500;
  const finalTotal = cartTotal + deliveryFee;
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !completedOrder) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full min-h-[70vh] bg-[#FFF5F8] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 rounded-full bg-white border border-border shadow-sm flex items-center justify-center mb-8 text-primary">
          <ShoppingBag size={40} strokeWidth={1} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-6 text-foreground">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">Discover our luxurious collection of premium cosmetics and elevate your beauty routine today.</p>
        <Link href="/shop">
          <button className="bg-primary text-primary-foreground px-10 py-4 tracking-[0.2em] text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-3 shadow-md">
            CONTINUE SHOPPING <ArrowRight size={16} />
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full min-h-screen bg-[#FFF5F8] py-12 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 pb-6 border-b border-border text-foreground">Your Selection</h1>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="hidden md:grid grid-cols-12 text-xs tracking-widest text-muted-foreground uppercase pb-4 border-b border-border mb-6 font-semibold">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-6 md:space-y-0 md:divide-y md:divide-border bg-white border border-border p-6 shadow-sm">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div key={item.product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:grid md:grid-cols-12 items-center gap-4 py-6">
                      <div className="col-span-6 flex items-center gap-6 w-full">
                        <div className="w-24 h-24 shrink-0 border border-border bg-[#FFF5F8] p-2">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[0.65rem] text-primary font-semibold tracking-widest uppercase mb-1">{item.product.category}</p>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-serif text-xl md:text-lg hover:text-primary transition-colors cursor-pointer text-foreground">{item.product.name}</h3>
                          </Link>
                          <button onClick={() => removeFromCart(item.product.id)} className="hidden md:flex items-center text-xs text-muted-foreground hover:text-destructive mt-3 tracking-widest transition-colors font-medium">
                            <X size={14} className="mr-1" /> REMOVE
                          </button>
                        </div>
                      </div>

                      <div className="flex md:hidden w-full items-center justify-between mt-4 border-t border-border pt-4">
                        <p className="font-sans font-semibold text-foreground">LKR {item.product.price.toLocaleString()}</p>
                        <div className="flex items-center border border-border bg-background h-10 w-28">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex-1 flex justify-center items-center hover:text-primary"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex-1 flex justify-center items-center hover:text-primary"><Plus size={14} /></button>
                        </div>
                      </div>

                      <div className="col-span-2 text-center hidden md:block font-semibold text-foreground">LKR {item.product.price.toLocaleString()}</div>
                      <div className="col-span-2 flex justify-center hidden md:flex">
                        <div className="flex items-center border border-border bg-background h-10 w-24">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"><Plus size={14} /></button>
                        </div>
                      </div>
                      <div className="col-span-2 text-right hidden md:block font-semibold text-primary">LKR {(item.product.price * item.quantity).toLocaleString()}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white border border-border shadow-sm p-6 md:p-8 sticky top-28">
                <h2 className="font-serif text-3xl mb-6 border-b border-border pb-4 text-foreground">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wide">Subtotal</span>
                    <span className="font-semibold text-foreground">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wide">Delivery</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? <span className="text-primary uppercase text-xs tracking-widest">Complimentary</span> : <span className="text-foreground">LKR {deliveryFee.toLocaleString()}</span>}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="bg-primary/5 border border-primary/20 p-4 text-center">
                      <p className="text-xs text-primary font-medium tracking-wide leading-relaxed">Add LKR {(10000 - cartTotal).toLocaleString()} more for free delivery!</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end border-t border-border pt-6 mb-8">
                  <span className="text-sm font-bold tracking-widest uppercase text-foreground">Total</span>
                  <span className="font-serif text-3xl md:text-4xl text-primary">LKR {finalTotal.toLocaleString()}</span>
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full bg-primary text-primary-foreground py-4 tracking-widest text-xs font-semibold hover:bg-accent transition-colors shadow-md flex items-center justify-center gap-2">
                  <Package size={16} /> PROCEED TO CHECKOUT
                </button>
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground tracking-wide font-medium">
                  <ShieldCheck size={16} className="text-primary" /> SECURE CHECKOUT
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={(order) => {
            setShowCheckout(false);
            setCompletedOrder(order);
            toast.success(`Order ${order.id} placed!`);
          }}
        />
      )}

      {completedOrder && (
        <InvoiceModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}
    </>
  );
}
