import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const deliveryFee = cartTotal > 10000 ? 0 : 500;
  const finalTotal = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full min-h-[70vh] bg-[#FAF8F4] flex flex-col items-center justify-center p-4 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-white border border-border shadow-sm flex items-center justify-center mb-8 text-primary">
          <ShoppingBag size={40} strokeWidth={1} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-6 text-foreground">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
          Discover our luxurious collection of premium cosmetics and elevate your beauty routine today.
        </p>
        <Link href="/shop">
          <button className="bg-primary text-primary-foreground px-10 py-4 tracking-[0.2em] text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-3 shadow-md">
            CONTINUE SHOPPING <ArrowRight size={16} />
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-[#FAF8F4] py-12 md:py-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 pb-6 border-b border-border text-foreground">Your Selection</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3">
            <div className="hidden md:grid grid-cols-12 text-xs tracking-widest text-muted-foreground uppercase pb-4 border-b border-border mb-6 font-semibold">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-6 md:space-y-0 md:divide-y md:divide-border bg-white border border-border p-6 shadow-sm">
              {items.map((item) => (
                <motion.div 
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col md:grid md:grid-cols-12 items-center gap-4 py-6"
                >
                  {/* Product Details */}
                  <div className="col-span-6 flex items-center gap-6 w-full">
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="md:hidden absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="w-24 h-24 shrink-0 border border-border bg-[#FAF8F4] p-2">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-primary font-semibold tracking-widest uppercase mb-1">{item.product.category}</p>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-serif text-xl md:text-lg hover:text-primary transition-colors cursor-pointer text-foreground">{item.product.name}</h3>
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="hidden md:flex items-center text-xs text-muted-foreground hover:text-destructive mt-3 tracking-widest transition-colors font-medium"
                      >
                        <X size={14} className="mr-1" /> REMOVE
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout Helpers */}
                  <div className="flex md:hidden w-full items-center justify-between mt-4 border-t border-border pt-4">
                    <p className="font-sans font-semibold text-foreground">LKR {item.product.price.toLocaleString()}</p>
                    <div className="flex items-center border border-border bg-background h-10 w-28">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex-1 flex justify-center items-center hover:text-primary"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex-1 flex justify-center items-center hover:text-primary"><Plus size={14} /></button>
                    </div>
                  </div>

                  {/* Desktop Columns */}
                  <div className="col-span-2 text-center hidden md:block font-semibold text-foreground">
                    LKR {item.product.price.toLocaleString()}
                  </div>
                  
                  <div className="col-span-2 flex justify-center hidden md:flex">
                    <div className="flex items-center border border-border bg-background h-10 w-24">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right hidden md:block font-semibold text-primary">
                    LKR {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </motion.div>
              ))}
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
                  <div className="bg-primary/5 border border-primary/20 p-4 mt-4 text-center">
                    <p className="text-xs text-primary font-medium tracking-wide leading-relaxed">
                      Add LKR {(10000 - cartTotal).toLocaleString()} more to your cart to enjoy free delivery!
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-end border-t border-border pt-6 mb-8">
                <span className="text-sm font-bold tracking-widest uppercase text-foreground">Total</span>
                <span className="font-serif text-3xl md:text-4xl text-primary">LKR {finalTotal.toLocaleString()}</span>
              </div>
              
              <button className="w-full bg-primary text-primary-foreground py-4 tracking-widest text-xs font-semibold hover:bg-accent transition-colors shadow-md">
                PROCEED TO CHECKOUT
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground tracking-wide font-medium">
                <ShieldCheck size={16} className="text-primary" /> SECURE CHECKOUT
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}