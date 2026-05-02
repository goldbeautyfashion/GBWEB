import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Truck, Award, ShieldCheck, Heart } from 'lucide-react';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/product-card';

export default function Home() {
  const bestSellers = products.slice(0, 8);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Luxury Cosmetics" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=2071&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-white mb-4">
              Redefine <br />
              <span className="italic text-primary">Your Glow.</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base tracking-widest max-w-md mb-8 leading-relaxed">
              Discover opulent beauty curated for the modern Sri Lankan woman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <button className="bg-primary text-primary-foreground px-8 py-4 font-semibold tracking-[0.2em] text-sm hover:bg-accent transition-all duration-300 shadow-[0_0_20px_rgba(167,127,27,0.3)]">
                  EXPLORE COLLECTION
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 divide-x divide-border text-center">
            <div className="px-4">
              <h3 className="font-serif text-2xl md:text-3xl text-primary mb-1">500+</h3>
              <p className="text-[0.65rem] md:text-xs tracking-widest text-muted-foreground uppercase">Happy Clients</p>
            </div>
            <div className="px-4">
              <h3 className="font-serif text-2xl md:text-3xl text-primary mb-1">50+</h3>
              <p className="text-[0.65rem] md:text-xs tracking-widest text-muted-foreground uppercase">Products</p>
            </div>
            <div className="px-4 flex flex-col items-center justify-center">
              <div className="flex text-primary mb-1 md:mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" className="md:w-5 md:h-5" />)}
              </div>
              <p className="text-[0.65rem] md:text-xs tracking-widest text-muted-foreground uppercase">Top Rated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Curated Selection</p>
              <h2 className="font-serif text-3xl md:text-4xl">Categories</h2>
            </div>
            <Link href="/shop">
              <span className="hidden md:flex items-center text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer uppercase">
                View All <ChevronRight size={14} className="ml-1" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} href={`/shop?category=${category.name}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer relative overflow-hidden aspect-[3/4]"
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x533/1e120f/a77f1b?text=${category.name}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-lg md:text-xl text-white mb-1">{category.name}</h3>
                    <div className="w-8 h-[1px] bg-primary mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Most Loved</p>
            <h2 className="font-serif text-3xl md:text-4xl">Best Sellers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/shop">
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 tracking-widest text-xs font-semibold transition-all duration-300">
                VIEW ENTIRE COLLECTION
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="/images/lifestyle-1.png" 
                alt="Luxury beauty lifestyle" 
                className="w-full h-auto object-cover max-h-[600px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl mb-4">The Gold Standard</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We believe that luxury should not just be a label, but an experience. Every product in our collection is curated with the highest standards of quality, ensuring you receive nothing but the best.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="text-primary mt-1"><Award size={24} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2">PREMIUM QUALITY</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Crafted with the finest ingredients for exceptional performance.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-primary mt-1"><Truck size={24} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2">FAST DELIVERY</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Complimentary island-wide delivery on orders over Rs. 10,000.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-primary mt-1"><ShieldCheck size={24} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2">AUTHENTIC</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">100% genuine products sourced directly from trusted manufacturers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-primary mt-1"><Heart size={24} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2">EXPERT CURATION</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Handpicked by Shani Ranasinghe for the Sri Lankan complexion.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Words of Praise</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-16">Client Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dilini S.",
                text: "The Gold Radiance Foundation is a game-changer. It matches my skin tone perfectly and lasts all day despite the Colombo humidity.",
              },
              {
                name: "Amandi P.",
                text: "Absolutely in love with the Velvet Rose Lipstick. The packaging feels incredibly luxurious and the formula is non-drying. My new favorite!",
              },
              {
                name: "Shenali W.",
                text: "Exceptional service! Placed my order on Tuesday and received it the very next day. The Oud Noir perfume smells divine.",
              }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-background p-8 border border-border flex flex-col items-center"
              >
                <div className="flex text-primary mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm italic text-muted-foreground leading-relaxed mb-6 flex-grow">
                  "{review.text}"
                </p>
                <p className="font-sans text-xs font-semibold tracking-widest uppercase">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="bg-background">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {[
            "/images/prod-1.png",
            "/images/lifestyle-1.png",
            "/images/prod-4.png",
            "/images/cat-lipstick.png",
            "/images/prod-5.png",
            "/images/cat-eyeshadow.png"
          ].map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-card">
              <img 
                src={src} 
                alt="Instagram feed" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400/1e120f/a77f1b?text=Instagram+${i+1}`;
                }}
              />
              <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Heart size={24} className="text-white fill-white" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
