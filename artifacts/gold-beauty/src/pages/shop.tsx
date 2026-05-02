import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product-card';

export default function Shop() {
  const [search] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get('category') || 'All';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured - keep original order
        break;
    }
    
    return result;
  }, [activeCategory, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-[#FFF5F8] pb-20"
    >
      {/* Page Header */}
      <div className="bg-white border-b border-border py-16 md:py-24 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">The Collection</h1>
          <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase max-w-xl mx-auto">
            Discover our complete range of premium cosmetics
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-border">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground"
            >
              <Filter size={16} /> FILTERS
            </button>
            <span className="text-xs text-muted-foreground font-medium">{filteredProducts.length} Products</span>
          </div>

          {/* Sidebar / Filters */}
          <aside className={`
            lg:w-64 lg:shrink-0 lg:block bg-white lg:bg-transparent lg:border-none border border-border p-6 lg:p-0
            ${isFilterOpen ? 'block' : 'hidden'}
          `}>
            <div className="sticky top-28 space-y-12">
              <div>
                <h3 className="text-xs font-semibold tracking-[0.2em] border-b border-border pb-3 mb-5 uppercase text-foreground">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsFilterOpen(false);
                        }}
                        className={`text-sm tracking-wide transition-all px-3 py-2 rounded-sm flex items-center justify-between w-full text-left 
                          ${activeCategory === cat ? 'bg-primary/5 text-primary font-medium border border-primary/20' : 'text-muted-foreground hover:bg-white hover:text-foreground border border-transparent'}`}
                      >
                        {cat}
                        {activeCategory === cat && <Check size={14} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-[0.2em] border-b border-border pb-3 mb-5 uppercase text-foreground">Sort By</h3>
                <ul className="space-y-2">
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'price-low', label: 'Price: Low to High' },
                    { id: 'price-high', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Highest Rated' }
                  ].map(sort => (
                    <li key={sort.id}>
                      <button
                        onClick={() => {
                          setSortBy(sort.id);
                          setIsFilterOpen(false);
                        }}
                        className={`text-sm tracking-wide transition-all px-3 py-2 rounded-sm flex items-center justify-between w-full text-left 
                          ${sortBy === sort.id ? 'bg-primary/5 text-primary font-medium border border-primary/20' : 'text-muted-foreground hover:bg-white hover:text-foreground border border-transparent'}`}
                      >
                        {sort.label}
                        {sortBy === sort.id && <Check size={14} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-border">
              <h2 className="font-serif text-3xl text-foreground">{activeCategory === 'All' ? 'All Products' : activeCategory}</h2>
              <span className="text-sm text-muted-foreground tracking-widest font-medium">{filteredProducts.length} Results</span>
            </div>

            {filteredProducts.length > 0 ? (
              <motion.div 
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index % 6} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="py-20 text-center bg-white border border-border text-muted-foreground">
                <p>No products found in this category.</p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="mt-4 text-primary underline underline-offset-4 tracking-widest text-sm font-semibold"
                >
                  View All Products
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
}