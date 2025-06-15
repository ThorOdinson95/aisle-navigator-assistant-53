
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgePercent } from "lucide-react";
import { allDeals } from "@/data/deals";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from 'react';

const StoreWideDeals = () => {
  const storeWideDeals = useMemo(() => {
    return allDeals.filter(deal => deal.type === 'deal' && deal.isStoreWide);
  }, []);

  if (storeWideDeals.length === 0) {
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
