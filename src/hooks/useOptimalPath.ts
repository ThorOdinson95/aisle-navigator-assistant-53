
import { useMemo } from 'react';
import type { ShoppingItem } from '@/pages/Index';
import { getDistance, generatePath } from '@/lib/mapUtils';

export const useOptimalPath = (
  items: ShoppingItem[],
  departmentLocations: { [key: string]: { grid_row: number; grid_col: number } }
) => {
  const shortestPath = useMemo(() => {
    // Early return if no department locations
    if (!departmentLocations || Object.keys(departmentLocations).length === 0) {
      return [];
    }
    
    // Get unique department names for all unchecked items that have a location
    const uncheckedDeptsSet = new Set(
      items
        .filter(i => !i.checked && departmentLocations[i.department])
        .map(i => i.department)
    );

    let pathOrder: string[] = [];
    
    // If no items to visit, path is from Entrance to Checkout if both exist
    if (uncheckedDeptsSet.size === 0) {
      const hasLocatableItems = items.some(i => departmentLocations[i.department]);
      if (hasLocatableItems && departmentLocations['Entrance'] && departmentLocations['Checkout']) {
        pathOrder = ['Entrance', 'Checkout'];
      }
    } else {
      // Only add Entrance if it exists
      if (departmentLocations['Entrance']) {
        pathOrder = ['Entrance'];
      }
      
      let remainingDepts = Array.from(uncheckedDeptsSet);
      let currentLocation = pathOrder.length > 0 ? 'Entrance' : remainingDepts[0];

      while (remainingDepts.length > 0) {
        let nearestDept = '';
        let minDistance = Infinity;

        for (const dept of remainingDepts) {
          const currentLoc = departmentLocations[currentLocation];
          const deptLoc = departmentLocations[dept];
          
          if (!currentLoc || !deptLoc) continue;
          
          const distance = getDistance(currentLoc, deptLoc);
          if (distance < minDistance) {
            minDistance = distance;
            nearestDept = dept;
          }
        }

        if (nearestDept) {
          pathOrder.push(nearestDept);
          currentLocation = nearestDept;
          remainingDepts = remainingDepts.filter(d => d !== nearestDept);
        } else {
          break;
        }
      }
      
      // Only add Checkout if it exists
      if (departmentLocations['Checkout']) {
        pathOrder.push('Checkout');
      }
    }
    
    // Map department names to location objects, filtering out any undefined locations
    const departmentPoints = pathOrder
      .map(dept => departmentLocations[dept])
      .filter(location => location && 
        typeof location.grid_row === 'number' && 
        typeof location.grid_col === 'number'
      );

    // Only generate path if we have valid points
    if (departmentPoints.length < 2) {
      return departmentPoints;
    }

    // Generate full path with aisles
    return generatePath(departmentPoints);

  }, [items, departmentLocations]);

  return shortestPath;
};
