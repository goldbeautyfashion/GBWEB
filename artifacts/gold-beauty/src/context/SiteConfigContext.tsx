import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SiteConfig {
  announcementBar: string;
  heroLine1: string;
  heroLine2: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  showAnnouncement: boolean;
  featuredProductIds: string[];
  ctaText: string;
  ctaSecondaryText: string;
}

const defaultSiteConfig: SiteConfig = {
  announcementBar: "COMPLIMENTARY ISLAND-WIDE DELIVERY ON ALL ORDERS OVER RS. 10,000",
  heroLine1: "Redefine",
  heroLine2: "Your Glow.",
  heroSubtitle: "Discover opulent beauty curated for the modern Sri Lankan woman.",
  aboutTitle: "The Gold Standard",
  aboutText: "We believe that luxury should not just be a label, but an experience. Every product in our collection is curated with the highest standards of quality, ensuring you receive nothing but the best.",
  showAnnouncement: true,
  featuredProductIds: ["1", "2", "3", "4", "5", "6", "7", "8"],
  ctaText: "EXPLORE COLLECTION",
  ctaSecondaryText: "TRACK MY ORDER",
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
    } catch {
      return defaultSiteConfig;
    }
  });

  useEffect(() => {
    localStorage.setItem('gold_beauty_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...config }));
  };

  const resetSiteConfig = () => {
    setSiteConfig(defaultSiteConfig);
  };

  return (
    <SiteConfigContext.Provider value={{ siteConfig, updateSiteConfig, resetSiteConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
