
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
  
  const pathSet = new Set(shortestPath.map(p => `${p.grid_row}-${p.grid_col}`));

  const gridCells = useMemo(() => {
    if (gridRows === 0 || gridCols === 0) return [];
    const cells = [];
    for (let row = 1; row <= gridRows; row++) {
      for (let col = 1; col <= gridCols; col++) {
        cells.push({ row, col });
      }
    }
    return cells;
  }, [gridRows, gridCols]);

  const sectionsByCoords = useMemo(() => {
    if (!sections) return new Map();
    return sections.reduce((map, section) => {
      map.set(`${section.grid_row}-${section.grid_col}`, section);
      return map;
    }, new Map<string, Section>());
  }, [sections]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <MapIcon className="h-5 w-5 text-primary" />
        <CardTitle>Store Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div 
            className="grid gap-1 bg-slate-200/50 dark:bg-slate-800/20 p-2 rounded-lg relative w-full max-w-lg border border-slate-200 dark:border-slate-800"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
              aspectRatio: `${gridCols} / ${gridRows}`,
            }}
          >
            {gridCells.map(({ row, col }) => {
              const coordKey = `${row}-${col}`;
              const section = sectionsByCoords.get(coordKey);
              const isOnPath = pathSet.has(coordKey);
              const isCartPosition = cartPosition && row === cartPosition.grid_row && col === cartPosition.grid_col;

              if (section) {
                return (
                  <div
                    key={coordKey}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-md border bg-white dark:bg-slate-950 p-1 text-center text-[9px] font-medium text-slate-600 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 dark:text-slate-400 sm:text-[10px]",
                      isOnPath && "bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/50",
                      section.name === "Entrance" && "bg-green-100 text-green-800 border-green-400 dark:bg-green-900/50 dark:text-green-300",
                      section.name === "Checkout" && "bg-red-100 text-red-800 border-red-400 dark:bg-red-900/50 dark:text-red-300",
                    )}
                    style={{ gridColumn: col, gridRow: row }}
                  >
                    {section.name}
                    {isCartPosition && (
                      <div className="absolute transition-all duration-1000 ease-in-out flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-blue-600 fill-blue-400 z-10" />
                          <div className="absolute h-6 w-6 rounded-full bg-blue-500/50 animate-ping"></div>
                      </div>
                    )}
                  </div>
                );
              }

              // Aisle cell
              return (
                <div
                  key={coordKey}
                  className="flex aspect-square items-center justify-center"
                  style={{ gridColumn: col, gridRow: row }}
                >
                  {isOnPath && (
                    <div className="h-2/5 w-2/5 rounded-full bg-blue-300 dark:bg-blue-700" />
                  )}
                  {isCartPosition && (
                      <div className="absolute transition-all duration-1000 ease-in-out flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-blue-600 fill-blue-400 z-10" />
                          <div className="absolute h-6 w-6 rounded-full bg-blue-500/50 animate-ping"></div>
                      </div>
                   )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
