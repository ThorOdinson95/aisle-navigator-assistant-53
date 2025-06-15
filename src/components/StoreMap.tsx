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
    if (!sections) return {};
    return sections.reduce((acc, section) => {
      acc[section.name] = { grid_row: section.grid_row, grid_col: section.grid_col };
      return acc;
    }, {} as { [key: string]: { grid_row: number; grid_col: number } });
  }, [sections]);

  const [cartPosition, setCartPosition] = useState<{ grid_row: number; grid_col: number } | null>(null);
  const shortestPath = useOptimalPath(items, sections || []);

  const { gridCols, gridRows } = useMemo(() => {
    if (!sections || sections.length === 0) return { gridCols: 0, gridRows: 0 };
    const maxCol = Math.max(...sections.map(s => s.grid_col));
    const maxRow = Math.max(...sections.map(s => s.grid_row));
    return { gridCols: maxCol, gridRows: maxRow };
  }, [sections]);

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

  const pathSet = useMemo(() => new Set(shortestPath.map(p => `${p.grid_row}-${p.grid_col}`)), [shortestPath]);
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

  const CELL_SIZE = 50;
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
              {/* Draw sections */}
              {sections.map(section => {
                const isItemDept = itemDepartments.has(section.name);
                const isSpecial = section.name === 'Entrance' || section.name === 'Checkout';
                const coordKey = `${section.grid_row}-${section.grid_col}`;
                const isOnPath = pathSet.has(coordKey);

                return (
                  <g key={section.id}>
                    <rect
                      x={(section.grid_col - 1) * CELL_SIZE}
                      y={(section.grid_row - 1) * CELL_SIZE}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      rx="3"
                      className={cn(
                        "transition-all",
                        isItemDept
                          ? "fill-blue-100/50 dark:fill-blue-900/50 stroke-blue-400 dark:stroke-blue-600 stroke-2"
                          : isSpecial
                          ? "fill-slate-200/50 dark:fill-slate-800/50 stroke-slate-400 dark:stroke-slate-600"
                          : "fill-transparent stroke-transparent",
                        isOnPath && !isItemDept && !isSpecial && "fill-slate-200/30 dark:fill-slate-800/30"
                      )}
                    />
                    <text
                      x={(section.grid_col - 0.5) * CELL_SIZE}
                      y={(section.grid_row - 0.5) * CELL_SIZE}
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

              {/* Draw path */}
              {shortestPath.length > 1 && (
                <polyline
                  points={shortestPath.map(p => `${(p.grid_col - 0.5) * CELL_SIZE},${(p.grid_row - 0.5) * CELL_SIZE}`).join(' ')}
                  className="fill-none stroke-blue-500"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* Draw cart icon */}
            {cartPosition && (
              <div
                className="absolute top-4 left-4 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                  transform: `translate(${(cartPosition.grid_col - 0.5) * CELL_SIZE}px, ${(cartPosition.grid_row - 0.5) * CELL_SIZE}px)`,
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
