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
    if (inView) animate(count, to, { duration: 2, ease: 'easeOut' });
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

  const heroSrc = siteConfig.heroBgImage || '/images/hero-bg.png';

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
            src={heroSrc}
            alt="Luxury Cosmetics"
            className="w-full h-full object-cover object-center md:object-right"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=2071&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F4] via-[#FAF8F4]/80 to-transparent" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
            className="max-w-2xl"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-primary" />
              <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase">The New Collection</p>
            </motion.div>

            <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-foreground mb-6">
              {siteConfig.heroLine1} <br />
              <span className="italic text-primary">{siteConfig.heroLine2}</span>
            </motion.h2>

            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-muted-foreground text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
              {siteConfig.heroSubtitle}
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-4">
              <Link href="/shop">
                <button className="bg-primary text-primary-foreground px-10 py-4 tracking-[0.2em] text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-3 shadow-md">
                  {siteConfig.ctaText} <ChevronRight size={16} />
                </button>
              </Link>
              <Link href="/track-order">
                <button className="border border-foreground/20 text-foreground px-8 py-4 tracking-[0.2em] text-xs font-semibold hover:border-primary hover:text-primary transition-colors flex items-center gap-3">
                  {siteConfig.ctaSecondaryText} <ArrowDown size={16} />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 5000, suffix: '+', label: 'Happy Customers' },
              { value: 120, suffix: '+', label: 'Premium Products' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
              { value: 25, suffix: '+', label: 'Island-Wide Delivery Zones' },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-light mb-2 text-primary-foreground/90">
                  <Counter from={0} to={value} />{suffix}
                </p>
                <p className="text-xs tracking-[0.2em] uppercase font-medium text-primary-foreground/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase mb-4">Curated For You</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Best Sellers</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">Our most loved formulations, trusted by thousands of women across Sri Lanka.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/shop">
              <button className="border border-primary text-primary px-12 py-4 tracking-[0.2em] text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-3 mx-auto">
                VIEW ALL PRODUCTS <ChevronRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-around gap-12">
            {[
              { icon: Truck, title: 'Island-Wide Delivery', desc: 'Free delivery on orders above LKR 10,000' },
              { icon: Award, title: 'Premium Quality', desc: 'Dermatologist tested & approved formulas' },
              { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Your data is always safe and protected' },
              { icon: Heart, title: 'Made with Love', desc: 'Curated by Shani Ranasinghe herself' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center max-w-[160px]">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="font-serif text-lg mb-2">{title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase mb-4">Explore</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.name} href={`/shop?category=${cat.name}`}>
                <motion.div whileHover={{ y: -4 }} className="relative h-40 md:h-52 bg-white border border-border overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all">
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-primary text-3xl">✦</span>
                    <span className="font-serif text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                    <span className="text-xs text-muted-foreground tracking-widest uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      SHOP NOW <ChevronRight size={12} />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase mb-4">Testimonials</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Dilini S.', location: 'Colombo', rating: 5, review: 'The Gold Radiance Foundation gives me the most flawless finish I\'ve ever experienced. It feels like luxury on my skin!' },
              { name: 'Amandi P.', location: 'Kandy', rating: 5, review: 'Fast delivery and the packaging was absolutely beautiful. The Velvet Rose lipstick is my new everyday staple.' },
              { name: 'Chamari F.', location: 'Galle', rating: 5, review: 'I\'ve tried so many local brands but Gold Beauty is truly premium. The Oud Noir perfume gets me compliments every day!' },
            ].map(({ name, location, rating, review }) => (
              <motion.div key={name} whileHover={{ y: -4 }} className="bg-[#FAF8F4] border border-border p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
                </div>
                <p className="text-foreground leading-relaxed mb-6 font-light italic">"{review}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground tracking-widest">{location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary-foreground/60 text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">{siteConfig.aboutTitle}</h2>
          <p className="max-w-2xl mx-auto text-primary-foreground/80 leading-relaxed text-lg mb-10">{siteConfig.aboutText}</p>
          <Link href="/about">
            <button className="border border-primary-foreground/40 text-primary-foreground px-10 py-4 tracking-[0.2em] text-xs font-semibold hover:bg-primary-foreground/10 transition-colors">
              READ OUR STORY
            </button>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
