
import { storeSections } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';

export interface PathPoint {
  x: number;
  y: number;
  name: string;
  type: 'entrance' | 'section' | 'checkout';
}

// Fixed positions for entrance and checkout
const ENTRANCE_POSITION: PathPoint = { x: 145, y: 640, name: 'Entrance', type: 'entrance' };
const CHECKOUT_POSITION: PathPoint = { x: 515, y: 540, name: 'Checkout', type: 'checkout' };

// More comprehensive walkway grid based on actual store layout
const WALKWAY_GRID = [
  // Bottom walkway (y=640)
  { x: 50, y: 640 }, { x: 145, y: 640 }, { x: 180, y: 640 }, { x: 220, y: 640 }, 
  { x: 290, y: 640 }, { x: 385, y: 640 }, { x: 515, y: 640 }, { x: 585, y: 640 }, 
  { x: 600, y: 640 }, { x: 680, y: 640 }, { x: 745, y: 640 }, { x: 850, y: 640 },
  
  // Mid-low walkway (y=500)
  { x: 180, y: 500 }, { x: 290, y: 500 }, { x: 385, y: 500 }, { x: 515, y: 500 }, 
  { x: 585, y: 500 }, { x: 745, y: 500 },
  
  // Mid walkway (y=350) 
  { x: 180, y: 350 }, { x: 290, y: 350 }, { x: 385, y: 350 }, { x: 585, y: 350 }, { x: 745, y: 350 },
  
  // Upper walkway (y=120)
  { x: 180, y: 120 }, { x: 290, y: 120 }, { x: 385, y: 120 }, { x: 585, y: 120 }, { x: 745, y: 120 },
  
  // Vertical connectors
  { x: 180, y: 50 }, { x: 180, y: 200 }, { x: 180, y: 280 }, { x: 180, y: 420 },
  { x: 290, y: 180 }, { x: 290, y: 280 }, { x: 290, y: 420 },
  { x: 385, y: 50 }, { x: 385, y: 200 }, { x: 385, y: 280 },
  { x: 585, y: 50 }, { x: 585, y: 200 }, { x: 585, y: 280 },
  { x: 745, y: 50 }, { x: 745, y: 200 }, { x: 745, y: 280 }, { x: 745, y: 420 }, { x: 745, y: 550 },
];

// Complete section to department mapping - including all departments
const SECTION_TO_DEPARTMENT: { [key: string]: string } = {
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
  'auto': 'Auto',
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
  'sleepwear-panties': 'Sleepwear & Panties',
  'furniture': 'Furniture',
  'bedding': 'Bedding',
  'bath': 'Bath',
  'storage-laundry': 'Storage & Laundry',
  'paint': 'Paint',
  'home-office': 'Home Office',
  'garden-main': 'Garden',
  'health-wellness-bottom': 'Health & Wellness',
  'cosmetics-bottom': 'Cosmetics'
};

const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Find the nearest walkway point to a section's center
const getNearestWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  let nearestPoint = WALKWAY_GRID[0];
  let minDistance = Math.sqrt(Math.pow(centerX - nearestPoint.x, 2) + Math.pow(centerY - nearestPoint.y, 2));
  
  for (const gridPoint of WALKWAY_GRID) {
    const distance = Math.sqrt(Math.pow(centerX - gridPoint.x, 2) + Math.pow(centerY - gridPoint.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = gridPoint;
    }
  }
  
  return {
    x: nearestPoint.x,
    y: nearestPoint.y,
    name: section.name,
    type: 'section' as const
  };
};

