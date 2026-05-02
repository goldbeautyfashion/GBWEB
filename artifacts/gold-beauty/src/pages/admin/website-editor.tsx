import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { products } from '@/data/products';
import { toast } from 'sonner';
import {
  Save, RotateCcw, Monitor, Smartphone, Upload, Trash2,
  Image, Globe, Search, Share2, CreditCard, Truck, Store,
  GripVertical, Megaphone, Star, Info, Facebook, Instagram,
  Youtube, MessageCircle, Music2, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SectionKey =
  | 'hero'
  | 'logo'
  | 'store'
  | 'seo'
  | 'social'
  | 'products'
  | 'about'
  | 'payment';

const SECTIONS: { key: SectionKey; label: string; icon: typeof Globe; desc: string }[] = [
  { key: 'hero',     label: 'Hero & Banner',    icon: Megaphone,  desc: 'Top banner, hero headline, CTA' },
  { key: 'logo',     label: 'Logo & Image',     icon: Image,      desc: 'Logo upload, hero background' },
  { key: 'store',    label: 'Store Info',       icon: Store,      desc: 'Store name, contact details' },
  { key: 'seo',      label: 'SEO & Meta',       icon: Search,     desc: 'Page title, description, keywords' },
  { key: 'social',   label: 'Social Media',     icon: Share2,     desc: 'Facebook, Instagram, WhatsApp…' },
  { key: 'products', label: 'Featured Products',icon: Star,       desc: 'Homepage best sellers grid' },
  { key: 'about',    label: 'About Section',    icon: Info,       desc: 'About us title and description' },
  { key: 'payment',  label: 'Payment & Delivery',icon: CreditCard,desc: 'Payment methods, shipping fees' },
];

function SectionNav({ active, onChange }: { active: SectionKey; onChange: (k: SectionKey) => void }) {
  return (
    <nav className="flex flex-col gap-0.5 py-3 px-2">
      {SECTIONS.map(s => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full group',
            active === s.key
              ? 'bg-[#FBF7EE] shadow-[inset_0_0_0_1px_#E8D9A8]'
              : 'hover:bg-gray-50'
          )}
        >
          <span className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors',
            active === s.key ? 'bg-[#A77F1B]/15 text-[#A77F1B]' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
          )}>
            <s.icon size={14} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className={cn('text-xs font-semibold leading-none', active === s.key ? 'text-[#A77F1B]' : 'text-gray-700')}>{s.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{s.desc}</p>
          </div>
          {active === s.key && <span className="w-1.5 h-1.5 rounded-full bg-[#A77F1B] shrink-0" />}
        </button>
      ))}
    </nav>
  );
}

