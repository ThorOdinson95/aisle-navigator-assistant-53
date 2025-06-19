
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

// Define the walkway grid system based on the store layout
const WALKWAY_GRID = {
  // Horizontal walkways (y-coordinates)
  HORIZONTAL: [120, 350, 500, 640],
  // Vertical walkways (x-coordinates)  
  VERTICAL: [180, 290, 385, 585, 745]
};

const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Get the nearest walkway intersection point for a section
const getSectionWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  // Find closest vertical walkway
  let nearestVertical = WALKWAY_GRID.VERTICAL[0];
  let minVerticalDistance = Math.abs(centerX - nearestVertical);
  
  for (const vertical of WALKWAY_GRID.VERTICAL) {
    const distance = Math.abs(centerX - vertical);
    if (distance < minVerticalDistance) {
      minVerticalDistance = distance;
      nearestVertical = vertical;
    }
  }
  
  // Find closest horizontal walkway
  let nearestHorizontal = WALKWAY_GRID.HORIZONTAL[0];
  let minHorizontalDistance = Math.abs(centerY - nearestHorizontal);
  
  for (const horizontal of WALKWAY_GRID.HORIZONTAL) {
    const distance = Math.abs(centerY - horizontal);
    if (distance < minHorizontalDistance) {
      minHorizontalDistance = distance;
      nearestHorizontal = horizontal;
    }
  }
  
  return {
    x: nearestVertical,
    y: nearestHorizontal,
    name: section.name,
    type: 'section' as const
  };
};

// Create path between two points using only walkway intersections
const createWalkwayPath = (from: PathPoint, to: PathPoint): PathPoint[] => {
  // If points are already on the same walkway line, go direct
  if (from.x === to.x || from.y === to.y) {
    return [from, to];
  }
  
  // Create L-shaped path via intersection point
  // Choose the intermediate point that creates the shortest total path
  const option1: PathPoint = {
    x: from.x,
    y: to.y,
    name: `Turn Point`,
    type: 'section' as const
  };
  
  const option2: PathPoint = {
    x: to.x,
    y: from.y,
    name: `Turn Point`,
    type: 'section' as const
  };
  
  // Calculate distances for both options
  const distance1 = calculateDistance(from, option1) + calculateDistance(option1, to);
  const distance2 = calculateDistance(from, option2) + calculateDistance(option2, to);
  
  // Choose the shorter path
  if (distance1 <= distance2) {
    return [from, option1, to];
  } else {
    return [from, option2, to];
  }
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

  // Remove duplicate consecutive points to clean up the path
  const cleanPath: PathPoint[] = [fullPath[0]];
  for (let i = 1; i < fullPath.length; i++) {
    const current = fullPath[i];
    const previous = cleanPath[cleanPath.length - 1];
    
    // Only add point if it's different from the previous one
    if (current.x !== previous.x || current.y !== previous.y) {  
      cleanPath.push(current);
    }
  }

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
