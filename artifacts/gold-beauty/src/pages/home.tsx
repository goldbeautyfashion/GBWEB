import { Link } from 'wouter';
import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from 'framer-motion';
import { Star, ChevronRight, Truck, Award, ShieldCheck, Heart, ArrowDown } from 'lucide-react';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/product-card';
import { useRef, useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';

function Counter({ from, to }: { from: number, to: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(from);

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration: 2, ease: "easeOut" });
    }
  }, [inView, count, to]);

  const display = useTransform(count, (latest) => Math.round(latest).toString());

  return <motion.span ref={ref}>{display}</motion.span>;
}

export default function Home() {
  const { siteConfig } = useSiteConfig();
  const bestSellers = products.filter(p => siteConfig.featuredProductIds.includes(p.id)).slice(0, 8);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="flex flex-col w-full overflow-hidden bg-background"
    >
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-start overflow-hidden bg-[#FAF8F4]">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Luxury Cosmetics" 
            className="w-full h-full object-cover object-center md:object-right"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=2071&auto=format&fit=crop";
            }}
          />
          {/* Light premium gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F4] via-[#FAF8F4]/80 to-transparent" />
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 pt-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="max-w-2xl"
          >
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-primary"></div>
              <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase">The New Collection</p>
            </motion.div>
            
            <motion.h2 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-foreground mb-6"
            >
              {siteConfig.heroLine1} <br />
              <span className="italic text-primary">{siteConfig.heroLine2}</span>
            </motion.h2>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-muted-foreground text-sm md:text-base tracking-widest max-w-md mb-10 leading-relaxed"
            >
              {siteConfig.heroSubtitle}
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/shop">
                <button className="bg-primary text-primary-foreground px-8 py-4 font-semibold tracking-[0.2em] text-sm hover:bg-accent transition-all duration-300 shadow-[0_4px_20px_rgba(167,127,27,0.3)]">
                  {siteConfig.ctaText}
                </button>
              </Link>
              <Link href="/track-order">
                <button className="bg-transparent border border-primary text-primary px-8 py-4 font-semibold tracking-[0.2em] text-sm hover:bg-primary/5 transition-all duration-300">
                  {siteConfig.ctaSecondaryText}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary float-animation"
        >
          <ArrowDown size={24} strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* Stats Row */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border-b border-border bg-white shadow-sm relative z-20"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-3 divide-x divide-primary/20 text-center">
            <div className="px-4">
              <h3 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                <Counter from={0} to={500} />+
              </h3>
              <p className="text-[0.65rem] md:text-xs tracking-widest text-muted-foreground uppercase">Happy Clients</p>
            </div>
            <div className="px-4">
              <h3 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                <Counter from={0} to={50} />+
              </h3>
              <p className="text-[0.65rem] md:text-xs tracking-widest text-muted-foreground uppercase">Products</p>
            </div>
            <div className="px-4 flex flex-col items-center justify-center">
              <div className="flex text-primary mb-2 md:mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" className="md:w-6 md:h-6" />)}
              </div>
              <p className="text-[0.65rem] md:text-xs tracking-widest text-muted-foreground uppercase">Top Rated</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col items-center justify-center mb-16 text-center"
          >
            <div className="w-16 h-[1px] bg-primary mb-4" />
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Curated Selection</p>
            <h2 className="font-serif text-4xl md:text-5xl">Categories</h2>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
          >
            {categories.map((category) => (
              <Link key={category.name} href={`/shop?category=${category.name}`}>
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="group cursor-pointer relative overflow-hidden aspect-[3/4] bg-white shadow-md rounded-sm"
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x533/FAF8F4/A77F1B?text=${category.name}`;
                    }}
                  />
                  {/* Elegant hover border */}
                  <div className="absolute inset-4 border border-white/0 group-hover:border-white/50 transition-colors duration-500 z-20 pointer-events-none" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-full p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-serif text-xl text-white mb-2 tracking-wide">{category.name}</h3>
                    <div className="w-8 h-[1px] bg-primary mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="bg-primary text-primary-foreground py-4 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[1,2,3,4].map(i => (
            <span key={i} className="text-sm font-semibold tracking-[0.3em] uppercase mx-8">
              GOLD BEAUTY • BY SHANI RANASINGHE • PREMIUM COSMETICS • SRI LANKA • LUXURY BEAUTY •
            </span>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <section className="py-24 bg-[#FAF8F4] relative border-y border-border">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Most Loved</p>
            <h2 className="font-serif text-4xl md:text-5xl">Best Sellers</h2>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {bestSellers.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
                isNew={index < 2} 
              />
            ))}
          </motion.div>
          
          <div className="mt-16 text-center">
            <Link href="/shop">
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-4 tracking-[0.2em] text-xs font-semibold transition-all duration-300">
                VIEW ENTIRE COLLECTION
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4" />
                <img 
                  src="/images/lifestyle-1.png" 
                  alt="Luxury beauty lifestyle" 
                  className="w-full h-auto object-cover relative z-10 shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop";
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Our Promise</p>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-foreground">{siteConfig.aboutTitle}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                  {siteConfig.aboutText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                <div className="flex gap-4 group">
                  <div className="text-primary mt-1 bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Award size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2 text-foreground">PREMIUM QUALITY</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Crafted with the finest ingredients for exceptional performance.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="text-primary mt-1 bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Truck size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2 text-foreground">FAST DELIVERY</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Complimentary island-wide delivery on orders over Rs. 10,000.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="text-primary mt-1 bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2 text-foreground">AUTHENTIC</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">100% genuine products sourced directly from trusted manufacturers.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="text-primary mt-1 bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Heart size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold tracking-wider mb-2 text-foreground">EXPERT CURATION</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Handpicked by Shani Ranasinghe for the Sri Lankan complexion.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#FAF8F4] border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Words of Praise</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-16">Client Experiences</h2>
          </motion.div>
          
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                className="bg-white p-10 shadow-sm border border-border flex flex-col items-center relative"
              >
                <div className="absolute -top-4 text-4xl text-primary font-serif opacity-30">"</div>
                <div className="flex text-primary mb-6 mt-4">
                  {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                </div>
                <p className="text-base font-serif italic text-foreground leading-relaxed mb-6 flex-grow">
                  "{review.text}"
                </p>
                <div className="w-12 h-[1px] bg-primary mb-4" />
                <p className="font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Strip */}
      <section className="py-20 bg-white border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 border border-primary/20 bg-[#FAF8F4]"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">Stay in the Glow</h2>
            <p className="text-sm text-muted-foreground mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow bg-white border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                required
              />
              <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 tracking-widest text-xs font-semibold hover:bg-accent transition-colors">
                SUBSCRIBE
              </button>
            </form>
          </motion.div>
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
            <div key={i} className="group relative aspect-square overflow-hidden bg-[#FAF8F4]">
              <img 
                src={src} 
                alt="Instagram feed" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400/FAF8F4/A77F1B?text=Instagram+${i+1}`;
                }}
              />
              <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Heart size={28} className="text-white fill-white drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}