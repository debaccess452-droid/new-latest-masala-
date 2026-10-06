import heroSpiceApothecary from '../assets/images/hero_spice_apothecary_1791264724907.jpg';
import spiceHaldiTurmeric from '../assets/images/spice_haldi_turmeric_1791264736980.jpg';
import spiceLalMirchChilli from '../assets/images/spice_lal_mirch_chilli_1791264748548.jpg';
import spiceDhaniyaCoriander from '../assets/images/spice_dhaniya_coriander_1791264759115.jpg';
import spiceJeeraCumin from '../assets/images/spice_jeera_cumin_1791264770145.jpg';
import craftColdGrindingStory from '../assets/images/craft_cold_grinding_story_1791264780916.jpg';

export type PackWeight = '25g' | '50g' | '100g' | '200g' | '500g' | '1kg';

export const PACK_WEIGHTS: PackWeight[] = ['25g', '50g', '100g', '200g', '500g', '1kg'];

export interface SpiceProduct {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  hindi: string;
  botanicalName: string;
  originRegion: string;
  harvestNote: string;
  tagline: string;
  description: string;
  image: string;
  pricing: Record<PackWeight, number>;
  aromaNotes: string;
  culinaryPairings: string[];
  essentialOilRetention: string;
  batchCode: string;
}

export interface BrandConfig {
  brandName: string;
  company: string;
  taglineHindi: string;
  taglineEnglish: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  instagramUrl: string;
  freeDeliveryMin: number;
  deliveryCharge: number;
}

export const BRAND_CONFIG: BrandConfig = {
  brandName: 'KBR Masale',
  company: 'KBR Global Ventures',
  taglineHindi: 'शुद्धता और स्वाद का असली संगम',
  taglineEnglish: 'Single-Origin Cold-Ground Indian Spices',
  whatsappNumber: '919599714707',
  whatsappDisplay: '+91 95997 14707',
  instagramUrl: 'https://www.instagram.com/kbr_global_spice?stkn=MW9oem5meDVvMWoybw==',
  freeDeliveryMin: 500,
  deliveryCharge: 40,
};

export interface DiscountTier {
  min: number;
  pct: number;
  label: string;
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { min: 2000, pct: 40, label: '40% Pantry Reserve Savings (Orders > ₹2,000)' },
  { min: 1500, pct: 30, label: '30% Household Bulk Savings (Orders > ₹1,500)' },
  { min: 1000, pct: 10, label: '10% Kitchen Staple Savings (Orders > ₹1,000)' },
];

export const HERO_IMAGE = heroSpiceApothecary;
export const CRAFT_STORY_IMAGE = craftColdGrindingStory;

