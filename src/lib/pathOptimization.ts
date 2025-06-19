import { storeSections } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';

export interface PathPoint {
  x: number;
  y: number;
  name: string;
  type: 'entrance' | 'section' | 'checkout';
}

// Fixed positions for entrance and checkout on walkways
const ENTRANCE_POSITION: PathPoint = { x: 145, y: 640, name: 'Entrance', type: 'entrance' };
const CHECKOUT_POSITION: PathPoint = { x: 515, y: 540, name: 'Checkout', type: 'checkout' };

// Main walkway coordinates
const WALKWAY_POINTS = {
  MAIN_HORIZONTAL_TOP: 120,
  MAIN_HORIZONTAL_MID: 350,
  MAIN_HORIZONTAL_BOTTOM: 500,
  ENTRANCE_HORIZONTAL: 640,
  VERTICAL_LEFT: 180,
  VERTICAL_MID_LEFT: 290,
  VERTICAL_MID_RIGHT: 385,
  VERTICAL_FAR_RIGHT: 585,
  VERTICAL_RIGHT: 745
};

const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Convert section center to nearest walkway point
const getSectionWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  // Determine the closest walkway intersection
  let walkwayX = centerX;
  let walkwayY = centerY;
  
  // Snap to nearest vertical walkway
  const verticals = [
    WALKWAY_POINTS.VERTICAL_LEFT,
    WALKWAY_POINTS.VERTICAL_MID_LEFT,
    WALKWAY_POINTS.VERTICAL_MID_RIGHT,
    WALKWAY_POINTS.VERTICAL_FAR_RIGHT,
    WALKWAY_POINTS.VERTICAL_RIGHT
  ];
  
  walkwayX = verticals.reduce((closest, current) => 
    Math.abs(current - centerX) < Math.abs(closest - centerX) ? current : closest
  );
  
  // Snap to nearest horizontal walkway
  const horizontals = [
    WALKWAY_POINTS.MAIN_HORIZONTAL_TOP,
    WALKWAY_POINTS.MAIN_HORIZONTAL_MID,
    WALKWAY_POINTS.MAIN_HORIZONTAL_BOTTOM
  ];
  
  walkwayY = horizontals.reduce((closest, current) => 
    Math.abs(current - centerY) < Math.abs(closest - centerY) ? current : closest
  );
  
  return {
    x: walkwayX,
    y: walkwayY,
    name: section.name,
    type: 'section' as const
  };
};

// Create a path that follows walkways using intermediate waypoints
const createWalkwayPath = (from: PathPoint, to: PathPoint): PathPoint[] => {
  const path: PathPoint[] = [];
  
  // If points are on the same walkway, go direct
  if (from.x === to.x || from.y === to.y) {
    return [from, to];
  }
  
  // Otherwise, create L-shaped path via intersection
  const intermediatePoint: PathPoint = {
    x: from.x,
    y: to.y,
    name: `Junction`,
    type: 'section' as const
  };
  
  return [from, intermediatePoint, to];
};

export const calculateOptimalPath = (items: ShoppingItem[]): PathPoint[] => {
  // Get unchecked items grouped by department
  const uncheckedDepartments = new Set(
    items.filter(item => !item.checked).map(item => item.department)
  );

  if (uncheckedDepartments.size === 0) {
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
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

  // Convert sections to walkway points
  const sectionPoints = sectionsToVisit.map(section => getSectionWalkwayPoint(section));

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
    const walkwaySegment = createWalkwayPath(lastPoint, nextPoint);
    
    // Add all points except the first (to avoid duplication)
    fullPath.push(...walkwaySegment.slice(1));
  }
  
  // Add path to checkout
  const lastPoint = fullPath[fullPath.length - 1];
  const checkoutPath = createWalkwayPath(lastPoint, CHECKOUT_POSITION);
  fullPath.push(...checkoutPath.slice(1));

  return fullPath;
};

export const generateSVGPath = (points: PathPoint[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  
  return path;
};
