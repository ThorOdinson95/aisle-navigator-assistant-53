import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map, ShoppingCart } from "lucide-react";
import React, { useEffect, useState, useMemo } from 'react';
import type { ShoppingItem } from "@/pages/Index";

interface StoreMapProps {
  items: ShoppingItem[];
}

const departmentLocations: { [key: string]: { top: string; left: string } } = {
  'Sports & Outdoors': { top: '15%', left: '15%' },
  'Toys & Games': { top: '15%', left: '30%' },
  'Electronics': { top: '15%', left: '45%' },
  'Home Office': { top: '15%', left: '60%' },
  'Paper & Cleaning': { top: '20%', left: '70%' },
  'Pet Care': { top: '20%', left: '80%' },
  'Auto Care Center': { top: '25%', left: '10%' },
  'Home': { top: '40%', left: '30%' },
  'Kitchen & Dining': { top: '65%', left: '35%' },
  'Personal Care & Beauty': { top: '85%', left: '25%' },
  'Pharmacy': { top: '85%', left: '40%' },
  'Checkout': { top: '85%', left: '60%' },
  'Dairy': { top: '10%', left: '92%' },
  'Deli': { top: '20%', left: '92%' },
  'Snacks': { top: '35%', left: '92%' },
  'Candy': { top: '45%', left: '92%' },
  'Grocery': { top: '55%', left: '92%' },
  'Frozen': { top: '75%', left: '92%' },
  'Bakery': { top: '85%', left: '82%' },
  'Produce': { top: '85%', left: '92%' },
  'Entrance': { top: '95%', left: '50%' },
};

// Helper functions for path calculation
const parsePercent = (s: string): number => parseFloat(s.replace('%', ''));

const getDistance = (dept1: { top: string; left: string }, dept2: { top: string; left: string }): number => {
    const p1 = { x: parsePercent(dept1.left), y: parsePercent(dept1.top) };
    const p2 = { x: parsePercent(dept2.left), y: parsePercent(dept2.top) };
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
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
    const nextUncheckedItem = items.find(item => !item.checked);
    
    if (nextUncheckedItem) {
      const location = departmentLocations[nextUncheckedItem.department] || departmentLocations['Entrance'];
      setCartPosition(location);
    } else if (items.length > 0) {
      // All items checked, move to checkout
      setCartPosition(departmentLocations['Checkout']);
    } else {
      // List is empty, stay at entrance
      setCartPosition(departmentLocations['Entrance']);
    }
  }, [items]);

  const shortestPath = useMemo(() => {
    const nextUncheckedItem = items.find(item => !item.checked);
    if (!nextUncheckedItem) return [];

    const allUncheckedDepts = [...new Set(items.filter(i => !i.checked).map(i => i.department))];
    const startDeptName = nextUncheckedItem.department;
    const deptsForTsp = allUncheckedDepts.filter(d => d !== startDeptName);
    
    let optimalOrder: string[] = [];

    if (deptsForTsp.length > 0) {
        if (deptsForTsp.length === 1) {
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
            src="/lovable-uploads/20db70f7-42b1-4c52-a705-14232c72cd28.png" 
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
                <line
                  key={index}
                  x1={prevPoint.left} y1={prevPoint.top}
                  x2={point.left} y2={point.top}
                  className="stroke-red-500/80"
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