export const SPICE_PRODUCTS: SpiceProduct[] = [
  {
    id: 1,
    slug: 'haldi',
    name: 'KBR Haldi Powder',
    shortName: 'Haldi (Turmeric)',
    hindi: 'हल्दी पाउडर',
    botanicalName: 'Curcuma longa',
    originRegion: 'Sangli & Erode Select Belt',
    harvestNote: 'Sun-cured whole rhizomes · High natural curcumin',
    tagline: 'Deep golden-ochre warmth and earthy resonance for everyday dals and curries.',
    description:
      'Milled from sun-cured whole turmeric fingers at low grinding temperatures so natural curcuminoids and warm ginger-citrus volatile oils remain intact. Zero lead chromate, zero synthetic yellow dyes, and no starch fillers.',
    image: spiceHaldiTurmeric,
    pricing: {
      '25g': 8,
      '50g': 15,
      '100g': 30,
      '200g': 50,
      '500g': 140,
      '1kg': 250,
    },
    aromaNotes: 'Warm earth · Fresh ginger root · Mild citrus peel',
    culinaryPairings: ['Everyday Tadka Dal', 'Golden Haldi Doodh', 'Slow-Simmered Sabzis'],
    essentialOilRetention: '4.2% Volatile Oil Retained',
    batchCode: 'KBR-HLD-2610',
  },
  {
    id: 2,
    slug: 'red-chilli',
    name: 'KBR Red Chilli Powder',
    shortName: 'Lal Mirch (Red Chilli)',
    hindi: 'लाल मिर्च पाउडर',
    botanicalName: 'Capsicum annuum',
    originRegion: 'Guntur & Byadgi Dual-Harvest',
    harvestNote: 'Stem-trimmed sun-dried pods · Balanced heat & colour',
    tagline: 'Rich crimson colour with clean, rounded heat and sun-ripened fruitiness.',
    description:
      'Cold-ground from hand-sorted, stemless sun-dried red chillies. Delivers a naturally vibrant crimson gravy colour alongside balanced, lingering warmth—never harsh or chemically dyed with Sudan red.',
    image: spiceLalMirchChilli,
    pricing: {
      '25g': 13,
      '50g': 25,
      '100g': 50,
      '200g': 95,
      '500g': 230,
      '1kg': 400,
    },
    aromaNotes: 'Sun-dried berry · Smoky warmth · Crisp pungent finish',
    culinaryPairings: ['Rich Onion-Tomato Gravies', 'Tandoori Marinades', 'Garlic Lahsun Chutney'],
    essentialOilRetention: 'Zero Artificial Sudan Dye',
    batchCode: 'KBR-LMC-2610',
  },
  {
    id: 3,
    slug: 'dhaniya',
    name: 'KBR Dhaniya Powder',
    shortName: 'Dhaniya (Coriander)',
    hindi: 'धनिया पाउडर',
    botanicalName: 'Coriandrum sativum',
    originRegion: 'Kota & Ramganj Mandi',
    harvestNote: 'Eagle-grade split seeds · Linalool-rich aroma',
    tagline: 'Fresh-ground botanical sweetness that binds and thickens every Indian gravy.',
    description:
      'Crafted from winter-harvested Kota coriander seeds with naturally high linalool content. Slow-milled in small batches to preserve its bright, lemony-sage bouquet and velvety gravy-binding texture.',
    image: spiceDhaniyaCoriander,
    pricing: {
      '25g': 15,
      '50g': 30,
      '100g': 50,
      '200g': 95,
      '500g': 220,
      '1kg': 400,
    },
    aromaNotes: 'Crushed citrus leaf · Sweet sage · Toasted nuttiness',
    culinaryPairings: ['Paneer & Kofta Gravies', 'Dry Aloo Bhuna', 'Home Masala Blends'],
    essentialOilRetention: '0.9% Natural Linalool Oil',
    batchCode: 'KBR-DHN-2610',
  },
  {
    id: 4,
    slug: 'jeera',
    name: 'KBR Jeera Powder',
    shortName: 'Jeera (Cumin)',
    hindi: 'जीरा पाउडर',
    botanicalName: 'Cuminum cyminum',
    originRegion: 'Unjha & Jodhpur Arid Belt',
    harvestNote: 'Bold-grain arid harvest · Intense cuminaldehyde',
    tagline: 'Deep, nutty, roasted-earth intensity that awakens tadkas, raitas, and chaas.',
    description:
      'Selected from Unjha bold-grain cumin harvests and gently milled to safeguard volatile cuminaldehyde oils. A single pinch releases an unmistakable warm, nutty fragrance across hot ghee or chilled curd.',
    image: spiceJeeraCumin,
    pricing: {
      '25g': 20,
      '50g': 30,
      '100g': 55,
      '200g': 115,
      '500g': 260,
      '1kg': 500,
    },
    aromaNotes: 'Warm toasted cumin · Piney earth · Savory spice',
    culinaryPairings: ['Smoky Ghee Tadka', 'Chilled Boondi Raita', 'SpicedChaas & Street Chaat'],
    essentialOilRetention: '3.8% Cuminaldehyde Oil',
    batchCode: 'KBR-JRA-2610',
  },
];

export interface CraftPillar {
  index: string;
  title: string;
  metric: string;
  description: string;
  detail: string;
}

export const CRAFT_PILLARS: CraftPillar[] = [
  {
    index: '01.',
    title: 'Direct Mandi & Farm Lot Selection',
    metric: '100% Whole-Seed Traceability',
    description:
      'We procure whole turmeric fingers, stemless chillies, split eagle coriander, and bold cumin directly from specialized agricultural belts across India rather than pre-ground commodity brokers.',
    detail: 'Audited lots · Zero spent-chaff blending',
  },
  {
    index: '02.',
    title: 'Sub-42°C Slow Cold-Grinding',
    metric: '< 42°C Chamber Temp',
    description:
      'High-speed commercial hammer mills scorch spices above 85°C, evaporating delicate essential oils. Our controlled low-RPM milling preserves the native aroma and natural pigment of every grain.',
    detail: 'Retains up to 96% natural volatile oils',
  },
  {
    index: '03.',
    title: 'Zero Synthetic Dyes or Anti-Caking Fillers',
    metric: '0.0% Artificial Additives',
    description:
      'What leaves our grinding chamber goes straight into the pouch. No saw-dust fillers, no artificial anti-caking silica, and zero synthetic colour enhancers.',
    detail: 'Pure single-ingredient spice powders',
  },
  {
    index: '04.',
    title: 'Moisture-Lock Barrier Sealing',
    metric: '1–4 Days Dispatch Window',
    description:
      'Each batch is multi-stage cleaned and sealed in food-grade aroma-barrier pouches from 25g trial packs up to 1kg family pantry reserves, shipped directly to your doorstep.',
    detail: 'Pan-India home delivery · Free above ₹500',
  },
];

export interface CulinaryDish {
  id: string;
  title: string;
  hindiTitle: string;
  prepTime: string;
  course: string;
  tadkaTechnique: string;
  flavorProfile: string;
  spiceFormula: {
    productId: number;
    proportion: string;
    role: string;
  }[];
}

