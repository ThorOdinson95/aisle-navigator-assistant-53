
import { storeSections } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';

export interface PathPoint {
  x: number;
  y: number;
  name: string;
  type: 'entrance' | 'section' | 'checkout';
  department?: string;
}

// Fixed positions for entrance and checkout with better accessibility
const ENTRANCE_POSITION: PathPoint = { x: 145, y: 650, name: 'Store Entrance', type: 'entrance' };
const CHECKOUT_POSITION: PathPoint = { x: 515, y: 540, name: 'Checkout', type: 'checkout' };

// Enhanced walkway grid with better coverage and logical flow
const MAIN_WALKWAYS = [
  // Primary horizontal walkways (main store aisles)
  { x: 50, y: 650, type: 'main' }, { x: 150, y: 650, type: 'main' }, { x: 250, y: 650, type: 'main' }, 
  { x: 350, y: 650, type: 'main' }, { x: 450, y: 650, type: 'main' }, { x: 550, y: 650, type: 'main' }, 
  { x: 650, y: 650, type: 'main' }, { x: 750, y: 650, type: 'main' }, { x: 850, y: 650, type: 'main' },
  
  // Secondary horizontal walkways
  { x: 50, y: 520, type: 'secondary' }, { x: 150, y: 520, type: 'secondary' }, { x: 250, y: 520, type: 'secondary' }, 
  { x: 350, y: 520, type: 'secondary' }, { x: 450, y: 520, type: 'secondary' }, { x: 550, y: 520, type: 'secondary' }, 
  { x: 650, y: 520, type: 'secondary' }, { x: 750, y: 520, type: 'secondary' }, { x: 850, y: 520, type: 'secondary' },
  
  { x: 50, y: 380, type: 'secondary' }, { x: 150, y: 380, type: 'secondary' }, { x: 250, y: 380, type: 'secondary' }, 
  { x: 350, y: 380, type: 'secondary' }, { x: 450, y: 380, type: 'secondary' }, { x: 550, y: 380, type: 'secondary' }, 
  { x: 650, y: 380, type: 'secondary' }, { x: 750, y: 380, type: 'secondary' }, { x: 850, y: 380, type: 'secondary' },
  
  { x: 50, y: 130, type: 'secondary' }, { x: 150, y: 130, type: 'secondary' }, { x: 250, y: 130, type: 'secondary' }, 
  { x: 350, y: 130, type: 'secondary' }, { x: 450, y: 130, type: 'secondary' }, { x: 550, y: 130, type: 'secondary' }, 
  { x: 650, y: 130, type: 'secondary' }, { x: 750, y: 130, type: 'secondary' }, { x: 850, y: 130, type: 'secondary' },
  
  // Primary vertical walkways (main corridors)
  { x: 190, y: 50, type: 'main' }, { x: 190, y: 150, type: 'main' }, { x: 190, y: 250, type: 'main' }, 
  { x: 190, y: 350, type: 'main' }, { x: 190, y: 450, type: 'main' }, { x: 190, y: 550, type: 'main' }, { x: 190, y: 650, type: 'main' },
  
  { x: 390, y: 50, type: 'main' }, { x: 390, y: 150, type: 'main' }, { x: 390, y: 250, type: 'main' }, 
  { x: 390, y: 350, type: 'main' }, { x: 390, y: 450, type: 'main' }, { x: 390, y: 550, type: 'main' }, { x: 390, y: 650, type: 'main' },
  
  { x: 740, y: 50, type: 'main' }, { x: 740, y: 150, type: 'main' }, { x: 740, y: 250, type: 'main' }, 
  { x: 740, y: 350, type: 'main' }, { x: 740, y: 450, type: 'main' }, { x: 740, y: 550, type: 'main' }, { x: 740, y: 650, type: 'main' },
];

// Enhanced section to department mapping
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

