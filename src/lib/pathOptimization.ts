
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

// Enhanced walkway grid with more coverage and better spacing
const WALKWAY_GRID = [
  // Bottom main walkway (y=650-660) - below all sections
  { x: 50, y: 650 }, { x: 100, y: 650 }, { x: 145, y: 650 }, { x: 200, y: 650 }, 
  { x: 250, y: 650 }, { x: 300, y: 650 }, { x: 350, y: 650 }, { x: 400, y: 650 },
  { x: 450, y: 650 }, { x: 500, y: 650 }, { x: 550, y: 650 }, { x: 600, y: 650 }, 
  { x: 650, y: 650 }, { x: 700, y: 650 }, { x: 750, y: 650 }, { x: 800, y: 650 },
  { x: 850, y: 650 }, { x: 900, y: 650 }, { x: 950, y: 650 },
  
  // Mid-low walkway (y=520-530) - between checkout and sections
  { x: 50, y: 520 }, { x: 100, y: 520 }, { x: 150, y: 520 }, { x: 200, y: 520 }, 
  { x: 250, y: 520 }, { x: 300, y: 520 }, { x: 350, y: 520 }, { x: 400, y: 520 },
  { x: 450, y: 520 }, { x: 500, y: 520 }, { x: 550, y: 520 }, { x: 600, y: 520 }, 
  { x: 650, y: 520 }, { x: 700, y: 520 }, { x: 740, y: 520 }, { x: 800, y: 520 },
  { x: 850, y: 520 }, { x: 900, y: 520 },
  
  // Mid walkway (y=380-390) - between apparel and grocery sections
  { x: 50, y: 380 }, { x: 100, y: 380 }, { x: 150, y: 380 }, { x: 200, y: 380 }, 
  { x: 250, y: 380 }, { x: 300, y: 380 }, { x: 350, y: 380 }, { x: 400, y: 380 },
  { x: 450, y: 380 }, { x: 500, y: 380 }, { x: 550, y: 380 }, { x: 600, y: 380 }, 
  { x: 650, y: 380 }, { x: 700, y: 380 }, { x: 740, y: 380 }, { x: 800, y: 380 },
  { x: 850, y: 380 }, { x: 900, y: 380 },
  
  // Upper walkway (y=130-140) - between top sections and middle sections
  { x: 50, y: 130 }, { x: 100, y: 130 }, { x: 150, y: 130 }, { x: 200, y: 130 }, 
  { x: 250, y: 130 }, { x: 300, y: 130 }, { x: 350, y: 130 }, { x: 400, y: 130 },
  { x: 450, y: 130 }, { x: 500, y: 130 }, { x: 550, y: 130 }, { x: 600, y: 130 }, 
  { x: 650, y: 130 }, { x: 700, y: 130 }, { x: 740, y: 130 }, { x: 800, y: 130 },
  { x: 850, y: 130 }, { x: 900, y: 130 },
  
  // Top walkway (y=100-110) - above top sections
  { x: 50, y: 100 }, { x: 100, y: 100 }, { x: 150, y: 100 }, { x: 200, y: 100 }, 
  { x: 250, y: 100 }, { x: 300, y: 100 }, { x: 350, y: 100 }, { x: 400, y: 100 },
  { x: 450, y: 100 }, { x: 500, y: 100 }, { x: 550, y: 100 }, { x: 600, y: 100 }, 
  { x: 650, y: 100 }, { x: 700, y: 100 }, { x: 740, y: 100 }, { x: 800, y: 100 },
  { x: 850, y: 100 }, { x: 900, y: 100 },
  
  // Very top walkway (y=60-70) - for top sections
  { x: 50, y: 60 }, { x: 100, y: 60 }, { x: 150, y: 60 }, { x: 200, y: 60 }, 
  { x: 250, y: 60 }, { x: 300, y: 60 }, { x: 350, y: 60 }, { x: 400, y: 60 },
  { x: 450, y: 60 }, { x: 500, y: 60 }, { x: 550, y: 60 }, { x: 600, y: 60 }, 
  { x: 650, y: 60 }, { x: 700, y: 60 }, { x: 740, y: 60 }, { x: 800, y: 60 },
  { x: 850, y: 60 }, { x: 900, y: 60 },
  
  // Vertical connectors - multiple lanes for better coverage
  // Left corridor (x=180)
  { x: 180, y: 20 }, { x: 180, y: 60 }, { x: 180, y: 100 }, { x: 180, y: 130 }, 
  { x: 180, y: 200 }, { x: 180, y: 270 }, { x: 180, y: 340 }, { x: 180, y: 380 }, 
  { x: 180, y: 450 }, { x: 180, y: 520 }, { x: 180, y: 580 }, { x: 180, y: 650 },
  
  // Center-left corridor (x=290)
  { x: 290, y: 20 }, { x: 290, y: 60 }, { x: 290, y: 100 }, { x: 290, y: 130 }, 
  { x: 290, y: 200 }, { x: 290, y: 270 }, { x: 290, y: 340 }, { x: 290, y: 380 }, 
  { x: 290, y: 450 }, { x: 290, y: 520 }, { x: 290, y: 580 }, { x: 290, y: 650 },
  
  // Center corridor (x=385)
  { x: 385, y: 20 }, { x: 385, y: 60 }, { x: 385, y: 100 }, { x: 385, y: 130 }, 
  { x: 385, y: 200 }, { x: 385, y: 270 }, { x: 385, y: 340 }, { x: 385, y: 380 }, 
  { x: 385, y: 450 }, { x: 385, y: 520 }, { x: 385, y: 580 }, { x: 385, y: 650 },
  
  // Center-right corridor (x=585)
  { x: 585, y: 20 }, { x: 585, y: 60 }, { x: 585, y: 100 }, { x: 585, y: 130 }, 
  { x: 585, y: 200 }, { x: 585, y: 270 }, { x: 585, y: 340 }, { x: 585, y: 380 }, 
  { x: 585, y: 450 }, { x: 585, y: 520 }, { x: 585, y: 580 }, { x: 585, y: 650 },
  
  // Right corridor (x=740)
  { x: 740, y: 20 }, { x: 740, y: 60 }, { x: 740, y: 100 }, { x: 740, y: 130 }, 
  { x: 740, y: 200 }, { x: 740, y: 260 }, { x: 740, y: 300 }, { x: 740, y: 340 }, 
  { x: 740, y: 380 }, { x: 740, y: 450 }, { x: 740, y: 520 }, { x: 740, y: 580 }, 
  { x: 740, y: 650 },
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

// Enhanced function to find optimal walkway point near each section
const getNearestWalkwayPoint = (section: any): PathPoint => {
  const centerX = section.x + section.width / 2;
  const centerY = section.y + section.height / 2;
  
  // Try multiple strategies to find the best walkway point
  let bestPoint = WALKWAY_GRID[0];
  let minDistance = Infinity;
  
  for (const gridPoint of WALKWAY_GRID) {
    // Skip points that are inside the section
    const isInside = gridPoint.x >= section.x && 
                    gridPoint.x <= section.x + section.width &&
                    gridPoint.y >= section.y && 
                    gridPoint.y <= section.y + section.height;
    
    if (!isInside) {
      const distance = Math.sqrt(Math.pow(centerX - gridPoint.x, 2) + Math.pow(centerY - gridPoint.y, 2));
      
      // Prefer points that are close but also accessible
      const accessibilityBonus = isPointAccessible(gridPoint, section) ? 0 : 100;
      const totalScore = distance + accessibilityBonus;
      
      if (totalScore < minDistance) {
        minDistance = totalScore;
        bestPoint = gridPoint;
      }
    }
  }
  
  return {
    x: bestPoint.x,
    y: bestPoint.y,
    name: section.name,
    type: 'section' as const
  };
};

// Check if a walkway point is accessible (not blocked by other sections)
const isPointAccessible = (point: any, targetSection: any): boolean => {
  // Check if point is near the edges of the section for better accessibility
  const sectionEdges = [
    { x: targetSection.x, y: targetSection.y + targetSection.height / 2 }, // left edge
    { x: targetSection.x + targetSection.width, y: targetSection.y + targetSection.height / 2 }, // right edge
    { x: targetSection.x + targetSection.width / 2, y: targetSection.y }, // top edge
    { x: targetSection.x + targetSection.width / 2, y: targetSection.y + targetSection.height }, // bottom edge
  ];
  
  return sectionEdges.some(edge => {
    const distance = Math.sqrt(Math.pow(edge.x - point.x, 2) + Math.pow(edge.y - point.y, 2));
    return distance < 100; // Within reasonable distance of an edge
  });
};

// Enhanced path creation between walkway points
const createWalkwayPath = (from: PathPoint, to: PathPoint): PathPoint[] => {
  if (from.x === to.x && from.y === to.y) {
    return [from];
  }
  
  // Try direct path first if both points are on walkway grid
  const isFromOnGrid = WALKWAY_GRID.some(p => p.x === from.x && p.y === from.y);
  const isToOnGrid = WALKWAY_GRID.some(p => p.x === to.x && p.y === to.y);
  
  if (isFromOnGrid && isToOnGrid) {
    // Check for direct horizontal or vertical path
    if (from.x === to.x || from.y === to.y) {
      return [from, to];
    }
    
    // Try L-shaped path
    const corner1 = WALKWAY_GRID.find(p => p.x === from.x && p.y === to.y);
    const corner2 = WALKWAY_GRID.find(p => p.x === to.x && p.y === from.y);
    
    if (corner1) {
      return [from, { x: corner1.x, y: corner1.y, name: 'Turn', type: 'section' as const }, to];
    } else if (corner2) {
      return [from, { x: corner2.x, y: corner2.y, name: 'Turn', type: 'section' as const }, to];
    }
  }
  
  // Find best intermediate walkway point
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
  
  return [from, { x: bestIntermediate.x, y: bestIntermediate.y, name: 'Via', type: 'section' as const }, to];
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

  // Find ALL sections that match unchecked departments - enhanced matching
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
    console.log('No sections found for departments, checking for missing mappings...');
    // Log missing departments for debugging
    uncheckedDepartments.forEach(dept => {
      const hasMapping = Object.values(SECTION_TO_DEPARTMENT).includes(dept);
      if (!hasMapping) {
        console.log(`Missing mapping for department: ${dept}`);
      }
    });
    return [ENTRANCE_POSITION, CHECKOUT_POSITION];
  }

  // Convert sections to nearest walkway points
  const sectionPoints = sectionsToVisit.map(section => getNearestWalkwayPoint(section));

  // Enhanced optimization using nearest neighbor with better distance calculation
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

  // Build complete walkway path with enhanced routing
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

  // Clean up consecutive duplicate points
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
