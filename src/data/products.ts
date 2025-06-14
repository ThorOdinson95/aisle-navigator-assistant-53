
import type { ShoppingItem } from '@/pages/Index';

export type ProductSuggestion = Omit<ShoppingItem, 'id' | 'checked'>;

export const productSuggestions: ProductSuggestion[] = [
  { name: 'Great Value Milk, 1 Gallon', department: 'Dairy' },
  { name: 'Large Cage-Free Eggs, 12 ct', department: 'Dairy' },
  { name: 'Shredded Mozzarella Cheese, 16 oz', department: 'Dairy' },
  { name: 'Marketside Rotisserie Chicken', department: 'Deli' },
  { name: 'Black Forest Ham, Sliced, 1 lb', department: 'Deli' },
  { name: 'Freshness Guaranteed Bananas, 2 lbs', department: 'Fresh Produce' },
  { name: 'Avocados, Bag of 4', department: 'Fresh Produce' },
  { name: 'Organic Spring Mix Salad, 5 oz', department: 'Fresh Produce' },
  { name: 'Great Value Creamy Peanut Butter', department: 'Grocery' },
  { name: 'Quaker Instant Oatmeal, Variety Pack', department: 'Grocery' },
  { name: 'Coca-Cola, 12 pack', department: 'Grocery' },
  { name: "Lay's Classic Potato Chips", department: 'Snacks' },
  { name: 'Oreo Cookies, Family Size', department: 'Snacks' },
  { name: "Member's Mark Paper Towels, 12 rolls", department: 'Paper & Cleaning' },
  { name: 'Tide Laundry Detergent', department: 'Paper & Cleaning' },
  { name: 'Crest 3D White Toothpaste', department: 'Personal Care & Beauty' },
  { name: 'Dove Body Wash', department: 'Personal Care & Beauty' },
  { name: 'Purina ONE Dry Dog Food', department: 'Pet Care' },
  { name: 'T-fal 20-piece Cookware Set', department: 'Kitchen & Dining' },
  { name: 'Samsung 55" 4K Smart TV', department: 'Electronics' },
  { name: 'LEGO Star Wars Set', department: 'Toys & Games' },
  { name: 'Paperback Bestseller', department: 'Books' },
  { name: 'Wrench Set, 20-piece', department: 'Tools & Hardware' },
];
