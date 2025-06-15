
import { useMemo } from 'react';
import type { ShoppingItem } from '@/pages/Index';
import { getDistance } from '@/lib/mapUtils';
import type { Section } from '@/types/supabase';

export const useOptimalPath = (items: ShoppingItem[], sections: Section[]) => {
  const departmentLocations = useMemo(() => {
    if (!sections || sections.length === 0) return {};
    return sections.reduce((acc, section) => {
      acc[section.name] = { grid_row: section.grid_row, grid_col: section.grid_col };
      return acc;
    }, {} as { [key: string]: { grid_row: number; grid_col: number } });
  }, [sections]);

  const shortestPath = useMemo(() => {
    // Get unique department names for all unchecked items that have a location
    const uncheckedDeptsSet = new Set(
      items
        .filter(i => !i.checked && departmentLocations[i.department])
        .map(i => i.department)
    );

    // If no items to visit, path is from Entrance to Checkout if list has items, otherwise empty.
    if (uncheckedDeptsSet.size === 0) {
      const hasLocatableItems = items.some(i => departmentLocations[i.department]);
      if (hasLocatableItems && departmentLocations['Entrance'] && departmentLocations['Checkout']) {
        return [departmentLocations['Entrance'], departmentLocations['Checkout']];
      }
      return [];
    }

    const pathOrder: string[] = ['Entrance'];
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
        // Safeguard, should not be reached if remainingDepts is not empty.
        break;
      }
    }

    pathOrder.push('Checkout');
    
    // Map department names to location objects and filter out any that might be undefined
    return pathOrder.map(dept => departmentLocations[dept]).filter(Boolean);
  }, [items, departmentLocations]);

  return shortestPath;
};
