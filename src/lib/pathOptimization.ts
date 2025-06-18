
import { storeSections } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';

export interface PathPoint {
  x: number;
  y: number;
  name: string;
  type: 'entrance' | 'section' | 'checkout' | 'aisle';
}

// Fixed positions for entrance and checkout
const ENTRANCE_POSITION: PathPoint = { x: 145, y: 680, name: 'Entrance', type: 'entrance' };
const CHECKOUT_POSITION: PathPoint = { x: 515, y:540, name: 'Checkout', type: 'checkout' };

// Define main aisle waypoints for navigation
const AISLE_WAYPOINTS: PathPoint[] = [
  // Main horizontal aisles
  { x: 400, y: 120, name: 'Main Aisle North', type: 'aisle' },
  { x: 400, y: 200, name: 'Central Aisle', type: 'aisle' },
  { x: 400, y: 350, name: 'Main Aisle South', type: 'aisle' },
  { x: 400, y: 480, name: 'Checkout Approach', type: 'aisle' },
  
  // Vertical connecting aisles
  { x: 200, y: 350, name: 'West Connector', type: 'aisle' },
  { x: 600, y: 350, name: 'East Connector', type: 'aisle' },
  { x: 700, y: 350, name: 'Grocery Aisle', type: 'aisle' },
  
  // Entry/exit connectors
  { x: 300, y: 600, name: 'Entry Connector', type: 'aisle' },
  { x: 500, y: 600, name: 'Exit Connector', type: 'aisle' },
];

const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

const findNearestAisle = (point: PathPoint): PathPoint => {
  return AISLE_WAYPOINTS.reduce((nearest, waypoint) => {
    const distanceToWaypoint = calculateDistance(point, waypoint);
    const distanceToNearest = calculateDistance(point, nearest);
    return distanceToWaypoint < distanceToNearest ? waypoint : nearest;
  }, AISLE_WAYPOINTS[0]);
};

const generateAislePath = (from: PathPoint, to: PathPoint): PathPoint[] => {
  const path: PathPoint[] = [];
  
  // If points are close enough, direct path
  if (calculateDistance(from, to) < 100) {
    return [from, to];
  }
  
  // Find nearest aisles to both points
  const fromAisle = findNearestAisle(from);
  const toAisle = findNearestAisle(to);
  
  path.push(from);
  
  // Add intermediate waypoints if needed
  if (fromAisle !== toAisle) {
    // Add from aisle if not already there
    if (calculateDistance(from, fromAisle) > 20) {
      path.push(fromAisle);
    }
    
    // Navigate through main aisles if needed
    const needsMainAisle = Math.abs(fromAisle.y - toAisle.y) > 100 || Math.abs(fromAisle.x - toAisle.x) > 200;
    
    if (needsMainAisle) {
      // Find appropriate main aisle waypoint
      const centralY = (fromAisle.y + toAisle.y) / 2;
      const mainAisle = AISLE_WAYPOINTS.find(w => 
        w.name.includes('Central') || 
        (Math.abs(w.y - centralY) < 50 && w.name.includes('Aisle'))
      ) || AISLE_WAYPOINTS[1]; // Default to central aisle
      
      if (fromAisle !== mainAisle && toAisle !== mainAisle) {
        path.push(mainAisle);
      }
    }
    
    // Add to aisle if different and not too close to destination
    if (calculateDistance(toAisle, to) > 20) {
      path.push(toAisle);
    }
  } else {
    // Same aisle area, add waypoint if far enough
    if (calculateDistance(from, fromAisle) > 20) {
      path.push(fromAisle);
    }
  }
  
  path.push(to);
  return path;
};

export const calculateOptimalPath = (items: ShoppingItem[]): PathPoint[] => {
  // Get unchecked items grouped by department
  const uncheckedDepartments = new Set(
    items.filter(item => !item.checked).map(item => item.department)
  );

  if (uncheckedDepartments.size === 0) {
    // If no items to collect, just show entrance to checkout through aisles
    return generateAislePath(ENTRANCE_POSITION, CHECKOUT_POSITION);
  }

  // Find sections that correspond to departments with unchecked items
  const sectionsToVisit = storeSections.filter(section => {
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
    type: 'section'
  }));

  // Optimize order using nearest neighbor algorithm
  const orderedSections: PathPoint[] = [];
  let remainingSections = [...sectionPoints];
  let currentPosition: PathPoint = ENTRANCE_POSITION;

  while (remainingSections.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(currentPosition, remainingSections[0]);

    for (let i = 1; i < remainingSections.length; i++) {
      const distance = calculateDistance(currentPosition, remainingSections[i]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    const nearestSection = remainingSections[nearestIndex];
    orderedSections.push(nearestSection);
    currentPosition = nearestSection;
    remainingSections.splice(nearestIndex, 1);
  }

  // Generate complete path with aisle navigation
  const completePath: PathPoint[] = [];
  let currentPoint: PathPoint = ENTRANCE_POSITION;

  for (const section of orderedSections) {
    const segmentPath = generateAislePath(currentPoint, section);
    // Add all points except the first one (to avoid duplicates)
    if (completePath.length === 0) {
      completePath.push(...segmentPath);
    } else {
      completePath.push(...segmentPath.slice(1));
    }
    currentPoint = section;
  }

  // Add path to checkout
  const checkoutPath = generateAislePath(currentPoint, CHECKOUT_POSITION);
  completePath.push(...checkoutPath.slice(1));

  return completePath;
};

export const generateSVGPath = (points: PathPoint[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    // Use smooth curves for aisle transitions
    if (i < points.length - 1 && points[i].type === 'aisle') {
      const prev = points[i - 1];
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate control points for smooth curves
      const cp1x = prev.x + (current.x - prev.x) * 0.7;
      const cp1y = prev.y + (current.y - prev.y) * 0.7;
      const cp2x = current.x + (next.x - current.x) * 0.3;
      const cp2y = current.y + (next.y - current.y) * 0.3;
      
      path += ` Q ${cp1x} ${cp1y} ${current.x} ${current.y}`;
    } else {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
  }
  
  return path;
};