// Create a path between two walkway points using only walkway grid
const createWalkwayPath = (from: PathPoint, to: PathPoint): PathPoint[] => {
  if (from.x === to.x && from.y === to.y) {
    return [from];
  }
  
  // Direct path if on same line
  if (from.x === to.x || from.y === to.y) {
    return [from, to];
  }
  
  // L-shaped path - try both options and pick the one with valid grid points
  const corner1 = WALKWAY_GRID.find(p => p.x === from.x && p.y === to.y);
  const corner2 = WALKWAY_GRID.find(p => p.x === to.x && p.y === from.y);
  
  if (corner1) {
    const intermediate: PathPoint = {
      x: corner1.x,
      y: corner1.y,
      name: 'Turn',
      type: 'section' as const
    };
    return [from, intermediate, to];
  } else if (corner2) {
    const intermediate: PathPoint = {
      x: corner2.x,
      y: corner2.y,
      name: 'Turn',
      type: 'section' as const
    };
    return [from, intermediate, to];
  }
  
  // Fallback: find nearest intermediate point
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  let nearestGrid = WALKWAY_GRID[0];
  let minDistance = Math.sqrt(Math.pow(midX - nearestGrid.x, 2) + Math.pow(midY - nearestGrid.y, 2));
  
  for (const gridPoint of WALKWAY_GRID) {
    const distance = Math.sqrt(Math.pow(midX - gridPoint.x, 2) + Math.pow(midY - gridPoint.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      nearestGrid = gridPoint;
    }
  }
  
  const intermediate: PathPoint = {
    x: nearestGrid.x,
    y: nearestGrid.y,
    name: 'Turn',
    type: 'section' as const
  };
  
  return [from, intermediate, to];
};

export const calculateOptimalPath = (items: ShoppingItem[]): PathPoint[] => {
  // Get unchecked items grouped by department
  const uncheckedDepartments = new Set(
    items.filter(item => !item.checked).map(item => item.department)
  );

  if (uncheckedDepartments.size === 0) {
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  console.log('Unchecked departments:', Array.from(uncheckedDepartments));

  // Find ALL sections that match unchecked departments
  const sectionsToVisit = storeSections.filter(section => {
    const departmentName = SECTION_TO_DEPARTMENT[section.id];
    const shouldVisit = departmentName && uncheckedDepartments.has(departmentName);
    if (shouldVisit) {
      console.log(`Including section: ${section.name} for department: ${departmentName}`);
    }
    return shouldVisit;
  });

  console.log('Sections to visit:', sectionsToVisit.map(s => s.name));

  if (sectionsToVisit.length === 0) {
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  // Convert sections to nearest walkway points
  const sectionPoints = sectionsToVisit.map(section => getNearestWalkwayPoint(section));

  // Optimize order using nearest neighbor algorithm
  const orderedPoints: PathPoint[] = [];
  let remainingPoints = [...sectionPoints];
  let currentPoint = ENTRANCE_POSITION;

  while (remainingPoints.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(currentPoint, remainingPoints[0]);

    for (let i = 1; i < remainingPoints.length; i++) {
      const distance = calculateDistance(currentPoint, remainingPoints[i]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    const nearest = remainingPoints[nearestIndex];
    orderedPoints.push(nearest);
    currentPoint = nearest;
    remainingPoints.splice(nearestIndex, 1);
  }

  // Build complete walkway path
  const fullPath: PathPoint[] = [ENTRANCE_POSITION];
  
  for (let i = 0; i < orderedPoints.length; i++) {
    const lastPoint = fullPath[fullPath.length - 1];
    const nextPoint = orderedPoints[i];
    const pathSegment = createWalkwayPath(lastPoint, nextPoint);
    
    // Add all points except the first (to avoid duplication)
    fullPath.push(...pathSegment.slice(1));
  }
  
  // Add path to checkout
  const lastPoint = fullPath[fullPath.length - 1];
  const checkoutPath = createWalkwayPath(lastPoint, CHECKOUT_POSITION);
  fullPath.push(...checkoutPath.slice(1));

  // Remove consecutive duplicate points
  const cleanPath: PathPoint[] = [fullPath[0]];
  for (let i = 1; i < fullPath.length; i++) {
    const current = fullPath[i];
    const previous = cleanPath[cleanPath.length - 1];
    
    if (current.x !== previous.x || current.y !== previous.y) {  
      cleanPath.push(current);
    }
  }

  console.log('Final optimized path:', cleanPath.map(p => `${p.name} (${p.x}, ${p.y})`));

  return cleanPath;
};

export const generateSVGPath = (points: PathPoint[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  
  return path;
};
