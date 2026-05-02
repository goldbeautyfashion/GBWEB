import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { toast } from 'sonner';
import {
  Globe, CreditCard, Truck, Share2, Search, Image, Store, Bell, Trash2,
  Facebook, Instagram, Youtube, MessageCircle, Music2, Save, Upload, Eye
} from 'lucide-react';

function Section({ icon: Icon, title, description, children }: {
  icon: typeof Globe; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={18} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function FieldRow({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const { siteConfig, updateSiteConfig, resetSiteConfig } = useSiteConfig();
  const heroImgRef = useRef<HTMLInputElement>(null);

  // Local state mirrors for editable sections
  const [store, setStore] = useState({
    storeName: siteConfig.storeName,
    contactEmail: siteConfig.contactEmail,
    contactPhone: siteConfig.contactPhone,
    address: siteConfig.address,
  });

  const [social, setSocial] = useState({ ...siteConfig.socialMedia });

  const [payment, setPayment] = useState({ ...siteConfig.paymentMethods });

  const [delivery, setDelivery] = useState({
    courierCharge: siteConfig.courierCharge,
    freeDeliveryThreshold: siteConfig.freeDeliveryThreshold,
  });

  const [seo, setSeo] = useState({ ...siteConfig.seo });

  const [heroBgPreview, setHeroBgPreview] = useState(siteConfig.heroBgImage);

  const save = (section: string, data: object) => {
    updateSiteConfig(data);
    toast.success(`${section} saved successfully`);
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setHeroBgPreview(base64);
      updateSiteConfig({ heroBgImage: base64 });
      toast.success('Hero background image updated!');
    };
    reader.readAsDataURL(file);
  };

  const clearHeroImage = () => {
    setHeroBgPreview('');
    updateSiteConfig({ heroBgImage: '' });
    toast.success('Hero image reset to default');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store configuration, branding, and preferences.</p>
      </div>

      {/* Store Information */}
      <Section icon={Store} title="Store Information" description="Basic details about your business.">
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="Store Name">
            <Input value={store.storeName} onChange={e => setStore(p => ({ ...p, storeName: e.target.value }))} />
          </FieldRow>
          <FieldRow label="Contact Email">
            <Input type="email" value={store.contactEmail} onChange={e => setStore(p => ({ ...p, contactEmail: e.target.value }))} />
          </FieldRow>
          <FieldRow label="Phone Number">
            <Input value={store.contactPhone} onChange={e => setStore(p => ({ ...p, contactPhone: e.target.value }))} />
          </FieldRow>
          <FieldRow label="Address">
            <Input value={store.address} onChange={e => setStore(p => ({ ...p, address: e.target.value }))} />
          </FieldRow>
        </div>
        <Button onClick={() => save('Store information', store)} className="bg-primary hover:bg-accent text-white mt-2">
          <Save size={15} className="mr-2" /> Save Information
        </Button>
      </Section>

      {/* Hero Background Image */}
      <Section icon={Image} title="Hero Background Image" description="Upload a custom background image for the homepage hero section.">
        <div className="space-y-4">
          {heroBgPreview ? (
            <div className="relative rounded-lg overflow-hidden border border-border" style={{ height: 180 }}>
              <img src={heroBgPreview} alt="Hero Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
                <button onClick={() => heroImgRef.current?.click()} className="bg-white text-foreground px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
                  <Upload size={14} /> Replace
                </button>
                <button onClick={clearHeroImage} className="bg-destructive text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <Image size={36} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-foreground font-medium mb-1">No custom image set</p>
              <p className="text-xs text-muted-foreground mb-4">Upload a JPG or PNG (max 5MB). Ideal size: 1920×1080px</p>
              <Button variant="outline" onClick={() => heroImgRef.current?.click()} className="flex items-center gap-2 mx-auto">
                <Upload size={14} /> Choose Image
              </Button>
            </div>
          )}
          <input ref={heroImgRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleHeroImageUpload} />
          {!heroBgPreview && (
            <p className="text-xs text-muted-foreground">Currently using default image from <code className="bg-gray-100 px-1 rounded">/images/hero-bg.png</code></p>
          )}
        </div>
      </Section>

      {/* Social Media */}
      <Section icon={Share2} title="Social Media Links" description="Manage links shown in the website footer and header.">
        <div className="space-y-3">
          {[
            { key: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
            { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
            { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp Number', placeholder: '94770000000 (no + or spaces)' },
            { key: 'tiktok', icon: Music2, label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle' },
            { key: 'youtube', icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
          ].map(({ key, icon: Icon, label, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <Input
                  placeholder={placeholder}
                  value={social[key as keyof typeof social]}
                  onChange={e => setSocial(p => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => save('Social media links', { socialMedia: social })} className="bg-primary hover:bg-accent text-white">
          <Save size={15} className="mr-2" /> Save Social Links
        </Button>
      </Section>

      {/* Payment Options */}
      <Section icon={CreditCard} title="Payment Options" description="Configure accepted payment methods shown at checkout.">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-bold text-green-700">COD</span>
              </div>
              <div>
                <p className="font-medium text-sm">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Customer pays when order arrives</p>
              </div>
            </div>
            <Switch checked={payment.cod} onCheckedChange={v => setPayment(p => ({ ...p, cod: v }))} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard size={18} className="text-blue-700" />
              </div>
              <div>
                <p className="font-medium text-sm">Bank Transfer</p>
                <p className="text-xs text-muted-foreground">Customer transfers to your bank account</p>
              </div>
            </div>
            <Switch checked={payment.bankTransfer} onCheckedChange={v => setPayment(p => ({ ...p, bankTransfer: v }))} />
          </div>

          {payment.bankTransfer && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-blue-100 bg-blue-50/50">
              <FieldRow label="Bank Name">
                <Input value={payment.bankName} onChange={e => setPayment(p => ({ ...p, bankName: e.target.value }))} placeholder="Bank of Ceylon" />
              </FieldRow>
              <FieldRow label="Account Number">
                <Input value={payment.bankAccount} onChange={e => setPayment(p => ({ ...p, bankAccount: e.target.value }))} placeholder="0000000000" />
              </FieldRow>
              <FieldRow label="Branch">
                <Input value={payment.bankBranch} onChange={e => setPayment(p => ({ ...p, bankBranch: e.target.value }))} placeholder="Colombo Main" />
              </FieldRow>
              <FieldRow label="Reference Format" note="e.g. use Order ID as reference">
                <Input value={payment.bankReference} onChange={e => setPayment(p => ({ ...p, bankReference: e.target.value }))} placeholder="Order ID" />
              </FieldRow>
            </div>
          )}
        </div>
        <Button onClick={() => save('Payment options', { paymentMethods: payment })} className="bg-primary hover:bg-accent text-white">
          <Save size={15} className="mr-2" /> Save Payment Settings
        </Button>
      </Section>

      {/* Delivery & Courier */}
      <Section icon={Truck} title="Delivery & Courier Charges" description="Configure shipping fees and free delivery threshold.">
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="Standard Courier Charge (LKR)" note="Applied to all orders below the free delivery threshold">
            <Input
              type="number"
              value={delivery.courierCharge}
              onChange={e => setDelivery(p => ({ ...p, courierCharge: Number(e.target.value) }))}
            />
          </FieldRow>
          <FieldRow label="Free Delivery Threshold (LKR)" note="Orders above this amount get free delivery">
            <Input
              type="number"
              value={delivery.freeDeliveryThreshold}
              onChange={e => setDelivery(p => ({ ...p, freeDeliveryThreshold: Number(e.target.value) }))}
            />
          </FieldRow>
        </div>
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700">
          Preview: Orders under LKR {delivery.freeDeliveryThreshold.toLocaleString()} → +LKR {delivery.courierCharge.toLocaleString()} delivery fee applied automatically.
        </div>
        <Button onClick={() => save('Delivery settings', { courierCharge: delivery.courierCharge, freeDeliveryThreshold: delivery.freeDeliveryThreshold })} className="bg-primary hover:bg-accent text-white">
          <Save size={15} className="mr-2" /> Save Delivery Settings
        </Button>
      </Section>

      {/* SEO */}
      <Section icon={Search} title="SEO & Meta Tags" description="Improve search engine visibility and social sharing.">
        <FieldRow label="Page Title" note="Shown in browser tab and search results (recommended: 50-60 chars)">
          <Input
            value={seo.title}
            onChange={e => setSeo(p => ({ ...p, title: e.target.value }))}
            maxLength={70}
          />
          <p className="text-xs text-muted-foreground text-right">{seo.title.length}/70</p>
        </FieldRow>
        <FieldRow label="Meta Description" note="Shown in search results (recommended: 150-160 chars)">
          <textarea
            value={seo.description}
            onChange={e => setSeo(p => ({ ...p, description: e.target.value }))}
            rows={3}
            maxLength={170}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">{seo.description.length}/170</p>
        </FieldRow>
        <FieldRow label="Keywords" note="Comma-separated keywords relevant to your store">
          <Input
            value={seo.keywords}
            onChange={e => setSeo(p => ({ ...p, keywords: e.target.value }))}
            placeholder="cosmetics, beauty, Sri Lanka, luxury makeup..."
          />
        </FieldRow>
        <Button onClick={() => save('SEO settings', { seo })} className="bg-primary hover:bg-accent text-white">
          <Save size={15} className="mr-2" /> Save SEO Settings
        </Button>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" description="Choose how you want to be alerted.">
        <div className="space-y-5">
          {[
            { label: 'New Order Alert', desc: 'Get notified when a new order is placed.' },
            { label: 'Low Stock Alert', desc: 'Alert when a product has less than 5 items.' },
            { label: 'Daily Sales Summary', desc: 'Receive a daily summary at 8:00 PM.' },
          ].map(({ label, desc }, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch defaultChecked={i < 2} />
            </div>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
      <Card className="border border-destructive/20 shadow-sm bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Reset Site Config</p>
              <p className="text-xs text-muted-foreground">Revert all website editor and settings to defaults.</p>
            </div>
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => {
              resetSiteConfig();
              toast.error('Site configuration reset to defaults');
            }}>Reset Config</Button>
          </div>
          <div className="flex items-center justify-between border-t border-destructive/20 pt-4">
            <div>
              <p className="font-medium text-sm">Clear All Orders</p>
              <p className="text-xs text-muted-foreground">Permanently delete all customer orders from local storage.</p>
            </div>
            <Button variant="destructive" onClick={() => {
              localStorage.removeItem('gold_beauty_orders');
              localStorage.removeItem('gold_beauty_order_seq');
              toast.error('All orders cleared');
              window.location.reload();
            }}>Clear Orders</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
