import { Link } from 'wouter';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      <Link href={`/product/${product.id}`}>
        <div className="cursor-pointer relative aspect-square overflow-hidden bg-background">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x600/1e120f/a77f1b?text=${encodeURIComponent(product.name)}`;
            }}
          />
          {/* Overlay Add to Cart button on desktop */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center backdrop-blur-[2px]">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="bg-primary text-primary-foreground px-6 py-3 tracking-widest text-xs font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              ADD TO CART
            </button>
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[0.65rem] text-primary tracking-widest uppercase">{product.category}</p>
          <div className="flex items-center gap-1 text-primary">
            <Star size={12} fill="currentColor" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg text-foreground mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between">
          <p className="font-sans font-medium tracking-wider text-foreground">
            LKR {product.price.toLocaleString()}
          </p>
          
          {/* Mobile add to cart */}
          <button 
            onClick={() => addToCart(product)}
            className="md:hidden h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
