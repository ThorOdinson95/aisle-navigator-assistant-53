
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

// More accurate walkway grid based on actual store layout - avoiding all sections
const WALKWAY_GRID = [
  // Bottom main walkway (y=650) - below all sections
  { x: 50, y: 650 }, { x: 100, y: 650 }, { x: 145, y: 650 }, { x: 200, y: 650 }, 
  { x: 250, y: 650 }, { x: 300, y: 650 }, { x: 350, y: 650 }, { x: 400, y: 650 },
  { x: 450, y: 650 }, { x: 500, y: 650 }, { x: 550, y: 650 }, { x: 600, y: 650 }, 
  { x: 650, y: 650 }, { x: 700, y: 650 }, { x: 750, y: 650 }, { x: 800, y: 650 },
  { x: 850, y: 650 }, { x: 900, y: 650 },
  
  // Mid-low walkway (y=520) - between checkout and sections
  { x: 200, y: 520 }, { x: 250, y: 520 }, { x: 300, y: 520 }, { x: 350, y: 520 },
  { x: 400, y: 520 }, { x: 450, y: 520 }, { x: 500, y: 520 }, { x: 550, y: 520 }, 
  { x: 600, y: 520 }, { x: 650, y: 520 }, { x: 700, y: 520 }, { x: 740, y: 520 },
  
  // Mid walkway (y=380) - between apparel and grocery sections
  { x: 200, y: 380 }, { x: 250, y: 380 }, { x: 300, y: 380 }, { x: 350, y: 380 },
  { x: 400, y: 380 }, { x: 450, y: 380 }, { x: 500, y: 380 }, { x: 550, y: 380 }, 
  { x: 600, y: 380 }, { x: 650, y: 380 }, { x: 700, y: 380 }, { x: 740, y: 380 },
  
  // Upper walkway (y=130) - between top sections and middle sections
  { x: 200, y: 130 }, { x: 250, y: 130 }, { x: 300, y: 130 }, { x: 350, y: 130 },
  { x: 400, y: 130 }, { x: 450, y: 130 }, { x: 500, y: 130 }, { x: 550, y: 130 }, 
  { x: 600, y: 130 }, { x: 650, y: 130 }, { x: 700, y: 130 }, { x: 740, y: 130 },
  
  // Left vertical connector (x=180) - avoiding all sections on left
  { x: 180, y: 60 }, { x: 180, y: 130 }, { x: 180, y: 200 }, { x: 180, y: 270 },
  { x: 180, y: 340 }, { x: 180, y: 380 }, { x: 180, y: 450 }, { x: 180, y: 520 }, 
  { x: 180, y: 580 }, { x: 180, y: 650 },
  
  // Center vertical connectors
  { x: 300, y: 60 }, { x: 300, y: 130 }, { x: 300, y: 200 }, { x: 300, y: 270 },
  { x: 300, y: 340 }, { x: 300, y: 380 }, { x: 300, y: 450 }, { x: 300, y: 520 },
  { x: 300, y: 580 }, { x: 300, y: 650 },
  
  { x: 400, y: 60 }, { x: 400, y: 100 }, { x: 400, y: 130 }, { x: 400, y: 200 },
  { x: 400, y: 270 }, { x: 400, y: 340 }, { x: 400, y: 380 }, { x: 400, y: 520 },
  { x: 400, y: 580 }, { x: 400, y: 650 },
  
  { x: 600, y: 60 }, { x: 600, y: 100 }, { x: 600, y: 130 }, { x: 600, y: 200 },
  { x: 600, y: 270 }, { x: 600, y: 340 }, { x: 600, y: 380 }, { x: 600, y: 520 },
  { x: 600, y: 580 }, { x: 600, y: 650 },
  
  // Right vertical connector (x=740) - left of grocery sections
  { x: 740, y: 60 }, { x: 740, y: 100 }, { x: 740, y: 130 }, { x: 740, y: 200 },
  { x: 740, y: 260 }, { x: 740, y: 300 }, { x: 740, y: 380 }, { x: 740, y: 450 },
  { x: 740, y: 520 }, { x: 740, y: 580 }, { x: 740, y: 650 },
];

// Complete and accurate section to department mapping
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

// Find the nearest walkway point that doesn't overlap with sections
const getNearestWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  // Find walkway points that are close but don't overlap with the section
  let nearestPoint = WALKWAY_GRID[0];
  let minDistance = Infinity;
  
  for (const gridPoint of WALKWAY_GRID) {
    // Check if grid point is inside the section (overlapping)
    const isOverlapping = gridPoint.x >= section.x && 
                         gridPoint.x <= section.x + section.width &&
                         gridPoint.y >= section.y && 
                         gridPoint.y <= section.y + section.height;
    
    if (!isOverlapping) {
      const distance = Math.sqrt(Math.pow(centerX - gridPoint.x, 2) + Math.pow(centerY - gridPoint.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = gridPoint;
      }
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
  
  // Direct path if on same horizontal or vertical line
  const sameX = from.x === to.x;
  const sameY = from.y === to.y;
  
  if (sameX || sameY) {
    return [from, to];
  }
  
  // L-shaped path - try both corner options
  const corner1 = WALKWAY_GRID.find(p => p.x === from.x && p.y === to.y);
  const corner2 = WALKWAY_GRID.find(p => p.x === to.x && p.y === from.y);
  
  if (corner1) {
    return [from, { x: corner1.x, y: corner1.y, name: 'Turn', type: 'section' as const }, to];
  } else if (corner2) {
    return [from, { x: corner2.x, y: corner2.y, name: 'Turn', type: 'section' as const }, to];
  }
  
  // Find best intermediate point on walkway grid
  let bestIntermediate = WALKWAY_GRID[0];
  let minTotalDistance = Infinity;
  
  for (const gridPoint of WALKWAY_GRID) {
    const dist1 = calculateDistance(from, { x: gridPoint.x, y: gridPoint.y, name: 'temp', type: 'section' });
    const dist2 = calculateDistance({ x: gridPoint.x, y: gridPoint.y, name: 'temp', type: 'section' }, to);
    const totalDistance = dist1 + dist2;
    
    if (totalDistance < minTotalDistance) {
      minTotalDistance = totalDistance;
      bestIntermediate = gridPoint;
    }
  }
  
  return [from, { x: bestIntermediate.x, y: bestIntermediate.y, name: 'Turn', type: 'section' as const }, to];
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
      console.log(`Including section: ${section.name} (${section.id}) for department: ${departmentName}`);
    }
    return shouldVisit;
  });

  console.log('Sections to visit:', sectionsToVisit.map(s => `${s.name} (${s.id})`));

  if (sectionsToVisit.length === 0) {
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  // Convert sections to nearest walkway points (avoiding overlaps)
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
