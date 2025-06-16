
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

  const departmentLocations = useMemo(() => {
    if (!sections || sections.length === 0) return {};
    return sections.reduce((acc, section) => {
      if (section && 
          typeof section.grid_row === 'number' && 
          typeof section.grid_col === 'number') {
        acc[section.name] = { 
          grid_row: section.grid_row, 
          grid_col: section.grid_col
        };
      }
      return acc;
    }, {} as { [key: string]: { grid_row: number; grid_col: number } });
  }, [sections]);

  const [cartPosition, setCartPosition] = useState<{ grid_row: number; grid_col: number } | null>(null);
  const shortestPath = useOptimalPath(items, departmentLocations);

  const gridCols = 12;
  const gridRows = 8;

  useEffect(() => {
    if (!departmentLocations || Object.keys(departmentLocations).length === 0) return;

    const locatableItems = items.filter(item => departmentLocations[item.department]);
    const allItemsChecked = locatableItems.length > 0 && locatableItems.every(item => item.checked);

    if (allItemsChecked && departmentLocations['Checkout']) {
      setCartPosition(departmentLocations['Checkout']);
    } else if (departmentLocations['Entrance']) {
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
              {shortestPath && shortestPath.length > 1 && (
                <polyline
                  points={shortestPath
                    .filter(p => p && typeof p.grid_col === 'number' && typeof p.grid_row === 'number')
                    .map(p => `${p.grid_col * CELL_SIZE},${p.grid_row * CELL_SIZE}`)
                    .join(' ')}
                  className="fill-none stroke-blue-500/70"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5 5"
                />
              )}

              {/* Draw sections as squares */}
              {sections.map(section => {
                if (!section || 
                    typeof section.grid_row !== 'number' || 
                    typeof section.grid_col !== 'number') {
                  return null;
                }
                
                const isItemDept = itemDepartments.has(section.name);
                const isSpecial = section.name === 'Entrance' || section.name === 'Checkout';
                
                const x = (section.grid_col - 1) * CELL_SIZE;
                const y = (section.grid_row - 1) * CELL_SIZE;
                const size = CELL_SIZE;

                return (
                  <g key={section.id}>
                    <rect
                      x={x}
                      y={y}
                      width={size}
                      height={size}
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
                      x={x + size / 2}
                      y={y + size / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={cn(
                        "text-[8px] font-medium pointer-events-none",
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
                  transform: `translate(${cartPosition.grid_col * CELL_SIZE + 16}px, ${cartPosition.grid_row * CELL_SIZE + 16}px)`,
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