function FieldGroup({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{label}</Label>
      {children}
      {note && <p className="text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pb-4 border-b border-gray-100 mb-5">
      <h3 className="font-bold text-sm text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function AdminWebsiteEditor() {
  const { siteConfig, updateSiteConfig, resetSiteConfig } = useSiteConfig();
  const [localConfig, setLocalConfig] = useState(siteConfig);
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const heroImgRef = useRef<HTMLInputElement>(null);
  const logoImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLocalConfig(siteConfig); }, [siteConfig]);

  const set = (key: keyof typeof localConfig, value: unknown) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSiteConfig(localConfig);
    setSaving(false);
    toast.success('Website updated successfully!', {
      style: { backgroundColor: '#A77F1B', color: 'white', border: 'none' }
    });
  };

  const handleReset = () => { resetSiteConfig(); toast.success('Reset to defaults'); };

  const handleImageUpload = (
    ref: React.RefObject<HTMLInputElement>,
    field: 'heroBgImage' | 'logo'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      set(field, base64);
      toast.success(field === 'logo' ? 'Logo uploaded!' : 'Hero background updated!');
    };
    reader.readAsDataURL(file);
    if (ref.current) ref.current.value = '';
  };

  const toggleFeaturedProduct = (id: string) => {
    setLocalConfig(prev => {
      const has = prev.featuredProductIds.includes(id);
      if (!has && prev.featuredProductIds.length >= 8) { toast.error('Maximum 8 featured products allowed'); return prev; }
      return { ...prev, featuredProductIds: has ? prev.featuredProductIds.filter(p => p !== id) : [...prev.featuredProductIds, id] };
    });
  };

  const renderSection = () => {
    switch (activeSection) {

      case 'hero': return (
        <div className="space-y-6">
          <SectionHeading title="Hero & Banner" subtitle="Controls what visitors see first on the homepage." />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-800">Announcement Bar</p>
                <p className="text-xs text-gray-400">Visible top banner strip</p>
              </div>
              <Switch checked={localConfig.showAnnouncement} onCheckedChange={v => set('showAnnouncement', v)} />
            </div>
            {localConfig.showAnnouncement && (
              <FieldGroup label="Banner Text">
                <Input value={localConfig.announcementBar} onChange={e => set('announcementBar', e.target.value)} placeholder="COMPLIMENTARY DELIVERY ON ORDERS OVER RS. 10,000" />
              </FieldGroup>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Hero Headline</p>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Line 1 (Black)">
                <Input value={localConfig.heroLine1} onChange={e => set('heroLine1', e.target.value)} placeholder="Redefine" />
              </FieldGroup>
              <FieldGroup label="Line 2 (Gold Italic)">
                <Input value={localConfig.heroLine2} onChange={e => set('heroLine2', e.target.value)} placeholder="Your Glow." />
              </FieldGroup>
            </div>
            <FieldGroup label="Subtitle Text">
              <Textarea value={localConfig.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} className="resize-none h-16 text-sm" />
            </FieldGroup>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Call to Action Buttons</p>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Primary Button">
                <Input value={localConfig.ctaText} onChange={e => set('ctaText', e.target.value)} placeholder="EXPLORE COLLECTION" />
              </FieldGroup>
              <FieldGroup label="Secondary Button">
                <Input value={localConfig.ctaSecondaryText} onChange={e => set('ctaSecondaryText', e.target.value)} placeholder="TRACK MY ORDER" />
              </FieldGroup>
            </div>
          </div>
        </div>
      );

      case 'logo': return (
        <div className="space-y-6">
          <SectionHeading title="Logo & Images" subtitle="Upload your brand logo and hero background." />

          {/* Logo Upload */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Brand Logo</p>
            {localConfig.logo ? (
              <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center gap-3">
                <img src={localConfig.logo} alt="Logo" className="max-h-20 max-w-full object-contain" />
                <div className="flex gap-2">
                  <button
                    onClick={() => logoImgRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    <Upload size={12} /> Replace Logo
                  </button>
                  <button
                    onClick={() => set('logo', '')}
                    className="flex items-center gap-1.5 text-xs border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#A77F1B]/40 hover:bg-amber-50/20 transition-all"
                onClick={() => logoImgRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                  <Upload size={22} className="text-[#A77F1B]" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Import Logo</p>
                <p className="text-xs text-gray-400 mt-1">PNG, SVG, or JPG — transparent background recommended</p>
                <p className="text-xs text-gray-400">Max 5MB · Ideal: 400×120px</p>
              </div>
            )}
            <input ref={logoImgRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={handleImageUpload(logoImgRef, 'logo')} />
          </div>

          {/* Hero Background */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Hero Background Image</p>
            {localConfig.heroBgImage ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 160 }}>
                <img src={localConfig.heroBgImage} alt="Hero background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  <button onClick={() => heroImgRef.current?.click()} className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"><Upload size={12} /> Replace</button>
                  <button onClick={() => set('heroBgImage', '')} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"><Trash2 size={12} /> Remove</button>
                </div>
                <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#A77F1B]/40 hover:bg-amber-50/20 transition-all"
                onClick={() => heroImgRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Image size={22} className="text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Upload Hero Background</p>
                <p className="text-xs text-gray-400 mt-1">JPG or PNG · Max 5MB · Ideal: 1920×1080px</p>
              </div>
            )}
            <input ref={heroImgRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload(heroImgRef, 'heroBgImage')} />
          </div>
        </div>
      );

      case 'store': return (
        <div className="space-y-5">
          <SectionHeading title="Store Information" subtitle="Brand name, tagline and contact details shown on the website." />

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-bold text-amber-800 mb-1 tracking-widest uppercase">Live Preview — Header & Footer</p>
            <p className="font-serif font-bold tracking-widest text-gray-900 text-sm">{localConfig.storeName.toUpperCase()}</p>
            {localConfig.storeSubtitle && (
              <p className="text-[10px] tracking-[0.3em] text-[#A77F1B] mt-0.5">{localConfig.storeSubtitle.toUpperCase()}</p>
            )}
          </div>

          <FieldGroup label="Brand Name" note="Shown as the large title in the navigation and footer">
            <Input value={localConfig.storeName} onChange={e => set('storeName', e.target.value)} placeholder="Gold Beauty Fashion" />
          </FieldGroup>

          <FieldGroup label="Brand Subtitle" note="Shown in gold text below the brand name (e.g. By Shani Ranasinghe)">
            <Input value={localConfig.storeSubtitle} onChange={e => set('storeSubtitle', e.target.value)} placeholder="By Shani Ranasinghe" />
          </FieldGroup>

          <FieldGroup label="Footer Tagline" note="Short description shown in the website footer">
            <Textarea
              value={localConfig.footerTagline}
              onChange={e => set('footerTagline', e.target.value)}
              className="resize-none h-16 text-sm"
              placeholder="A premium cosmetics house for the modern Sri Lankan woman."
            />
          </FieldGroup>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contact Details</p>
            <FieldGroup label="Contact Email">
              <Input type="email" value={localConfig.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="hello@goldbeauty.lk" />
            </FieldGroup>
            <FieldGroup label="Phone Number">
              <Input value={localConfig.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="+94 77 000 0000" />
            </FieldGroup>
            <FieldGroup label="Address">
              <Input value={localConfig.address} onChange={e => set('address', e.target.value)} placeholder="Colombo, Sri Lanka" />
            </FieldGroup>
          </div>
        </div>
      );

      case 'seo': return (
        <div className="space-y-5">
          <SectionHeading title="SEO & Meta Tags" subtitle="Improve search engine ranking and social sharing." />
          <FieldGroup label="Page Title" note="Shown in browser tab and Google results (50–60 chars recommended)">
            <Input value={localConfig.seo.title} onChange={e => set('seo', { ...localConfig.seo, title: e.target.value })} maxLength={70} />
            <p className={cn('text-[11px] text-right', localConfig.seo.title.length > 60 ? 'text-amber-500' : 'text-gray-400')}>{localConfig.seo.title.length}/70</p>
          </FieldGroup>
          <FieldGroup label="Meta Description" note="Shown below page title in search results (150–160 chars recommended)">
            <Textarea
              value={localConfig.seo.description}
              onChange={e => set('seo', { ...localConfig.seo, description: e.target.value })}
              rows={3}
              maxLength={170}
              className="resize-none text-sm"
            />
            <p className={cn('text-[11px] text-right', localConfig.seo.description.length > 160 ? 'text-amber-500' : 'text-gray-400')}>{localConfig.seo.description.length}/170</p>
          </FieldGroup>
          <FieldGroup label="Keywords" note="Comma-separated keywords for search engines">
            <Input value={localConfig.seo.keywords} onChange={e => set('seo', { ...localConfig.seo, keywords: e.target.value })} placeholder="cosmetics, beauty, Sri Lanka, luxury makeup..." />
          </FieldGroup>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
            <p className="font-semibold mb-1">Preview — Google Search</p>
            <p className="text-blue-600 font-medium truncate">{localConfig.seo.title || 'Gold Beauty Fashion'}</p>
            <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">{localConfig.seo.description || 'Description appears here...'}</p>
          </div>
        </div>
      );

      case 'social': return (
        <div className="space-y-4">
          <SectionHeading title="Social Media Links" subtitle="Links shown in the website footer." />
          {[
            { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', color: 'text-pink-500' },
            { key: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/yourpage', color: 'text-blue-600' },
            { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp Number', placeholder: '94770000000 (no + or spaces)', color: 'text-green-500' },
            { key: 'tiktok', icon: Music2, label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle', color: 'text-gray-800' },
            { key: 'youtube', icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel', color: 'text-red-500' },
          ].map(({ key, icon: Icon, label, placeholder, color }) => (
            <div key={key} className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0', color)}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <Label className="text-[11px] text-gray-500 mb-1 block">{label}</Label>
                <Input
                  placeholder={placeholder}
                  value={localConfig.socialMedia[key as keyof typeof localConfig.socialMedia]}
                  onChange={e => set('socialMedia', { ...localConfig.socialMedia, [key]: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      );

      case 'products': return (
        <div className="space-y-4">
          <SectionHeading title="Featured Products" subtitle={`Homepage best sellers — select up to 8 (${localConfig.featuredProductIds.length}/8 selected)`} />
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {products.map(p => {
              const selected = localConfig.featuredProductIds.includes(p.id);
              return (
                <div key={p.id} className={cn('flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer', selected ? 'border-[#A77F1B]/30 bg-amber-50/60' : 'border-gray-200 bg-white hover:border-gray-300')}
                  onClick={() => toggleFeaturedProduct(p.id)}
                >
                  <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
                  <Checkbox
                    id={`prod-${p.id}`}
                    checked={selected}
                    onCheckedChange={() => toggleFeaturedProduct(p.id)}
                    className="shrink-0"
                    onClick={e => e.stopPropagation()}
                  />
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{p.category} · LKR {p.price.toLocaleString()}</p>
                  </div>
                  {selected && <span className="text-[10px] bg-[#A77F1B] text-white px-2 py-0.5 rounded-full font-semibold shrink-0">Featured</span>}
                </div>
              );
            })}
          </div>
        </div>
      );

      case 'about': return (
        <div className="space-y-5">
          <SectionHeading title="About Section" subtitle="The story/about us section on the homepage." />
          <FieldGroup label="Section Title">
            <Input value={localConfig.aboutTitle} onChange={e => set('aboutTitle', e.target.value)} placeholder="The Gold Standard" />
          </FieldGroup>
          <FieldGroup label="Description">
            <Textarea value={localConfig.aboutText} onChange={e => set('aboutText', e.target.value)} className="resize-none h-36 text-sm" placeholder="Tell your brand story..." />
          </FieldGroup>
        </div>
      );

      case 'payment': return (
        <div className="space-y-6">
          <SectionHeading title="Payment & Delivery" subtitle="Configure checkout payment methods and shipping fees." />

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Payment Methods</p>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-[10px] font-black text-green-700">COD</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Customer pays on arrival</p>
                </div>
              </div>
              <Switch
                checked={localConfig.paymentMethods.cod}
                onCheckedChange={v => set('paymentMethods', { ...localConfig.paymentMethods, cod: v })}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard size={16} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Bank Transfer</p>
                  <p className="text-xs text-gray-400">Customer transfers to your account</p>
                </div>
              </div>
              <Switch
                checked={localConfig.paymentMethods.bankTransfer}
                onCheckedChange={v => set('paymentMethods', { ...localConfig.paymentMethods, bankTransfer: v })}
              />
            </div>

            {localConfig.paymentMethods.bankTransfer && (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                {[
                  { field: 'bankName', label: 'Bank Name', placeholder: 'Bank of Ceylon' },
                  { field: 'bankAccount', label: 'Account Number', placeholder: '0000000000' },
                  { field: 'bankBranch', label: 'Branch', placeholder: 'Colombo Main' },
                  { field: 'bankReference', label: 'Reference Format', placeholder: 'Order ID' },
                ].map(({ field, label, placeholder }) => (
                  <FieldGroup key={field} label={label}>
                    <Input
                      value={localConfig.paymentMethods[field as keyof typeof localConfig.paymentMethods] as string}
                      onChange={e => set('paymentMethods', { ...localConfig.paymentMethods, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="bg-white"
                    />
                  </FieldGroup>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Delivery Charges</p>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Standard Courier Fee (LKR)">
                <Input
                  type="number"
                  value={localConfig.courierCharge}
                  onChange={e => set('courierCharge', Number(e.target.value))}
                />
              </FieldGroup>
              <FieldGroup label="Free Delivery Above (LKR)">
                <Input
                  type="number"
                  value={localConfig.freeDeliveryThreshold}
                  onChange={e => set('freeDeliveryThreshold', Number(e.target.value))}
                />
              </FieldGroup>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-2">
              <Truck size={13} />
              Orders under LKR {localConfig.freeDeliveryThreshold.toLocaleString()} → +LKR {localConfig.courierCharge.toLocaleString()} delivery fee
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-88px)] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Website Editor</h1>
          <p className="text-xs text-gray-400 mt-0.5">Customise every part of your storefront</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2 text-xs border-gray-200 text-gray-600">
            <RotateCcw size={13} /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#A77F1B] hover:bg-[#8D6A16] text-white flex items-center gap-2 text-xs px-5">
            <Save size={13} /> {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left: Section Nav */}
        <div className="w-48 bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Sections</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SectionNav active={activeSection} onChange={setActiveSection} />
          </div>
        </div>

        {/* Middle: Editor Panel */}
        <div className="w-[340px] bg-white rounded-xl border border-gray-200 flex flex-col shrink-0 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              {(() => { const s = SECTIONS.find(s => s.key === activeSection); return s ? <s.icon size={14} className="text-[#A77F1B]" /> : null; })()}
              <p className="text-sm font-bold text-gray-900">{SECTIONS.find(s => s.key === activeSection)?.label}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {renderSection()}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden min-w-0">
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-gray-500">Live Preview</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setPreviewDevice('desktop')} className={cn('p-1.5 rounded-md transition-all', previewDevice === 'desktop' ? 'bg-white shadow-sm text-[#A77F1B]' : 'text-gray-400 hover:text-gray-600')}>
                <Monitor size={15} />
              </button>
              <button onClick={() => setPreviewDevice('mobile')} className={cn('p-1.5 rounded-md transition-all', previewDevice === 'mobile' ? 'bg-white shadow-sm text-[#A77F1B]' : 'text-gray-400 hover:text-gray-600')}>
                <Smartphone size={15} />
              </button>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#A77F1B] transition-colors">
              <ExternalLink size={12} /> Open Site
            </a>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 bg-[#F0EDE6] overflow-hidden">
            <div className={cn(
              'bg-white shadow-xl overflow-hidden overflow-y-auto transition-all duration-300 origin-top',
              previewDevice === 'mobile'
                ? 'w-[360px] h-[680px] border-[6px] border-gray-800 rounded-3xl'
                : 'w-full h-full rounded-lg'
            )}>
              <div className="flex flex-col min-h-full font-sans pointer-events-none select-none text-[10px]">

                {localConfig.showAnnouncement && (
                  <div className="bg-[#A77F1B] text-white py-2 px-4 text-center tracking-widest uppercase font-semibold">
                    {localConfig.announcementBar}
                  </div>
                )}

                <div className="py-3 px-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <div className="hidden sm:flex gap-4">
                    <span className="tracking-[0.2em] text-gray-700 font-medium">HOME</span>
                    <span className="tracking-[0.2em] text-gray-500">SHOP</span>
                  </div>
                  <div className="text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    {localConfig.logo ? (
                      <img src={localConfig.logo} alt="Logo" className="h-7 object-contain" />
                    ) : (
                      <div>
                        <p className="font-serif text-base font-bold tracking-widest text-gray-900">{localConfig.storeName.toUpperCase()}</p>
                        <p className="tracking-[0.25em] text-[#A77F1B] uppercase" style={{ fontSize: '8px' }}>BY SHANI RANASINGHE</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tracking-[0.2em] text-gray-500 hidden sm:block">ABOUT</span>
                    <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200" />
                  </div>
                </div>

                <div className="relative h-52 flex items-center justify-start bg-[#FFF5F8] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F8] via-[#FFF5F8]/80 to-transparent z-10" />
                  {localConfig.heroBgImage ? (
                    <img src={localConfig.heroBgImage} className="absolute inset-0 w-full h-full object-cover object-right" alt="" />
                  ) : (
                    <img src="/images/hero-bg.png" className="absolute inset-0 w-full h-full object-cover object-right" alt="" />
                  )}
                  <div className="relative z-20 px-6 max-w-xs">
                    <h2 className="font-serif text-2xl leading-tight text-gray-900">
                      {localConfig.heroLine1} <br />
                      <span className="italic text-[#A77F1B]">{localConfig.heroLine2}</span>
                    </h2>
                    <p className="text-gray-500 tracking-widest mt-2 leading-relaxed" style={{ fontSize: '8px' }}>{localConfig.heroSubtitle}</p>
                    <div className="flex gap-2 mt-3">
                      <div className="bg-[#A77F1B] text-white px-3 py-1.5 font-bold tracking-widest" style={{ fontSize: '8px' }}>{localConfig.ctaText}</div>
                      <div className="border border-[#A77F1B] text-[#A77F1B] px-3 py-1.5 font-bold tracking-widest" style={{ fontSize: '8px' }}>{localConfig.ctaSecondaryText}</div>
                    </div>
                  </div>
                </div>

                <div className="py-6 bg-[#FFF5F8] px-5">
                  <div className="text-center mb-4">
                    <p className="text-[#A77F1B] tracking-[0.3em] uppercase font-semibold" style={{ fontSize: '8px' }}>Most Loved</p>
                    <p className="font-serif text-sm mt-0.5">Best Sellers</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {localConfig.featuredProductIds.slice(0, 4).map(id => {
                      const p = products.find(p => p.id === id);
                      if (!p) return null;
                      return (
                        <div key={id} className="bg-white p-1.5 rounded">
                          <div className="aspect-square bg-gray-100 mb-1.5 rounded overflow-hidden">
                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <p className="truncate font-medium text-gray-800" style={{ fontSize: '8px' }}>{p.name}</p>
                          <p className="text-[#A77F1B] mt-0.5" style={{ fontSize: '8px' }}>LKR {p.price.toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="py-6 bg-white px-5">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="bg-gray-100 aspect-[4/3] rounded overflow-hidden">
                      <img src="/images/lifestyle-1.png" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="font-serif text-sm text-gray-900 mb-1">{localConfig.aboutTitle}</p>
                      <p className="text-gray-400 leading-relaxed line-clamp-4" style={{ fontSize: '8px' }}>{localConfig.aboutText}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
