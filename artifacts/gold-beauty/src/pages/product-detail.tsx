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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#FAF8F4]"
      >
        <h1 className="font-serif text-4xl mb-4 text-foreground">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The luxury item you are looking for does not exist.</p>
        <Link href="/shop">
          <button className="bg-primary text-primary-foreground px-8 py-3 tracking-widest text-xs font-semibold hover:bg-accent transition-colors shadow-md">
            RETURN TO SHOP
          </button>
        </Link>
      </motion.div>
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-[#FAF8F4] pb-20"
    >
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center text-xs tracking-[0.2em] font-medium text-muted-foreground">
            <Link href="/"><span className="hover:text-primary cursor-pointer transition-colors">HOME</span></Link>
            <span className="mx-3 text-border">/</span>
            <Link href="/shop"><span className="hover:text-primary cursor-pointer transition-colors">SHOP</span></Link>
            <span className="mx-3 text-border">/</span>
            <Link href={`/shop?category=${product.category}`}><span className="hover:text-primary cursor-pointer transition-colors uppercase">{product.category}</span></Link>
            <span className="mx-3 text-border">/</span>
            <span className="text-foreground truncate uppercase">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="aspect-square bg-white border border-border flex items-center justify-center p-8 shadow-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x800/FAF8F4/A77F1B?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase mb-4">{product.category}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <p className="font-sans text-2xl md:text-3xl font-medium tracking-wide text-foreground">
                LKR {product.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 bg-white border border-border px-3 py-1.5 shadow-sm">
                <Star size={16} className="text-primary" fill="currentColor" />
                <span className="text-sm font-semibold text-foreground ml-1">{product.rating}</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base mb-8 border-b border-border pb-8">
              {product.description}
            </p>

            {/* Benefits */}
            <div className="mb-10">
              <h3 className="text-xs font-semibold tracking-[0.2em] mb-5 uppercase text-foreground">Key Benefits</h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-medium">
                    <span className="text-primary text-lg leading-none mt-[-2px]">•</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart Actions */}
            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center border border-border bg-white h-14 w-full sm:w-36 shrink-0 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 flex justify-center items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <button 
                  onClick={handleAdd}
                  className="flex-1 h-14 bg-primary text-primary-foreground flex items-center justify-center gap-3 font-semibold tracking-widest text-sm hover:bg-accent transition-all duration-300 shadow-[0_4px_15px_rgba(167,127,27,0.3)]"
                >
                  <ShoppingBag size={18} />
                  ADD TO CART - LKR {(product.price * quantity).toLocaleString()}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
                <div className="flex flex-col items-center text-center gap-3 text-muted-foreground">
                  <Truck size={24} strokeWidth={1.5} className="text-primary" />
                  <span className="text-[0.65rem] font-semibold tracking-widest uppercase">Free Delivery<br/>Over 10k</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 text-muted-foreground">
                  <ShieldCheck size={24} strokeWidth={1.5} className="text-primary" />
                  <span className="text-[0.65rem] font-semibold tracking-widest uppercase">Authentic<br/>Guaranteed</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 text-muted-foreground">
                  <RotateCcw size={24} strokeWidth={1.5} className="text-primary" />
                  <span className="text-[0.65rem] font-semibold tracking-widest uppercase">14-Day<br/>Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24 border-t border-border bg-white py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-4xl text-foreground">Perfect Pairings</h2>
            <Link href="/shop">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer uppercase flex items-center gap-2">
                Discover More <ArrowLeft size={16} className="rotate-180" />
              </span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}