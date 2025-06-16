
import { useMemo } from 'react';
import type { ShoppingItem } from '@/pages/Index';
import { getDistance, generatePath } from '@/lib/mapUtils';

export const useOptimalPath = (
  items: ShoppingItem[],
  departmentLocations: { [key: string]: { grid_row: number; grid_col: number } }
) => {
  const shortestPath = useMemo(() => {
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
    
    // If no items to visit, path is from Entrance to Checkout if list has items, otherwise empty.
    if (uncheckedDeptsSet.size === 0) {
      const hasLocatableItems = items.some(i => departmentLocations[i.department]);
      if (hasLocatableItems && departmentLocations['Entrance'] && departmentLocations['Checkout']) {
        pathOrder = ['Entrance', 'Checkout'];
      }
    } else {
      pathOrder = ['Entrance'];
      let remainingDepts = Array.from(uncheckedDeptsSet);
      let currentLocation = 'Entrance';

      while (remainingDepts.length > 0) {
        let nearestDept = '';
        let minDistance = Infinity;

        for (const dept of remainingDepts) {
          if (!departmentLocations[currentLocation] || !departmentLocations[dept]) continue;
          const distance = getDistance(departmentLocations[currentLocation], departmentLocations[dept]);
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
      pathOrder.push('Checkout');
    }
    
    // Map department names to location objects, filtering out any undefined locations
    const departmentPoints = pathOrder
      .map(dept => departmentLocations[dept])
      .filter(location => location && typeof location.grid_row === 'number' && typeof location.grid_col === 'number');

    // Generate full path with aisles
    return generatePath(departmentPoints);

  }, [items, departmentLocations]);

  return shortestPath;
};
