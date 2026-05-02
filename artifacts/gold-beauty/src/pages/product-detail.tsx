import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/product-card';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const id = params?.id;
  
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The luxury item you are looking for does not exist.</p>
        <Link href="/shop">
          <button className="bg-primary text-primary-foreground px-8 py-3 tracking-widest text-xs font-semibold hover:bg-accent transition-colors">
            RETURN TO SHOP
          </button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
    
  if (relatedProducts.length < 4) {
    const more = products.filter(p => p.id !== product.id && !relatedProducts.includes(p)).slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...more);
  }

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center text-xs tracking-widest text-muted-foreground">
            <Link href="/"><span className="hover:text-primary cursor-pointer transition-colors">HOME</span></Link>
            <span className="mx-2">/</span>
            <Link href="/shop"><span className="hover:text-primary cursor-pointer transition-colors">SHOP</span></Link>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${product.category}`}><span className="hover:text-primary cursor-pointer transition-colors uppercase">{product.category}</span></Link>
            <span className="mx-2">/</span>
            <span className="text-foreground truncate uppercase">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2"
          >
            <div className="aspect-square bg-card border border-border flex items-center justify-center p-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x800/1e120f/a77f1b?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">{product.category}</p>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <p className="font-sans text-xl md:text-2xl tracking-wider text-foreground">
                LKR {product.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 bg-card border border-border px-3 py-1">
                <Star size={14} className="text-primary" fill="currentColor" />
                <span className="text-xs font-semibold">{product.rating}</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8 border-b border-border pb-8">
              {product.description}
            </p>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-widest mb-4">KEY BENEFITS</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart Actions */}
            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border bg-card h-14 w-full sm:w-32 shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={handleAdd}
                  className="flex-1 h-14 bg-primary text-primary-foreground flex items-center justify-center gap-2 font-semibold tracking-widest hover:bg-accent transition-all duration-300 shadow-[0_0_15px_rgba(167,127,27,0.2)]"
                >
                  <ShoppingBag size={18} />
                  ADD TO CART - LKR {(product.price * quantity).toLocaleString()}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
                  <Truck size={20} strokeWidth={1.5} className="text-primary" />
                  <span className="text-[0.65rem] tracking-wider uppercase">Free Delivery<br/>Over 10k</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
                  <ShieldCheck size={20} strokeWidth={1.5} className="text-primary" />
                  <span className="text-[0.65rem] tracking-wider uppercase">Authentic<br/>Guaranteed</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
                  <RotateCcw size={20} strokeWidth={1.5} className="text-primary" />
                  <span className="text-[0.65rem] tracking-wider uppercase">14-Day<br/>Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20 border-t border-border bg-card py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl">Perfect Pairings</h2>
            <Link href="/shop">
              <span className="text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer uppercase flex items-center gap-1">
                More <ArrowLeft size={14} className="rotate-180" />
              </span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