// Find the nearest section to a given point
const findNearestSection = (point: { x: number; y: number }): any | null => {
  let nearestSection = null;
  let minDistance = Infinity;
  
  for (const section of storeSections) {
    const sectionCenterX = section.x + section.width / 2;
    const sectionCenterY = section.y + section.height / 2;
    const distance = Math.sqrt(
      Math.pow(point.x - sectionCenterX, 2) + Math.pow(point.y - sectionCenterY, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestSection = section;
    }
  }
  
  return nearestSection;
};

// Smart walkway point selection with priority for main walkways
const getNearestWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  let bestPoint = MAIN_WALKWAYS[0];
  let minScore = Infinity;
  
  for (const walkway of MAIN_WALKWAYS) {
    // Skip points inside the section
    const isInside = walkway.x >= section.x && 
                    walkway.x <= section.x + section.width &&
                    walkway.y >= section.y && 
                    walkway.y <= section.y + section.height;
    
    if (!isInside) {
      const distance = Math.sqrt(Math.pow(centerX - walkway.x, 2) + Math.pow(centerY - walkway.y, 2));
      
      // Prefer main walkways over secondary ones
      const walkwayPriority = walkway.type === 'main' ? 0 : 50;
      const totalScore = distance + walkwayPriority;
      
      if (totalScore < minScore) {
        minScore = totalScore;
        bestPoint = walkway;
      }
    }
  }
  
  return {
    x: bestPoint.x,
    y: bestPoint.y,
    name: section.name,
    type: 'section' as const,
    department: SECTION_TO_DEPARTMENT[section.id]
  };
};

// Improved pathfinding using A* algorithm concepts
const findOptimalRoute = (points: PathPoint[]): PathPoint[] => {
  if (points.length <= 2) return points;
  
  // Use a simple nearest neighbor with look-ahead optimization
  const route: PathPoint[] = [points[0]];
  const remaining = points.slice(1, -1); // Exclude start and end
  let current = points[0];
  
  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Infinity;
    
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const distance = calculateDistance(current, candidate);
      
      // Look ahead to see if this choice leads to a good next step
      let lookAheadPenalty = 0;
      if (remaining.length > 1) {
        const otherPoints = remaining.filter((_, idx) => idx !== i);
        const minDistanceFromCandidate = Math.min(...otherPoints.map(p => calculateDistance(candidate, p)));
        lookAheadPenalty = minDistanceFromCandidate * 0.3; // Weight for future planning
      }
      
      const totalScore = distance + lookAheadPenalty;
      
      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestIndex = i;
      }
    }
    
    const nextPoint = remaining[bestIndex];
    route.push(nextPoint);
    current = nextPoint;
    remaining.splice(bestIndex, 1);
  }
  
  // Add the final point (checkout)
  route.push(points[points.length - 1]);
  return route;
};

export const calculateOptimalPath = (items: ShoppingItem[]): PathPoint[] => {
  const uncheckedDepartments = new Set(
    items.filter(item => !item.checked).map(item => item.department)
  );

  if (uncheckedDepartments.size === 0) {
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  console.log('Planning route for departments:', Array.from(uncheckedDepartments));

  // Find sections to visit with better matching
  const sectionsToVisit = storeSections.filter(section => {
    const departmentName = SECTION_TO_DEPARTMENT[section.id];
    return departmentName && uncheckedDepartments.has(departmentName);
  });

  console.log('Visiting sections:', sectionsToVisit.map(s => s.name));

  if (sectionsToVisit.length === 0) {
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  // Convert to walkway points
  const sectionPoints = sectionsToVisit.map(section => getNearestWalkwayPoint(section));
  
  // Create full route including entrance and checkout
  const allPoints = [ENTRANCE_POSITION, ...sectionPoints, CHECKOUT_POSITION];
  
  // Optimize the route using direct connections
  const optimizedRoute = findOptimalRoute(allPoints);
  
  console.log('Optimized navigation route:', optimizedRoute.map(p => `${p.name} (${p.x}, ${p.y})`));
  return optimizedRoute;
};

export const generateSVGPath = (points: PathPoint[]): string => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  // Create direct lines between points (no intermediate via points)
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    path += ` L ${current.x} ${current.y}`;
  }
  
  return path;
};
