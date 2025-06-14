
import { useMemo } from 'react';
import type { ShoppingItem } from '@/pages/Index';
import { departmentLocations } from '@/data/departmentLocations';
import { getDistance, getPermutations } from '@/lib/mapUtils';

export const useOptimalPath = (items: ShoppingItem[]) => {
  const shortestPath = useMemo(() => {
    // Get unique department names for all unchecked items that have a location
    const uncheckedDepts = [...new Set(
      items
        .filter(i => !i.checked && departmentLocations[i.department])
        .map(i => i.department)
    )];

    // If no items to visit, path is from Entrance to Checkout if list has items, otherwise empty.
    if (uncheckedDepts.length === 0) {
      const hasLocatableItems = items.some(i => departmentLocations[i.department]);
      if (hasLocatableItems) {
        return [departmentLocations['Entrance'], departmentLocations['Checkout']];
      }
      return [];
    }
    
    const startNode = 'Entrance';
    const endNode = 'Checkout';
    let optimalOrder: string[] = [];

    // For larger lists, TSP is too slow. Return a suboptimal path to avoid freezing.
    if (uncheckedDepts.length > 8) {
        optimalOrder = uncheckedDepts;
    } else if (uncheckedDepts.length === 1) {
        optimalOrder = uncheckedDepts;
    } else {
        const permutations = getPermutations(uncheckedDepts);
        let minDistance = Infinity;
        let shortestPermutation: string[] = [];

        for (const perm of permutations) {
            let currentDistance = 0;
            // From Entrance to the first department in permutation
            currentDistance += getDistance(departmentLocations[startNode], departmentLocations[perm[0]]);
            
            // Sum of distances between departments in permutation
            for (let i = 0; i < perm.length - 1; i++) {
                currentDistance += getDistance(departmentLocations[perm[i]], departmentLocations[perm[i+1]]);
            }
        
            // From the last department in permutation to Checkout
            currentDistance += getDistance(departmentLocations[perm[perm.length - 1]], departmentLocations[endNode]);
        
            if (currentDistance < minDistance) {
                minDistance = currentDistance;
                shortestPermutation = perm;
            }
        }
        optimalOrder = shortestPermutation;
    }
    
    const waypointDepts = [startNode, ...optimalOrder, endNode];
    // Filter out any potential undefined locations just in case
    return waypointDepts.map(dept => departmentLocations[dept]).filter(Boolean);
  }, [items]);

  return shortestPath;
};
