
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
const CHECKOUT_POSITION: PathPoint = { x: 515, y: 540, name: 'Checkout', type: 'checkout' };

// Main aisle network - represents actual walkable paths in the store
const MAIN_AISLES: PathPoint[] = [
  // Main entrance corridor
  { x: 145, y: 620, name: 'Entry Corridor', type: 'aisle' },
  { x: 200, y: 580, name: 'Main Entry', type: 'aisle' },
  
  // Primary horizontal aisles (main traffic flow)
  { x: 300, y: 520, name: 'South Main Aisle', type: 'aisle' },
  { x: 400, y: 520, name: 'Central South', type: 'aisle' },
  { x: 500, y: 520, name: 'Checkout Area', type: 'aisle' },
  
  { x: 300, y: 380, name: 'Mid South Aisle', type: 'aisle' },
  { x: 400, y: 380, name: 'Central Mid', type: 'aisle' },
  { x: 500, y: 380, name: 'East Mid', type: 'aisle' },
  { x: 600, y: 380, name: 'Grocery Entry', type: 'aisle' },
  
  { x: 300, y: 260, name: 'Mid North Aisle', type: 'aisle' },
  { x: 400, y: 260, name: 'Central North', type: 'aisle' },
  { x: 500, y: 260, name: 'East North', type: 'aisle' },
  { x: 600, y: 260, name: 'Grocery Mid', type: 'aisle' },
  
  { x: 300, y: 120, name: 'North Main Aisle', type: 'aisle' },
  { x: 400, y: 120, name: 'Top Central', type: 'aisle' },
  { x: 500, y: 120, name: 'Top East', type: 'aisle' },
  { x: 600, y: 120, name: 'Grocery Top', type: 'aisle' },
  
  // Vertical connecting aisles
  { x: 180, y: 400, name: 'West Connector', type: 'aisle' },
  { x: 180, y: 300, name: 'West Mid', type: 'aisle' },
  { x: 180, y: 200, name: 'West North', type: 'aisle' },
  
  { x: 720, y: 400, name: 'Grocery Main', type: 'aisle' },
  { x: 720, y: 300, name: 'Grocery North', type: 'aisle' },
  { x: 720, y: 200, name: 'Grocery Far North', type: 'aisle' },
];

const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Find the best aisle point to access a section
const findBestAisleAccess = (sectionPoint: PathPoint): PathPoint => {
  let bestAisle = MAIN_AISLES[0];
  let minDistance = calculateDistance(sectionPoint, bestAisle);
  
  for (const aisle of MAIN_AISLES) {
    const distance = calculateDistance(sectionPoint, aisle);
    if (distance < minDistance) {
      minDistance = distance;
      bestAisle = aisle;
    }
  }
  
  return bestAisle;
};

// Generate smooth path between two aisle points
const generateAislePath = (from: PathPoint, to: PathPoint): PathPoint[] => {
  const path: PathPoint[] = [from];
  
  // If points are close, direct connection
  if (calculateDistance(from, to) < 80) {
    path.push(to);
    return path;
  }
  
  // Find intermediate waypoints for smooth navigation
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);
  
  // Prefer L-shaped paths (horizontal then vertical or vice versa)
  if (deltaX > deltaY) {
    // Horizontal movement first
    const midPoint: PathPoint = {
      x: to.x,
      y: from.y,
      name: 'Navigation Waypoint',
      type: 'aisle'
    };
    
    // Only add midpoint if it's significantly different
    if (calculateDistance(from, midPoint) > 40 && calculateDistance(midPoint, to) > 40) {
      path.push(midPoint);
    }
  } else {
    // Vertical movement first
    const midPoint: PathPoint = {
      x: from.x,
      y: to.y,
      name: 'Navigation Waypoint',
      type: 'aisle'
    };
    
    // Only add midpoint if it's significantly different
    if (calculateDistance(from, midPoint) > 40 && calculateDistance(midPoint, to) > 40) {
      path.push(midPoint);
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
    // Simple path from entrance to checkout
    const entranceAisle = findBestAisleAccess(ENTRANCE_POSITION);
    const checkoutAisle = findBestAisleAccess(CHECKOUT_POSITION);
    const aisleToAisle = generateAislePath(entranceAisle, checkoutAisle);
    
    return [
      ENTRANCE_POSITION,
      ...aisleToAisle.slice(1),
      CHECKOUT_POSITION
    ];
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

  // Convert sections to access points (best aisle access for each section)
  const sectionAccessPoints = sectionsToVisit.map(section => {
    const sectionCenter: PathPoint = {
      x: section.x + section.width / 2,
      y: section.y + section.height / 2,
      name: section.name,
      type: 'section'
    };
    
    return {
      section: sectionCenter,
      access: findBestAisleAccess(sectionCenter)
    };
  });

  // Optimize order using nearest neighbor from aisle access points
  const orderedAccess: { section: PathPoint; access: PathPoint }[] = [];
  let remainingAccess = [...sectionAccessPoints];
  let currentAislePoint = findBestAisleAccess(ENTRANCE_POSITION);

  while (remainingAccess.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(currentAislePoint, remainingAccess[0].access);

    for (let i = 1; i < remainingAccess.length; i++) {
      const distance = calculateDistance(currentAislePoint, remainingAccess[i].access);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    const nearest = remainingAccess[nearestIndex];
    orderedAccess.push(nearest);
    currentAislePoint = nearest.access;
    remainingAccess.splice(nearestIndex, 1);
  }

  // Build complete path through aisles
  const completePath: PathPoint[] = [];
  let currentPoint: PathPoint = ENTRANCE_POSITION;

  // Start from entrance to first aisle
  const firstAccess = orderedAccess[0]?.access || findBestAisleAccess(CHECKOUT_POSITION);
  const entranceToFirst = generateAislePath(findBestAisleAccess(ENTRANCE_POSITION), firstAccess);
  completePath.push(currentPoint, ...entranceToFirst.slice(1));
  currentPoint = firstAccess;

  // Visit each section via aisle navigation
  for (const { section, access } of orderedAccess) {
    // Navigate through aisles to section access point
    if (calculateDistance(currentPoint, access) > 50) {
      const aisleSegment = generateAislePath(currentPoint, access);
      completePath.push(...aisleSegment.slice(1));
    }
    
    // Add the actual section point
    completePath.push(section);
    currentPoint = section;
  }

  // Navigate to checkout via aisles
  const lastSection = orderedAccess[orderedAccess.length - 1];
  const checkoutAccess = findBestAisleAccess(CHECKOUT_POSITION);
  const fromLastAccess = lastSection ? lastSection.access : currentPoint;
  
  const toCheckout = generateAislePath(fromLastAccess, checkoutAccess);
  completePath.push(...toCheckout.slice(1));
  completePath.push(CHECKOUT_POSITION);

  return completePath;
};

export const generateSVGPath = (points: PathPoint[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  // Create smooth curves for better visual flow
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    
    if (i < points.length - 1) {
      // Use quadratic curves for smoother transitions
      const next = points[i + 1];
      const controlX = current.x + (next.x - current.x) * 0.3;
      const controlY = current.y + (next.y - current.y) * 0.3;
      
      path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    } else {
      // Final point
      path += ` L ${current.x} ${current.y}`;
    }
  }
  
  return path;
};
