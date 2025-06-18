
import { storeSections } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';

export interface PathPoint {
  x: number;
  y: number;
  name: string;
  type: 'entrance' | 'section' | 'checkout';
}

// Fixed positions for entrance and checkout
const ENTRANCE_POSITION = { x: 145, y: 680, name: 'Entrance', type: 'entrance' as const };
const CHECKOUT_POSITION = { x: 515, y: 540, name: 'Checkout', type: 'checkout' as const };

export const calculateOptimalPath = (items: ShoppingItem[]): PathPoint[] => {
  // Get unchecked items grouped by department
  const uncheckedDepartments = new Set(
    items.filter(item => !item.checked).map(item => item.department)
  );

  if (uncheckedDepartments.size === 0) {
    // If no items to collect, just show entrance to checkout
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  // Find sections that correspond to departments with unchecked items
  const sectionsToVisit = storeSections.filter(section => {
    // Map section names to department names
    const sectionToDepartment: { [key: string]: string } = {
      'dairy': 'Dairy',
      'deli': 'Deli',
      'fresh-produce': 'Fresh Produce',
      'grocery': 'Grocery',
      'paper-cleaning': 'Paper & Cleaning',
      'meat': 'Meat',
      'frozen': 'Frozen',
      'bakery': 'Bakery',
      'snacks': 'Snacks',
      'candy': 'Candy',
      'adult-beverages': 'Adult Beverages',
      'personal-care-beauty': 'Personal Care & Beauty',
      'pharmacy': 'Pharmacy',
      'pet-care': 'Pet Care',
      'electronics': 'Electronics',
      'home': 'Home',
      'kitchen-dining': 'Kitchen & Dining',
      'auto-care-center': 'Auto Care Center',
      'auto': 'Auto Accessories',
      'tools-hardware': 'Tools & Hardware',
      'sporting-goods': 'Sports & Outdoors',
      'toys-games': 'Toys & Games',
      'arts-crafts': 'Arts & Crafts',
      'seasonal': 'Seasonal',
      'boys': 'Boys',
      'girls': 'Girls',
      'baby': 'Baby',
      'shoes': 'Shoes',
      'mens': 'Mens',
      'ladies': 'Ladies',
      'jewelry-accessories': 'Jewelry & Accessories',
      'sleepwear-panties': 'Sleepwear & Panties'
    };

    const departmentName = sectionToDepartment[section.id];
    return departmentName && uncheckedDepartments.has(departmentName);
  });

  // Convert sections to path points (using center of each section)
  const sectionPoints: PathPoint[] = sectionsToVisit.map(section => ({
    x: section.x + section.width / 2,
    y: section.y + section.height / 2,
    name: section.name,
    type: 'section' as const
  }));

  // Simple optimization: sort by distance from entrance
  const sortedSections = sectionPoints.sort((a, b) => {
    const distanceA = Math.sqrt(Math.pow(a.x - ENTRANCE_POSITION.x, 2) + Math.pow(a.y - ENTRANCE_POSITION.y, 2));
    const distanceB = Math.sqrt(Math.pow(b.x - ENTRANCE_POSITION.x, 2) + Math.pow(b.y - ENTRANCE_POSITION.y, 2));
    return distanceA - distanceB;
  });

  return [ENTRANCE_POSITION, ...sortedSections, CHECKOUT_POSITION];
};

export const generateSVGPath = (points: PathPoint[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  
  return path;
};
