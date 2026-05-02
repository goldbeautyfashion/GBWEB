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

export const defaultSiteConfig: SiteConfig = {
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
