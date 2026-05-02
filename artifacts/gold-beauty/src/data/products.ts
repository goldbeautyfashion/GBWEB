export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
  benefits: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Gold Radiance Foundation",
    price: 4500,
    category: "Foundation",
    rating: 4.8,
    image: "/images/prod-1.png",
    description: "Achieve a flawless, glowing complexion with our signature Gold Radiance Foundation. Infused with light-reflecting pigments for an opulent finish.",
    benefits: ["Full coverage", "Luminous finish", "Long-lasting up to 24h", "Hydrating formula"]
  },
  {
    id: "2",
    name: "Velvet Rose Lipstick",
    price: 2800,
    category: "Lipstick",
    rating: 4.9,
    image: "/images/prod-2.png",
    description: "A deeply pigmented, ultra-matte lipstick that glides on smoothly, leaving lips soft, velvety, and undeniably bold.",
    benefits: ["Intense color payoff", "Non-drying matte", "Smudge-proof", "Vitamin E enriched"]
  },
  {
    id: "3",
    name: "Smoky Gold Eye Palette",
    price: 6500,
    category: "Eyeshadow",
    rating: 4.7,
    image: "/images/prod-3.png",
    description: "A luxurious palette featuring a blend of matte and metallic shades to create the perfect dramatic eye look for any occasion.",
    benefits: ["Highly pigmented", "Blendable", "Crease-resistant", "Includes gold and bronze tones"]
  },
  {
    id: "4",
    name: "Oud Noir Perfume",
    price: 8900,
    category: "Fragrance",
    rating: 4.9,
    image: "/images/prod-4.png",
    description: "A mysterious and seductive fragrance combining rich oud, warm spices, and a hint of dark floral notes for a memorable evening.",
    benefits: ["Long-lasting scent", "Premium essential oils", "Elegant glass bottle"]
  },
  {
    id: "5",
    name: "Glowing Skin Serum",
    price: 5200,
    category: "Skincare",
    rating: 4.6,
    image: "/images/prod-5.png",
    description: "Revitalize your skin with this potent serum. Packed with antioxidants and 24k gold flakes to give you a youthful, radiant glow.",
    benefits: ["Brightens complexion", "Reduces fine lines", "Fast-absorbing", "Suitable for all skin types"]
  },
  {
    id: "6",
    name: "Berry Bliss Lip Gloss",
    price: 2200,
    category: "Lipstick",
    rating: 4.5,
    image: "/images/prod-6.png",
    description: "A high-shine lip gloss that delivers a luscious berry tint without feeling sticky. Perfect for an everyday glamorous look.",
    benefits: ["High shine", "Non-sticky", "Plumping effect"]
  },
  {
    id: "7",
    name: "Champagne Highlight Powder",
    price: 3800,
    category: "Highlighter",
    rating: 4.8,
    image: "/images/prod-7.png",
    description: "A silky, finely milled highlighting powder that blends seamlessly into the skin for a beautiful champagne glow.",
    benefits: ["Buildable glow", "Silky texture", "Blurs imperfections"]
  },
  {
    id: "8",
    name: "Flawless Concealer",
    price: 3200,
    category: "Foundation",
    rating: 4.7,
    image: "/images/prod-8.png",
    description: "A high-coverage concealer that easily hides dark circles and blemishes while remaining lightweight and crease-free.",
    benefits: ["High coverage", "Lightweight", "Crease-free"]
  },
  {
    id: "9",
    name: "Luxe Mascara Volume",
    price: 2900,
    category: "Mascara",
    rating: 4.6,
    image: "/images/prod-9.png",
    description: "Amplify your lashes with our Luxe Mascara. Designed to volumize and lengthen without clumping for a dramatic effect.",
    benefits: ["Volumizing", "Lengthening", "Water-resistant"]
  },
  {
    id: "10",
    name: "Rose Gold Blush",
    price: 3500,
    category: "Blush",
    rating: 4.8,
    image: "/images/prod-10.png",
    description: "A gorgeous rose-toned blush infused with a subtle gold shimmer to give your cheeks a natural, healthy flush.",
    benefits: ["Natural flush", "Subtle shimmer", "Long-lasting"]
  },
  {
    id: "11",
    name: "Night Jasmine Perfume",
    price: 7800,
    category: "Fragrance",
    rating: 4.7,
    image: "/images/prod-11.png",
    description: "An enchanting floral fragrance that captures the essence of night-blooming jasmine, perfect for the modern woman.",
    benefits: ["Floral notes", "Elegant and sophisticated", "Long-lasting"]
  },
  {
    id: "12",
    name: "Intense Drama Eyeshadow",
    price: 5800,
    category: "Eyeshadow",
    rating: 4.9,
    image: "/images/prod-12.png",
    description: "A compact palette with ultra-pigmented dark and shimmering shades to create an intense, mesmerizing look.",
    benefits: ["Ultra-pigmented", "Smooth application", "Travel-friendly"]
  }
];

export const categories = [
  { name: "Foundations", image: "/images/cat-foundation.png" },
  { name: "Lipsticks", image: "/images/cat-lipstick.png" },
  { name: "Eyeshadows", image: "/images/cat-eyeshadow.png" },
  { name: "Fragrances", image: "/images/cat-fragrance.png" },
  { name: "Skincare", image: "/images/cat-skincare.png" }
];
