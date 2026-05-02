import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SocialMedia {
  facebook: string;
  instagram: string;
  whatsapp: string;
  tiktok: string;
  youtube: string;
}

export interface PaymentMethods {
  cod: boolean;
  bankTransfer: boolean;
  bankName: string;
  bankAccount: string;
  bankBranch: string;
  bankReference: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
}

export interface SiteConfig {
  announcementBar: string;
  heroLine1: string;
  heroLine2: string;
  heroSubtitle: string;
  heroBgImage: string;
  aboutTitle: string;
  aboutText: string;
  showAnnouncement: boolean;
  featuredProductIds: string[];
  ctaText: string;
  ctaSecondaryText: string;
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: SocialMedia;
  paymentMethods: PaymentMethods;
  courierCharge: number;
  freeDeliveryThreshold: number;
  seo: SeoSettings;
}

const defaultSiteConfig: SiteConfig = {
  announcementBar: 'COMPLIMENTARY ISLAND-WIDE DELIVERY ON ALL ORDERS OVER RS. 10,000',
  heroLine1: 'Redefine',
  heroLine2: 'Your Glow.',
  heroSubtitle: 'Discover opulent beauty curated for the modern Sri Lankan woman.',
  heroBgImage: '',
  aboutTitle: 'The Gold Standard',
  aboutText: 'We believe that luxury should not just be a label, but an experience. Every product in our collection is curated with the highest standards of quality, ensuring you receive nothing but the best.',
  showAnnouncement: true,
  featuredProductIds: ['1', '2', '3', '4', '5', '6', '7', '8'],
  ctaText: 'EXPLORE COLLECTION',
  ctaSecondaryText: 'TRACK MY ORDER',
  storeName: 'Gold Beauty Fashion',
  contactEmail: 'hello@goldbeauty.lk',
  contactPhone: '+94 77 000 0000',
  address: 'Colombo, Sri Lanka',
  socialMedia: {
    facebook: 'https://facebook.com/goldbeautyfashion',
    instagram: 'https://instagram.com/goldbeautyfashion',
    whatsapp: '94770000000',
    tiktok: '',
    youtube: '',
  },
  paymentMethods: {
    cod: true,
    bankTransfer: false,
    bankName: 'Bank of Ceylon',
    bankAccount: '0000000000',
    bankBranch: 'Colombo Main',
    bankReference: 'Order ID',
  },
  courierCharge: 500,
  freeDeliveryThreshold: 10000,
  seo: {
    title: 'Gold Beauty Fashion by Shani Ranasinghe | Premium Cosmetics Sri Lanka',
    description: 'Discover luxury cosmetics and premium beauty products curated for the modern Sri Lankan woman. Shop foundations, lipsticks, perfumes and more.',
    keywords: 'cosmetics, beauty, Sri Lanka, luxury makeup, foundation, lipstick, perfume, skincare, gold beauty',
  },
};

interface SiteConfigContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
  resetSiteConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('gold_beauty_site_config');
      return saved ? { ...defaultSiteConfig, ...JSON.parse(saved) } : defaultSiteConfig;
    } catch { return defaultSiteConfig; }
  });

  useEffect(() => {
    localStorage.setItem('gold_beauty_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  const updateSiteConfig = (config: Partial<SiteConfig>) =>
    setSiteConfig(prev => ({ ...prev, ...config }));

  const resetSiteConfig = () => setSiteConfig(defaultSiteConfig);

  return (
    <SiteConfigContext.Provider value={{ siteConfig, updateSiteConfig, resetSiteConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
};