export const CULINARY_DISHES: CulinaryDish[] = [
  {
    id: 'dal-tadka',
    title: 'Dhaba-Style Lasooni Dal Tadka',
    hindiTitle: 'लहसुनी दाल तड़का',
    prepTime: '25 Mins',
    course: 'Everyday Staple',
    tadkaTechnique:
      'Bloom crushed garlic in 1 tbsp cow ghee at 165°C, take off heat for 10 seconds, then swirl in KBR Jeera, Haldi, and Lal Mirch so the spices infuse without scorching.',
    flavorProfile: 'Smoky toasted cumin opening · Golden turmeric body · Clean crimson chilli oil finish',
    spiceFormula: [
      { productId: 4, proportion: '1 tsp (5g)', role: 'Aromatic roasted base note' },
      { productId: 1, proportion: '½ tsp (2.5g)', role: 'Earthy golden simmer colour' },
      { productId: 2, proportion: '¾ tsp (4g)', role: 'Vibrant crimson tadka oil' },
    ],
  },
  {
    id: 'paneer-masala',
    title: 'Charcoal-Spiced Paneer Bhuna Masala',
    hindiTitle: 'पनीर भुना मसाला',
    prepTime: '35 Mins',
    course: 'Festive Main',
    tadkaTechnique:
      'Slow-roast caramelised onions with KBR Dhaniya Powder for 6 minutes until oil separates; the natural linalool oils bind the tomato reduction into a glossy, restaurant-grade gravy.',
    flavorProfile: 'Velvety coriander-bound reduction · Bright natural red hue · Warm aromatic depth',
    spiceFormula: [
      { productId: 3, proportion: '2 tsp (10g)', role: 'Gravy body & citrus-herb bouquet' },
      { productId: 2, proportion: '1½ tsp (7.5g)', role: 'Deep natural crimson hue & heat' },
      { productId: 1, proportion: '½ tsp (2.5g)', role: 'Warm foundational undertone' },
    ],
  },
  {
    id: 'aloo-jeera',
    title: 'Pahadi Jeera-Dhaniya Aloo',
    hindiTitle: 'जीरा धनिया आलू',
    prepTime: '20 Mins',
    course: 'Tiffin & Roti Companion',
    tadkaTechnique:
      'Toss par-boiled baby potatoes in mustard oil, then coat generously with coarse KBR Jeera and Dhaniya Powder during the final 3 minutes of dry roasting for a fragrant crust.',
    flavorProfile: 'Nutty cumin crust · Fresh coriander brightness · Crisp golden edges',
    spiceFormula: [
      { productId: 4, proportion: '1½ tsp (7.5g)', role: 'Primary nutty toasted crust' },
      { productId: 3, proportion: '1½ tsp (7.5g)', role: 'Herbal sweetness & coating' },
      { productId: 1, proportion: '½ tsp (2.5g)', role: 'Sunlit golden potato glaze' },
    ],
  },
  {
    id: 'masala-chaas',
    title: 'Smoked Jeera & Mint Matka Chaas',
    hindiTitle: 'भुना जीरा मटका छाछ',
    prepTime: '5 Mins',
    course: 'Digestive Cooler',
    tadkaTechnique:
      'Whisk chilled artisanal curd with cold water in a clay matka and fold in KBR Jeera Powder and a pinch of Lal Mirch right before serving to preserve top-note aromatics.',
    flavorProfile: 'Cooling lactic tang · Immediate roasted cumin lift · Subtle warm finish',
    spiceFormula: [
      { productId: 4, proportion: '1 tsp (5g)', role: 'Digestive cuminaldehyde aroma' },
      { productId: 2, proportion: '⅛ tsp (0.5g)', role: 'Gentle palate-awakening warmth' },
    ],
  },
];

export interface CustomerReview {
  id: string;
  name: string;
  roleOrLocation: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  outcomeHighlight: string;
}

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Rahul Sharma',
    roleOrLocation: 'Home Chef · Jaipur, Rajasthan',
    rating: 5,
    comment:
      'Switching from supermarket packets to KBR Haldi Powder reduced the quantity we needed per dal by half—the natural golden colour and earthy aroma are immediately noticeable as soon as the pouch opens.',
    product: 'KBR Haldi Powder',
    date: 'September 2026',
    outcomeHighlight: '2× deeper aroma with half the spoonful',
  },
  {
    id: 'rev-2',
    name: 'Anjali Gupta',
    roleOrLocation: 'Household Pantry · New Delhi',
    rating: 5,
    comment:
      'KBR Jeera Powder smells like freshly roasted cumin straight off the tawa. We ordered the 500g family packs on WhatsApp and received our neatly sealed parcel within 2 days.',
    product: 'KBR Jeera Powder',
    date: 'September 2026',
    outcomeHighlight: 'Delivered in 48 hours · Fresh tawa-roasted aroma',
  },
  {
    id: 'rev-3',
    name: 'Suresh Verma',
    roleOrLocation: 'Culinary Caterer · Indore, MP',
    rating: 5,
    comment:
      'KBR Red Chilli Powder gives our paneer gravies a rich, authentic crimson colour without any synthetic dye aftertaste or throat burn. The 40% bulk discount above ₹2,000 makes it unbeatable for regular cooking.',
    product: 'KBR Red Chilli Powder',
    date: 'October 2026',
    outcomeHighlight: 'Natural crimson gravy colour · Zero throat harshness',
  },
];

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getProductById(id: number): SpiceProduct | undefined {
  return SPICE_PRODUCTS.find((p) => p.id === id);
}
