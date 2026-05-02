import { Link } from 'wouter';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export function ProductCard({ product, index = 0, isNew = false }: { product: Product; index?: number, isNew?: boolean }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative flex flex-col bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      <Link href={`/product/${product.id}`}>
        <div className="cursor-pointer relative aspect-square overflow-hidden bg-[#FAF8F4] p-4">
          {/* New Badge */}
          {isNew && (
            <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[0.6rem] font-bold tracking-widest uppercase px-2 py-1">
              NEW
            </div>
          )}

          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x600/FAF8F4/A77F1B?text=${encodeURIComponent(product.name)}`;
            }}
          />
          {/* Overlay Add to Cart button on desktop */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center backdrop-blur-[1px]">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="bg-white text-primary border border-primary/20 px-8 py-3 tracking-widest text-xs font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2 shadow-lg"
            >
              <ShoppingBag size={16} />
              ADD TO CART
            </button>
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow relative bg-white">
        {/* Animated Gold Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="flex justify-between items-start mb-3">
          <p className="text-[0.65rem] text-primary tracking-[0.2em] font-semibold uppercase">{product.category}</p>
          <div className="flex items-center gap-1 text-primary">
            <Star size={12} fill="currentColor" />
            <span className="text-[0.65rem] text-muted-foreground font-semibold">{product.rating}</span>
          </div>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-xl text-foreground mb-4 hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between">
          <p className="font-sans font-semibold tracking-wide text-foreground">
            LKR {product.price.toLocaleString()}
          </p>
          
          {/* Mobile add to cart */}
          <button 
            onClick={() => addToCart(product)}
            className="md:hidden h-10 w-10 rounded-full border border-border text-foreground flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}