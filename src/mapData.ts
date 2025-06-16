// This file defines the data structure for your store sections
// and contains the actual coordinate and dimension values.
// These coordinates are now precisely adjusted to create a highly dense and
// realistic 2D store map feel by closely mirroring the provided image.
export interface StoreSection {
  id: string;      // Unique identifier for the section
  name: string;    // Display name of the section
  x: number;       // X-coordinate (top-left corner) in SVG viewBox units
  y: number;       // Y-coordinate (top-left corner) in SVG viewBox units
  width: number;   // Width of the section in SVG viewBox units
  height: number;  // Height of the section in SVG viewBox units
}

// Logically organized store sections with varied sizes and positions,
// precisely adjusted to remove gaps and align with the latest provided image.
export const storeSections: StoreSection[] = [
  // Top Left Section Block - Adjusted for slight gap
  { id: 'auto', name: 'Auto', x: 20, y: 20, width: 80, height: 40 },
  { id: 'paint', name: 'Paint', x: 105, y: 20, width: 70, height: 40 },
  { id: 'tools-hardware', name: 'Tools & Hardware', x: 185, y: 20, width: 95, height: 40 },
  { id: 'home-office', name: 'Home Office', x: 290, y: 20, width: 100, height: 40 },

  { id: 'auto-care-center', name: 'Auto Care Center', x: 20, y: 75, width: 155, height: 40 },

  // Mid Left Section Block - Adjusted for slightly more gap here
  { id: 'sporting-goods', name: 'Sports & Outdoors', x: 20, y: 145, width: 155, height: 70 },
  { id: 'toys-games', name: 'Toys & Games', x: 20, y: 220, width: 155, height: 65 },

  { id: 'storage-laundry', name: 'Storage & Laundry', x: 185, y: 145, width: 80, height: 60 },
  { id: 'furniture', name: 'Furniture', x: 185, y: 215, width: 80, height: 60 }, // Back to slightly more gap
  { id: 'home', name: 'Home', x: 185, y: 285, width: 80, height: 60 }, // Back to slightly more gap
  { id: 'bedding', name: 'Bedding', x: 185, y: 355, width: 80, height: 60 }, // Back to slightly more gap
  { id: 'bath', name: 'Bath', x: 185, y: 425, width: 80, height: 60 }, // Back to slightly more gap

  { id: 'arts-crafts', name: 'Arts & Crafts', x: 275, y: 145, width: 100, height: 60 },
  { id: 'seasonal', name: 'Seasonal', x: 275, y: 210, width: 100, height: 60 },
  { id: 'kitchen-dining', name: 'Kitchen & Dining', x: 275, y: 275, width: 100, height: 70 },

  // Apparel Sections - SLIGHTLY LOOSENED as requested
  { id: 'boys', name: 'Boys', x: 390, y: 145, width: 90, height: 70 }, // Adjusted x for more gap
  { id: 'girls', name: 'Girls', x: 490, y: 145, width: 90, height: 70 }, // Adjusted x for more gap
  { id: 'baby', name: 'Baby', x: 590, y: 145, width: 90, height: 70 }, // Adjusted x for more gap

  { id: 'shoes', name: 'Shoes', x: 390, y: 225, width: 90, height: 70 }, // Adjusted y for more gap
  { id: 'mens', name: 'Mens', x: 490, y: 225, width: 90, height: 70 }, // Adjusted x, y for more gap
  { id: 'sleepwear-panties', name: 'Sleepwear & Panties', x: 590, y: 225, width: 90, height: 70 }, // Adjusted x, y for more gap

  { id: 'jewelry-accessories', name: 'Jewelry & Accessories', x: 390, y: 305, width: 90, height: 70 }, // Adjusted y for more gap
  { id: 'ladies', name: 'Ladies', x: 490, y: 305, width: 90, height: 70 }, // Adjusted x, y for more gap

  // Personal Care & Beauty, Pharmacy - No change
  { id: 'personal-care-beauty', name: 'Personal Care & Beauty', x: 300, y: 400, width: 180, height: 70 },
  { id: 'pharmacy', name: 'Pharmacy', x: 485, y: 400, width: 120, height: 70 },

  // Right Side Section Block - No changes, keeping original gaps
  { id: 'electronics', name: 'Electronics', x: 400, y: 20, width: 140, height: 70 },
  { id: 'pet-care', name: 'Pet Care', x: 550, y: 20, width: 90, height: 70 },
  { id: 'paper-cleaning', name: 'Paper & Cleaning', x: 650, y: 20, width: 90, height: 70 },

  { id: 'dairy', name: 'Dairy', x: 750, y: 20, width: 120, height: 70 },
  { id: 'adult-beverages', name: 'Adult Beverages', x: 750, y: 100, width: 120, height: 70 },
  { id: 'deli', name: 'Deli', x: 880, y: 100, width: 90, height: 70 },

  { id: 'snacks', name: 'Snacks', x: 750, y: 180, width: 120, height: 70 },
  { id: 'candy', name: 'Candy', x: 880, y: 180, width: 90, height: 70 },

  { id: 'grocery', name: 'Grocery', x: 750, y: 260, width: 210, height: 120 },
  { id: 'meat', name: 'Meat', x: 750, y: 390, width: 210, height: 60 },
  { id: 'frozen', name: 'Frozen', x: 750, y: 460, width: 210, height: 60 },
  { id: 'bakery', name: 'Bakery', x: 750, y: 530, width: 100, height: 60 },
  { id: 'fresh-produce', name: 'Fresh Produce', x: 750, y: 600, width: 210, height: 100 },

  // Bottom Left Area: Garden, Health & Wellness, Cosmetics - No change
  { id: 'garden-main', name: 'Garden', x: 20, y: 290, width: 155, height: 200 },
  { id: 'health-wellness-bottom', name: 'Health & Wellness', x: 20, y: 500, width: 155, height: 60 },
  { id: 'cosmetics-bottom', name: 'Cosmetics', x: 20, y: 565, width: 155, height: 40 },

  // Checkout (central, wider area) - No change
  { id: 'checkout-main', name: 'Checkout', x: 300, y: 500, width: 430, height: 80 },
];
