
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from 'react';
import type { ShoppingItem } from "@/pages/Index";
import { departmentLocations } from '@/data/departmentLocations';
import { useOptimalPath } from '@/hooks/useOptimalPath';

interface StoreMapProps {
  items: ShoppingItem[];
}

const StoreMap = ({ items }: StoreMapProps) => {
  const [cartPosition, setCartPosition] = useState(departmentLocations['Entrance']);
  const shortestPath = useOptimalPath(items);

  useEffect(() => {
    const locatableItems = items.filter(item => departmentLocations[item.department]);
    const nextUncheckedItem = locatableItems.find(item => !item.checked);
    
    if (nextUncheckedItem) {
      const location = departmentLocations[nextUncheckedItem.department];
      setCartPosition(location);
    } else if (items.length > 0 && locatableItems.length > 0) {
      // All locatable items checked, move to checkout
      setCartPosition(departmentLocations['Checkout']);
    } else {
      // List is empty or has no locatable items, stay at entrance
      setCartPosition(departmentLocations['Entrance']);
    }
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
              if (index === 0 || !point) return null;
              const prevPoint = shortestPath[index-1];
              if (!prevPoint) return null;
              return (
                <React.Fragment key={index}>
                  <line
                    x1={prevPoint.left}
                    y1={prevPoint.top}
                    x2={point.left}
                    y2={prevPoint.top}
                    className="stroke-red-500/80"
                    strokeWidth="2"
                    strokeDasharray="5, 5"
                  />
                  <line
                    x1={point.left}
                    y1={prevPoint.top}
                    x2={point.left}
                    y2={point.top}
                    className="stroke-red-500/80"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    strokeDasharray="5, 5"
                  />
                </React.Fragment>
              )
            })}
            {shortestPath.map((point, index) => (
              point && <circle
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
