
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgePercent } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchDeals } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import type { Deal } from "@/types/supabase";

const StoreWideDeals = () => {
  const { data: allDeals, isLoading, isError } = useQuery<Deal[]>({
    queryKey: ['deals'],
    queryFn: fetchDeals
  });

  const storeWideDeals = useMemo(() => {
    if (!allDeals) return [];
    return allDeals.filter(deal => deal.type === 'deal' && deal.is_store_wide);
  }, [allDeals]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
            <BadgePercent className="h-5 w-5 text-primary" />
            <CardTitle>Store-wide Deals</CardTitle>
        </Header>
        <CardContent className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || storeWideDeals.length === 0) {
    return null;
  }

  return (
    <Card className="transition-transform duration-200 hover:scale-105">
      <CardHeader className="flex flex-row items-center gap-2">
        <BadgePercent className="h-5 w-5 text-primary" />
        <CardTitle>Store-wide Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
            <ul className="space-y-2 pr-4">
              {storeWideDeals.map((deal) => (
                <li key={deal.id} className="rounded-lg border bg-accent/50 p-3 animate-fade-in">
                  <p className="font-semibold text-accent-foreground">{deal.title}</p>
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                </li>
              ))}
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StoreWideDeals;
