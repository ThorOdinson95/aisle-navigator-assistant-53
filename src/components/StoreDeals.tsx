
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { allDeals } from "@/data/deals";
import { useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const StoreDeals = () => {
  const storeDeals = useMemo(() => {
    return allDeals.filter(deal => deal.type === 'deal');
  }, []);

  if (storeDeals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        <CardTitle>Store Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
            <ul className="space-y-2 pr-4">
              {storeDeals.map((deal) => (
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

export default StoreDeals;
