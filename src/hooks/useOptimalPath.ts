
import { useMemo } from 'react';
import type { ShoppingItem } from '@/pages/Index';
import { departmentLocations } from '@/data/departmentLocations';
import { getDistance, getPermutations } from '@/lib/mapUtils';

export const useOptimalPath = (items: ShoppingItem[]) => {
  const shortestPath = useMemo(() => {
    const validItems = items.filter(i => departmentLocations[i.department]);
    const nextUncheckedItem = validItems.find(item => !item.checked);
    if (!nextUncheckedItem) return [];

    const allUncheckedDepts = [...new Set(validItems.filter(i => !i.checked).map(i => i.department))];
    const startDeptName = nextUncheckedItem.department;
    const deptsForTsp = allUncheckedDepts.filter(d => d !== startDeptName);
    
    let optimalOrder: string[] = [];

    if (deptsForTsp.length > 0) {
        if (deptsForTsp.length > 8) { // Heuristic to avoid freezing browser for large lists
            optimalOrder = deptsForTsp; // Path will be suboptimal but UI won't freeze
        } else if (deptsForTsp.length === 1) {
            optimalOrder = deptsForTsp;
        } else {
            const permutations = getPermutations(deptsForTsp);
            let shortestPermutation: string[] = [];
            let minDistance = Infinity;
            const endNode = 'Checkout';
        
            for (const perm of permutations) {
                let currentDistance = 0;
                currentDistance += getDistance(departmentLocations[startDeptName], departmentLocations[perm[0]]);
                
                for (let i = 0; i < perm.length - 1; i++) {
                    currentDistance += getDistance(departmentLocations[perm[i]], departmentLocations[perm[i+1]]);
                }
            
                currentDistance += getDistance(departmentLocations[perm[perm.length - 1]], departmentLocations[endNode]);
            
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    shortestPermutation = perm;
                }
            }
            optimalOrder = shortestPermutation;
        }
    }
    
    const waypointDepts = [startDeptName, ...optimalOrder, 'Checkout'];
    return waypointDepts.map(dept => departmentLocations[dept]);
  }, [items]);

  return shortestPath;
};
