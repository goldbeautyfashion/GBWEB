import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { products } from '@/data/products';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Smartphone, Monitor, Save, RotateCcw, GripVertical } from 'lucide-react';

export default function AdminWebsiteEditor() {
  const { siteConfig, updateSiteConfig, resetSiteConfig } = useSiteConfig();
  const [localConfig, setLocalConfig] = useState(siteConfig);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

  // Sync local config when context changes
  useEffect(() => {
    setLocalConfig(siteConfig);
  }, [siteConfig]);

  const handleChange = (key: keyof typeof localConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSiteConfig(localConfig);
    toast.success("Website updated successfully!", {
      style: { backgroundColor: '#A77F1B', color: 'white', border: 'none' }
    });
  };

  const handleReset = () => {
    resetSiteConfig();
    toast.success("Reset to default settings");
  };

  const toggleFeaturedProduct = (id: string) => {
    setLocalConfig(prev => {
      const isSelected = prev.featuredProductIds.includes(id);
      let newIds = [];
      if (isSelected) {
        newIds = prev.featuredProductIds.filter(pid => pid !== id);
      } else {
        if (prev.featuredProductIds.length >= 8) {
          toast.error("Maximum 8 featured products allowed");
          return prev;
        }
        newIds = [...prev.featuredProductIds, id];
      }
      return { ...prev, featuredProductIds: newIds };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-120px)] flex flex-col"
    >
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize your storefront appearance in real-time.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw size={16} /> Reset
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-accent text-white flex items-center gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel: Controls */}
        <Card className="w-[40%] flex flex-col border-none shadow-md overflow-hidden bg-white">
          <Tabs defaultValue="hero" className="flex flex-col h-full">
            <div className="px-4 pt-4 border-b border-border shrink-0">
              <TabsList className="w-full bg-gray-100/50 p-1">
                <TabsTrigger value="hero" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Hero</TabsTrigger>
                <TabsTrigger value="products" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Products</TabsTrigger>
                <TabsTrigger value="about" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">About</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <TabsContent value="hero" className="space-y-6 m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-3 rounded-md bg-gray-50/50">
                    <div>
                      <Label className="text-base font-semibold">Announcement Bar</Label>
                      <p className="text-xs text-muted-foreground">Show top banner</p>
                    </div>
                    <Switch 
                      checked={localConfig.showAnnouncement} 
                      onCheckedChange={(c) => handleChange('showAnnouncement', c)} 
                    />
                  </div>
                  {localConfig.showAnnouncement && (
                    <div className="space-y-2">
                      <Label>Announcement Text</Label>
                      <Input 
                        value={localConfig.announcementBar} 
                        onChange={(e) => handleChange('announcementBar', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground">Hero Section</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Headline Line 1</Label>
                      <Input 
                        value={localConfig.heroLine1} 
                        onChange={(e) => handleChange('heroLine1', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Headline Line 2 (Gold)</Label>
                      <Input 
                        value={localConfig.heroLine2} 
                        onChange={(e) => handleChange('heroLine2', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea 
                      value={localConfig.heroSubtitle} 
                      onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                      className="resize-none h-20"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground">Call to Action</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Button</Label>
                      <Input 
                        value={localConfig.ctaText} 
                        onChange={(e) => handleChange('ctaText', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Button</Label>
                      <Input 
                        value={localConfig.ctaSecondaryText} 
                        onChange={(e) => handleChange('ctaSecondaryText', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-4 m-0">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Featured Products</h3>
                  <p className="text-xs text-muted-foreground mb-4">Select up to 8 products to show on the home page ({localConfig.featuredProductIds.length}/8)</p>
                  
                  <div className="space-y-2 border border-border rounded-md p-2 bg-gray-50/50">
                    {products.map(product => (
                      <div key={product.id} className="flex items-center gap-3 p-2 bg-white rounded-md border border-border shadow-sm">
                        <GripVertical size={16} className="text-muted-foreground/50 cursor-grab" />
                        <Checkbox 
                          id={`prod-${product.id}`} 
                          checked={localConfig.featuredProductIds.includes(product.id)}
                          onCheckedChange={() => toggleFeaturedProduct(product.id)}
                        />
                        <div className="w-8 h-8 rounded bg-[#FAF8F4] overflow-hidden shrink-0">
                          <img src={product.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <Label htmlFor={`prod-${product.id}`} className="flex-1 cursor-pointer text-sm font-medium truncate">
                          {product.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-6 m-0">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">About Section</h3>
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                      value={localConfig.aboutTitle} 
                      onChange={(e) => handleChange('aboutTitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description Text</Label>
                    <Textarea 
                      value={localConfig.aboutText} 
                      onChange={(e) => handleChange('aboutText', e.target.value)}
                      className="resize-none h-32"
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Right Panel: Live Preview */}
        <Card className="w-[60%] flex flex-col border-none shadow-md bg-gray-100 overflow-hidden">
          <div className="h-12 border-b border-border bg-white flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
            </div>
            <div className="flex bg-gray-100 rounded-md p-1">
              <button 
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div 
              className={`bg-white shadow-2xl rounded-sm overflow-hidden overflow-y-auto transition-all duration-300 origin-top ${
                previewDevice === 'mobile' ? 'w-[375px] h-[812px] border-8 border-gray-800 rounded-3xl scale-90' : 'w-full h-full'
              }`}
            >
              {/* Preview Content (Mimics real site) */}
              <div className="flex flex-col min-h-full font-sans pointer-events-none select-none">
                
                {/* Mock Announcement */}
                {localConfig.showAnnouncement && (
                  <div className="bg-[#A77F1B] text-white text-[10px] font-semibold py-2 px-4 text-center tracking-widest uppercase">
                    {localConfig.announcementBar}
                  </div>
                )}
                
                {/* Mock Nav */}
                <div className="py-4 px-6 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
                  <div className="flex gap-4 hidden sm:flex">
                    <span className="text-[10px] tracking-[0.2em] text-foreground">HOME</span>
                    <span className="text-[10px] tracking-[0.2em] text-foreground">SHOP</span>
                  </div>
                  <div className="text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <h1 className="font-serif text-lg font-bold tracking-widest text-foreground">
                      GOLD BEAUTY
                    </h1>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[10px] tracking-[0.2em] text-foreground hidden sm:block">ABOUT</span>
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  </div>
                </div>

                {/* Mock Hero */}
                <div className="relative h-[400px] flex items-center justify-start bg-[#FAF8F4]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F4] via-[#FAF8F4]/80 to-transparent z-10" />
                  <img src="/images/hero-bg.png" className="absolute inset-0 w-full h-full object-cover object-right" alt="" />
                  
                  <div className="relative z-20 px-8 max-w-md">
                    <h2 className="font-serif text-4xl leading-tight text-foreground mb-4">
                      {localConfig.heroLine1} <br />
                      <span className="italic text-[#A77F1B]">{localConfig.heroLine2}</span>
                    </h2>
                    <p className="text-muted-foreground text-xs tracking-widest mb-6 leading-relaxed">
                      {localConfig.heroSubtitle}
                    </p>
                    <div className="flex gap-2">
                      <div className="bg-[#A77F1B] text-white px-4 py-2 font-semibold tracking-[0.2em] text-[10px]">
                        {localConfig.ctaText}
                      </div>
                      <div className="border border-[#A77F1B] text-[#A77F1B] px-4 py-2 font-semibold tracking-[0.2em] text-[10px]">
                        {localConfig.ctaSecondaryText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Featured */}
                <div className="py-12 bg-[#FAF8F4] px-8">
                  <div className="text-center mb-8">
                    <p className="text-[#A77F1B] text-[10px] tracking-[0.3em] uppercase mb-1 font-semibold">Most Loved</p>
                    <h2 className="font-serif text-2xl">Best Sellers</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {localConfig.featuredProductIds.slice(0, 4).map(id => {
                      const p = products.find(p => p.id === id);
                      if (!p) return null;
                      return (
                        <div key={id} className="bg-white p-2">
                          <div className="aspect-square bg-gray-100 mb-2">
                            <img src={p.image} className="w-full h-full object-cover" alt=""/>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{p.category}</p>
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <p className="text-xs text-[#A77F1B] mt-1">LKR {p.price.toLocaleString()}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mock About */}
                <div className="py-12 bg-white px-8">
                  <div className="grid grid-cols-2 gap-8 items-center">
                    <div className="bg-gray-100 aspect-[4/3]">
                      <img src="/images/lifestyle-1.png" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl mb-4">{localConfig.aboutTitle}</h2>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                        {localConfig.aboutText}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
