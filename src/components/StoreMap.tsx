
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map as MapIcon, ShoppingCart } from "lucide-react";
import React, { useEffect, useMemo, useState } from 'react';
import type { ShoppingItem } from "@/pages/Index";
import { useOptimalPath } from '@/hooks/useOptimalPath';
import { useQuery } from "@tanstack/react-query";
import { fetchSections } from "@/lib/queries";
import type { Section } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StoreMapProps {
  items: ShoppingItem[];
}

const StoreMap = ({ items }: StoreMapProps) => {
  const { data: sections, isLoading, isError } = useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: fetchSections,
  });

  const sectionDimensions = useMemo(() => ({
    'Entrance': { width: 2, height: 1 },
    'Checkout': { width: 4, height: 1 },
    'Dairy': { width: 4, height: 1 },
    'Deli': { width: 2, height: 1 },
    'Fresh Produce': { width: 3, height: 2 },
    'Grocery': { width: 5, height: 3 },
    'Paper & Cleaning': { width: 2, height: 2 },
    'Meat': { width: 3, height: 1 },
    'Electronics': { width: 3, height: 2 },
    'Home': { width: 4, height: 2 },
    'Pharmacy': { width: 2, height: 1 },
    'Bakery': { width: 2, height: 2 },
    'Frozen': { width: 4, height: 1 },
    'Snacks': { width: 2, height: 2 },
    'Personal Care & Beauty': { width: 2, height: 2 },
  }), []);

  const augmentedSections = useMemo(() => {
    if (!sections) return [];
    const defaultSize = { width: 2, height: 1 };
    return sections.map(section => ({
      ...section,
      ...(sectionDimensions[section.name as keyof typeof sectionDimensions] || defaultSize)
    }));
  }, [sections, sectionDimensions]);

  const departmentLocations = useMemo(() => {
    if (!augmentedSections.length) return {};
    return augmentedSections.reduce((acc, section) => {
      acc[section.name] = { 
        grid_row: section.grid_row - 1 + section.height / 2, 
        grid_col: section.grid_col - 1 + section.width / 2
      };
      return acc;
    }, {} as { [key: string]: { grid_row: number; grid_col: number } });
  }, [augmentedSections]);

  const [cartPosition, setCartPosition] = useState<{ grid_row: number; grid_col: number } | null>(null);
  const shortestPath = useOptimalPath(items, departmentLocations);

  const { gridCols, gridRows } = useMemo(() => {
    if (!augmentedSections || augmentedSections.length === 0) return { gridCols: 0, gridRows: 0 };
    const maxCol = Math.max(...augmentedSections.map(s => s.grid_col + s.width - 1));
    const maxRow = Math.max(...augmentedSections.map(s => s.grid_row + s.height - 1));
    return { gridCols: maxCol, gridRows: maxRow };
  }, [augmentedSections]);

  useEffect(() => {
    if (!departmentLocations || Object.keys(departmentLocations).length === 0) return;

    const locatableItems = items.filter(item => departmentLocations[item.department]);
    const allItemsChecked = locatableItems.length > 0 && locatableItems.every(item => item.checked);

    if (allItemsChecked) {
      setCartPosition(departmentLocations['Checkout']);
    } else {
      setCartPosition(departmentLocations['Entrance']);
    }
  }, [items, departmentLocations]);

  const itemDepartments = useMemo(() => new Set(items.filter(i => !i.checked).map(i => i.department)), [items]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <MapIcon className="h-5 w-5 text-primary" />
          <CardTitle>Store Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !sections) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <MapIcon className="h-5 w-5 text-primary" />
          <CardTitle>Store Map</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load store map.</p>
        </CardContent>
      </Card>
    );
  }

  const CELL_SIZE = 40;
  const svgWidth = gridCols * CELL_SIZE;
  const svgHeight = gridRows * CELL_SIZE;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <MapIcon className="h-5 w-5 text-primary" />
        <CardTitle>Store Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="relative rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden p-4">
            <svg width={svgWidth} height={svgHeight} className="block">
              {/* Draw path */}
              {shortestPath.length > 1 && (
                <polyline
                  points={shortestPath.map(p => `${p.grid_col * CELL_SIZE},${p.grid_row * CELL_SIZE}`).join(' ')}
                  className="fill-none stroke-blue-500/70"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5 5"
                />
              )}

              {/* Draw sections as rectangles */}
              {augmentedSections.map(section => {
                const isItemDept = itemDepartments.has(section.name);
                const isSpecial = section.name === 'Entrance' || section.name === 'Checkout';
                
                const x = (section.grid_col - 1) * CELL_SIZE;
                const y = (section.grid_row - 1) * CELL_SIZE;
                const w = section.width * CELL_SIZE;
                const h = section.height * CELL_SIZE;

                return (
                  <g key={section.id}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      rx="4"
                      className={cn(
                        "transition-all stroke-1",
                        isItemDept
                          ? "fill-blue-100 dark:fill-blue-900/50 stroke-blue-400 dark:stroke-blue-600"
                          : isSpecial
                          ? "fill-slate-200 dark:fill-slate-800/50 stroke-slate-400 dark:stroke-slate-600"
                          : "fill-white dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700"
                      )}
                    />
                    <text
                      x={x + w / 2}
                      y={y + h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={cn(
                        "text-[10px] font-medium pointer-events-none",
                        isItemDept
                          ? "fill-blue-800 dark:fill-blue-200 font-bold"
                          : "fill-slate-600 dark:fill-slate-400"
                      )}
                    >
                      {section.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Draw cart icon */}
            {cartPosition && (
              <div
                className="absolute top-0 left-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                  transform: `translate(${cartPosition.grid_col * CELL_SIZE}px, ${cartPosition.grid_row * CELL_SIZE}px)`,
                }}
              >
                <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                    <ShoppingCart className="h-6 w-6 text-blue-600 fill-blue-400 z-10" />
                    <div className="absolute h-6 w-6 rounded-full bg-blue-500/50 animate-ping"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
