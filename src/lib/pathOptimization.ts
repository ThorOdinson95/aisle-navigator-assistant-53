
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

// Precise walkway grid based on actual store layout
const WALKWAY_INTERSECTIONS = [
  // Main horizontal walkway intersections
  { x: 180, y: 120 }, { x: 290, y: 120 }, { x: 385, y: 120 }, { x: 585, y: 120 }, { x: 745, y: 120 },
  { x: 180, y: 350 }, { x: 290, y: 350 }, { x: 385, y: 350 }, { x: 585, y: 350 }, { x: 745, y: 350 },
  { x: 180, y: 500 }, { x: 290, y: 500 }, { x: 385, y: 500 }, { x: 585, y: 500 }, { x: 745, y: 500 },
  { x: 180, y: 640 }, { x: 290, y: 640 }, { x: 385, y: 640 }, { x: 585, y: 640 }, { x: 745, y: 640 },
  
  // Additional entrance/exit points
  { x: 145, y: 640 }, // Entrance
  { x: 220, y: 640 }, // Exit
  { x: 600, y: 640 }, // Exit  
  { x: 680, y: 640 }, // Entrance
  
  // Checkout area connections
  { x: 515, y: 540 }, // Checkout center
];

const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Find the nearest walkway intersection to a section
const getNearestWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  let nearestPoint = WALKWAY_INTERSECTIONS[0];
  let minDistance = Math.sqrt(Math.pow(centerX - nearestPoint.x, 2) + Math.pow(centerY - nearestPoint.y, 2));
  
  for (const intersection of WALKWAY_INTERSECTIONS) {
    const distance = Math.sqrt(Math.pow(centerX - intersection.x, 2) + Math.pow(centerY - intersection.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = intersection;
    }
  }
  
  return {
    x: nearestPoint.x,
    y: nearestPoint.y,
    name: section.name,
    type: 'section' as const
  };
};

// Create walkway path between two points using only intersections
const createWalkwayRoute = (from: PathPoint, to: PathPoint): PathPoint[] => {
  // If points are on same horizontal or vertical line, go direct
  if (from.x === to.x || from.y === to.y) {
    return [from, to];
  }
  
  // Find intermediate walkway intersection point
  // Try both L-shaped options and pick the one with valid intersections
  const option1 = WALKWAY_INTERSECTIONS.find(p => p.x === from.x && p.y === to.y);
  const option2 = WALKWAY_INTERSECTIONS.find(p => p.x === to.x && p.y === from.y);
  
  if (option1) {
    const intermediate: PathPoint = {
      x: option1.x,
      y: option1.y,
      name: 'Turn',
      type: 'section' as const
    };
    return [from, intermediate, to];
  } else if (option2) {
    const intermediate: PathPoint = {
      x: option2.x,
      y: option2.y,
      name: 'Turn',
      type: 'section' as const
    };
    return [from, intermediate, to];
  }
  
  // Fallback: use closest intersection as intermediate point
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  let nearestIntersection = WALKWAY_INTERSECTIONS[0];
  let minDistance = Math.sqrt(Math.pow(midX - nearestIntersection.x, 2) + Math.pow(midY - nearestIntersection.y, 2));
  
  for (const intersection of WALKWAY_INTERSECTIONS) {
    const distance = Math.sqrt(Math.pow(midX - intersection.x, 2) + Math.pow(midY - intersection.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      nearestIntersection = intersection;
    }
  }
  
  const intermediate: PathPoint = {
    x: nearestIntersection.x,
    y: nearestIntersection.y,
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

  // Enhanced section to department mapping
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

  // Find ALL sections that have unchecked items
  const sectionsToVisit = storeSections.filter(section => {
    const departmentName = sectionToDepartment[section.id];
    return departmentName && uncheckedDepartments.has(departmentName);
  });

  console.log('Sections to visit:', sectionsToVisit.map(s => s.name));
  console.log('Unchecked departments:', Array.from(uncheckedDepartments));

  // Convert sections to walkway points
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

  // Build complete path with walkway routing
  const fullPath: PathPoint[] = [ENTRANCE_POSITION];
  
  for (let i = 0; i < orderedPoints.length; i++) {
    const lastPoint = fullPath[fullPath.length - 1];
    const nextPoint = orderedPoints[i];
    const walkwaySegment = createWalkwayRoute(lastPoint, nextPoint);
    
    // Add all points except the first (to avoid duplication)
    fullPath.push(...walkwaySegment.slice(1));
  }
  
  // Add path to checkout
  const lastPoint = fullPath[fullPath.length - 1];
  const checkoutPath = createWalkwayRoute(lastPoint, CHECKOUT_POSITION);
  fullPath.push(...checkoutPath.slice(1));

  // Remove duplicate consecutive points
  const cleanPath: PathPoint[] = [fullPath[0]];
  for (let i = 1; i < fullPath.length; i++) {
    const current = fullPath[i];
    const previous = cleanPath[cleanPath.length - 1];
    
    if (current.x !== previous.x || current.y !== previous.y) {  
      cleanPath.push(current);
    }
  }

  console.log('Final path points:', cleanPath.map(p => `${p.name} (${p.x}, ${p.y})`));

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
