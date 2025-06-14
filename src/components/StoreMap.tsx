import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map, ShoppingCart } from "lucide-react";
import React, { useEffect, useState, useMemo } from 'react';
import type { ShoppingItem } from "@/pages/Index";

interface StoreMapProps {
  items: ShoppingItem[];
}

const departmentLocations: { [key: string]: { top: string; left: string } } = {
  // Left Side
  'Auto Care Center': { top: '35%', left: '12%' },
  'Sports & Outdoors': { top: '15%', left: '23%' },
  'Auto Accessories': { top: '50%', left: '23%' },
  'Tools & Hardware': { top: '68%', left: '23%' },
  'Outdoor': { top: '82%', left: '15%' },
  'Personal Care & Beauty': { top: '80%', left: '38%' },
  'Pharmacy': { top: '80%', left: '48%' },

  // Center Area
  'Home': { top: '45%', left: '35%' },
  'Kitchen & Dining': { top: '65%', left: '35%' },
  'Toys & Games': { top: '15%', left: '35%' },
  'Electronics': { top: '15%', left: '48%' },
  'Home Office': { top: '15%', left: '60%' },
  'Books': { top: '30%', left: '48%' },
  'Arts & Crafts': { top: '40%', left: '48%' },
  'Seasonal': { top: '52%', left: '48%' }, // covers Celebrate, Seasonal
  'Boys': { top: '30%', left: '65%' },
  'Girls': { top: '30%', left: '70%' },
  'Baby': { top: '35%', left: '75%' },
  'Shoes': { top: '45%', left: '60%' },
  'Mens': { top: '65%', left: '60%' },
  'Ladies': { top: '55%', left: '70%' },

  // Top Right
  'Paper & Cleaning': { top: '15%', left: '68%' },
  'Pet Care': { top: '15%', left: '78%' },
  'Restrooms': { top: '12%', left: '73%' },

  // Far Right (Groceries)
  'Deli': { top: '15%', left: '90%' },
  'Dairy': { top: '12%', left: '90%' },
  'Adult Beverages': { top: '20%', left: '90%' },
  'Snacks': { top: '30%', left: '90%' },
  'Candy': { top: '38%', left: '90%' },
  'Grocery': { top: '48%', left: '90%' },
  'Meat': { top: '55%', left: '88%' },
  'Frozen': { top: '65%', left: '90%' },
  'Bakery': { top: '78%', left: '85%' },
  'Fresh Produce': { top: '78%', left: '90%' },

  // Bottom Area
  'Checkout': { top: '80%', left: '65%' },
  'Entrance': { top: '90%', left: '50%' },
};

// Helper functions for path calculation
const parsePercent = (s: string): number => parseFloat(s.replace('%', ''));

const getDistance = (dept1: { top: string; left: string }, dept2: { top: string; left: string }): number => {
    const p1 = { x: parsePercent(dept1.left), y: parsePercent(dept1.top) };
    const p2 = { x: parsePercent(dept2.left), y: parsePercent(dept2.top) };
    // Using Manhattan distance for grid-like movement to simulate aisles
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

function getPermutations<T>(array: T[]): T[][] {
    const result: T[][] = [];
    function permute(arr: T[], l: number, r: number) {
        if (l === r) {
            result.push([...arr]);
        } else {
            for (let i = l; i <= r; i++) {
                [arr[l], arr[i]] = [arr[i], arr[l]];
                permute(arr, l + 1, r);
                [arr[l], arr[i]] = [arr[i], arr[l]]; // backtrack
            }
        }
    }
    if (array.length > 0) {
      permute(array, 0, array.length - 1);
    }
    return result;
}


const StoreMap = ({ items }: StoreMapProps) => {
  const [cartPosition, setCartPosition] = useState(departmentLocations['Entrance']);

  useEffect(() => {
    // Only consider items that have a valid department on the map
    const locatableItems = items.filter(item => departmentLocations[item.department]);
    const nextUncheckedItem = locatableItems.find(item => !item.checked);
    
    if (nextUncheckedItem) {
      const location = departmentLocations[nextUncheckedItem.department];
      setCartPosition(location);
    } else if (items.length > 0) {
      // All items checked or remaining items are not locatable, move to checkout
      setCartPosition(departmentLocations['Checkout']);
    } else {
      // List is empty, stay at entrance
      setCartPosition(departmentLocations['Entrance']);
    }
  }, [items]);

  const shortestPath = useMemo(() => {
    // Filter out items that don't have a department on the map to prevent errors
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

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Map className="h-5 w-5 text-primary" />
        <CardTitle>Store Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
          <img 
            src="/lovable-uploads/55b86e5f-e2b8-4538-bea6-86a63f6504e9.png" 
            alt="Walmart store map"
            className="w-full h-auto rounded-lg"
          />
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-red-500" />
              </marker>
            </defs>
            {shortestPath.map((point, index) => {
              if (index === 0) return null;
              const prevPoint = shortestPath[index-1];
              return (
                <polyline
                  key={index}
                  points={`${prevPoint.left},${prevPoint.top} ${point.left},${prevPoint.top} ${point.left},${point.top}`}
                  className="fill-none stroke-red-500/80"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="5, 5"
                />
              )
            })}
            {shortestPath.map((point, index) => (
              <circle
                key={`c-${index}`}
                cx={point.left}
                cy={point.top}
                r="4"
                className="fill-red-500 stroke-white"
                strokeWidth="1.5"
              />
            ))}
          </svg>
          <div 
            className="absolute transition-all duration-1000 ease-in-out"
            style={{ 
              top: cartPosition.top, 
              left: cartPosition.left,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <ShoppingCart className="h-8 w-8 text-red-600 fill-red-400" />
            <div className="absolute top-0 left-0 h-8 w-8 rounded-full bg-red-500/50 animate-ping"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
