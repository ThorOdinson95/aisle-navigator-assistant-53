
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from 'react';
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
